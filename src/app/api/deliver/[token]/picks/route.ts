import { NextResponse } from "next/server";
import { mutateStore } from "@/lib/store";
import type { ClientPickSubmission } from "@/types/album";

type RouteParams = { params: Promise<{ token: string }> };

type PickBody = {
  pin?: string;
  picks: Array<{ assetId: string; note?: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  const { token } = await params;
  const body = (await request.json()) as PickBody;

  if (!body.picks?.length) {
    return NextResponse.json({ error: "Select at least one image" }, { status: 400 });
  }

  let error: string | null = null;

  await mutateStore((store) => {
    const session = store.deliverySessions.find((s) => s.token === token);
    if (!session) {
      error = "Gallery not found";
      return;
    }

    if (session.pin && session.pin !== body.pin) {
      error = "Invalid PIN";
      return;
    }

    if (store.picks[session.id]) {
      error = "Selection already submitted";
      return;
    }

    const album = store.albums.find((a) => a.id === session.albumId);
    if (!album) {
      error = "Album not found";
      return;
    }

    if (album.deliveryState !== "ready_to_pick") {
      error = "Gallery is not open for picking";
      return;
    }

    if (album.pickLimit && body.picks.length > album.pickLimit) {
      error = `You may select up to ${album.pickLimit} images`;
      return;
    }

    const visibleIds = new Set(
      album.assets.filter((a) => a.visibleToClient).map((a) => a.id),
    );
    for (const pick of body.picks) {
      if (!visibleIds.has(pick.assetId)) {
        error = "Invalid selection";
        return;
      }
    }

    album.assets.forEach((a) => {
      a.selectionState = "none";
      a.clientPickNumber = undefined;
      a.clientNote = undefined;
    });

    body.picks.forEach((pick, i) => {
      const asset = album.assets.find((a) => a.id === pick.assetId);
      if (!asset) return;
      asset.selectionState = "picked";
      asset.clientPickNumber = i + 1;
      asset.clientNote = pick.note;
    });

    album.deliveryState = "picked";
    session.submittedAt = new Date().toISOString();

    const submission: ClientPickSubmission = {
      deliverySessionId: session.id,
      picks: body.picks.map((p, i) => ({
        assetId: p.assetId,
        pickNumber: i + 1,
        note: p.note,
      })),
      submittedAt: session.submittedAt,
    };
    store.picks[session.id] = submission;
  });

  if (error) {
    const status = error === "Invalid PIN" ? 401 : 400;
    return NextResponse.json({ error }, { status });
  }

  return NextResponse.json({ ok: true });
}
