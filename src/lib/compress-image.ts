/** Resize + compress for upload (keeps payloads reasonable on serverless). */
export async function compressImageFile(
  file: File,
  maxEdge = 1600,
  quality = 0.82,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return { dataUrl, width, height };
}

export async function compressFiles(
  files: File[],
  onProgress?: (done: number, total: number) => void,
): Promise<Array<{ dataUrl: string; width: number; height: number; filename: string }>> {
  const out: Array<{ dataUrl: string; width: number; height: number; filename: string }> = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith("image/")) continue;
    const compressed = await compressImageFile(file);
    out.push({ ...compressed, filename: file.name });
    onProgress?.(i + 1, files.length);
  }
  return out;
}
