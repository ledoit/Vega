import { head, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { createSeedStore } from "./seed";
import type { VegaStore } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "vega-store.json");
const BLOB_PATHNAME = "vega-store.json";

let memoryStore: VegaStore | null = null;
let loadPromise: Promise<VegaStore> | null = null;

async function readFromDisk(): Promise<VegaStore | null> {
  if (process.env.VERCEL) return null;
  try {
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    return JSON.parse(raw) as VegaStore;
  } catch {
    return null;
  }
}

async function readFromBlob(): Promise<VegaStore | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const meta = await head(BLOB_PATHNAME, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    const res = await fetch(meta.url);
    if (!res.ok) return null;
    return (await res.json()) as VegaStore;
  } catch {
    return null;
  }
}

async function writeToDisk(store: VegaStore): Promise<void> {
  if (process.env.VERCEL) return;
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(store), "utf-8");
}

async function writeToBlob(store: VegaStore): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  await put(BLOB_PATHNAME, JSON.stringify(store), {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function loadStore(): Promise<VegaStore> {
  if (memoryStore) return memoryStore;
  if (!loadPromise) {
    loadPromise = (async () => {
      const blob = await readFromBlob();
      const disk = blob ? null : await readFromDisk();
      memoryStore = blob ?? disk ?? createSeedStore();
      if (!blob && !disk) {
        await writeToDisk(memoryStore);
        await writeToBlob(memoryStore);
      }
      return memoryStore;
    })();
  }
  return loadPromise;
}

export async function saveStore(store: VegaStore): Promise<VegaStore> {
  memoryStore = store;
  await Promise.all([writeToDisk(store), writeToBlob(store)]);
  return store;
}

export async function mutateStore(
  fn: (store: VegaStore) => void | Promise<void>,
): Promise<VegaStore> {
  const store = await loadStore();
  await fn(store);
  return saveStore(store);
}

export function deliveryStateLabel(
  state: VegaStore["albums"][0]["deliveryState"],
): string {
  const labels = {
    draft: "Draft",
    ready_to_pick: "Ready to pick",
    picked: "Awaiting retouch",
    finalized: "Finals ready",
  };
  return labels[state];
}
