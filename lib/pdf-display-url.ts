export function getPdfReaderUrl(resolvedUrl: string): string {
  const trimmed = resolvedUrl.trim();
  if (!trimmed) return "";

  const base =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://cms.flyweb.space";

  try {
    const pdf = new URL(trimmed);
    const cms = new URL(base);
    if (pdf.origin === cms.origin) {
      return `/api/pdf-proxy?url=${encodeURIComponent(trimmed)}`;
    }
  } catch {
    // leave unchanged
  }

  return trimmed;
}
