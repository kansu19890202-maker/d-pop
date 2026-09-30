export function instagramUrl(value: string) {
  const trimmed = value.trim().replace(/^@/, "");
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://instagram.com/${trimmed.replace(/^instagram\.com\//i, "")}`;
}

export function xUrl(value: string) {
  const trimmed = value.trim().replace(/^@/, "");
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://x.com/${trimmed.replace(/^(x|twitter)\.com\//i, "")}`;
}

export function webUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
