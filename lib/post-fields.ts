export function parseEightDigitDate(value: string): string | null {
  if (!/^\d{8}$/.test(value)) return null;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`;
}

export function dateToDigits(date: string): string {
  const parts = date.split(".");
  if (parts.length === 3) return parts.join("");
  if (parts.length === 2) return `${parts[0]}${parts[1]}01`;
  return date.replace(/\D/g, "").slice(0, 8);
}

export function normalizeTag(value: string) {
  return value.trim().replace(/^#+/, "").replace(/\s+/g, "");
}

async function drawToCanvas(file: File) {
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1600;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("preview");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  return canvas;
}

export async function fileToPreview(file: File): Promise<string> {
  return (await drawToCanvas(file)).toDataURL("image/jpeg", 0.82);
}

export async function fileToJpegBlob(file: File): Promise<Blob> {
  const canvas = await drawToCanvas(file);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((value) => resolve(value), "image/jpeg", 0.82),
  );
  if (!blob) throw new Error("preview");
  return blob;
}
