import { NextRequest, NextResponse } from "next/server";

const WORDPRESS_API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://cms.flyweb.space";

function allowedOrigin(): string | null {
  try {
    return new URL(WORDPRESS_API_URL).origin;
  } catch {
    return null;
  }
}

function isAllowedPdfUrl(target: URL, cmsOrigin: string): boolean {
  if (target.origin !== cmsOrigin) return false;
  const path = target.pathname.toLowerCase();
  if (!path.startsWith("/wp-content/uploads/")) return false;
  if (!path.endsWith(".pdf")) return false;
  return true;
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");
  if (!raw?.trim()) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const cmsOrigin = allowedOrigin();
  if (!cmsOrigin) {
    return NextResponse.json({ error: "Invalid CMS config" }, { status: 500 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!isAllowedPdfUrl(target, cmsOrigin)) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
  }

  const upstream = await fetch(target.toString(), {
    headers: { Accept: "application/pdf,*/*" },
    cache: "no-store",
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Upstream failed", status: upstream.status },
      { status: 502 }
    );
  }

  const contentType =
    upstream.headers.get("content-type") || "application/pdf";

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
