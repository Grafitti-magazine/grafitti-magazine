/**
 * WordPress REST API Service
 *
 * This file contains TypeScript type definitions and fetch functions
 * for fetching content from WordPress Custom Post Types.
 *
 * Key principle: This file is PURE DATA FETCHING - no React hooks or side effects.
 * Components use these functions via Server Components or getStaticProps.
 */

import { WORDPRESS_ENDPOINTS, WORDPRESS_CONFIG } from "./wordpress";

// ─── Type Definitions ─────────────────────────────────────────────────────

/**
 * ACF (Advanced Custom Fields) metadata from WordPress
 * Returned as nested object in REST API responses
 */
export interface ACFFields {
  [key: string]: string | number | boolean | object;
}

/**
 * WordPress REST API response structure (standard fields + ACF)
 */
interface WordPressPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  date: string;
  /** ACF may be absent or `false` when no field group applies */
  acf?: ACFFields | false;
}

/**
 * PDF */
export interface PdfFile {
  id: number;
  slug: string;
  title: string;
  publishedDate: string;
  pdfFileUrl: string; // ACF file field - direct URL to PDF
}

/**
 * video */
export interface VideoPost {
  id: number;
  slug: string;
  title: string;
  publishedDate: string;
  description: string; 
  fullDescription: string; 
  thumbnail: string; 
  videoEmbedUrl: string; 
}

// ─── Slug helpers (WordPress may return percent-encoded slugs; Next params are decoded) ─

/** Decode slug once so route params match REST `slug` values. */
export function canonicalSlug(raw: string): string {
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

// transform functions 

function getAcfFields(post: WordPressPost): ACFFields {
  const raw = post.acf;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as ACFFields;
  }
  return {};
}


function acfString(value: unknown): string {
  if (value === null || value === undefined || value === false) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (typeof o.rendered === "string") return o.rendered.trim();
  }
  return "";
}

function normalizeVideoEmbedUrl(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  try {
    const u = new URL(s);
    const host = u.hostname.toLowerCase();
    if (
      (host === "www.youtube.com" || host === "youtube.com" || host === "m.youtube.com") &&
      (u.pathname === "/watch" || u.pathname.startsWith("/watch/"))
    ) {
      const vid = u.searchParams.get("v");
      if (vid) return `https://www.youtube.com/embed/${vid}`;
    }
    if (host === "youtu.be") {
      const vid = u.pathname.replace(/^\//, "").split("/")[0];
      if (vid) return `https://www.youtube.com/embed/${vid}`;
    }
  } catch {
    // not a valid URL; return as-is for Vimeo etc.
  }
  return s;
}

type AcfImageObject = {
  url?: string;
  sizes?: Record<string, string | { url?: string } | undefined>;
};

function pickSizeUrlFromImageObject(img: AcfImageObject): string {
  if (typeof img.url === "string" && img.url.trim()) return img.url.trim();
  const sizes = img.sizes;
  if (!sizes || typeof sizes !== "object") return "";
  const keys = ["full", "large", "medium_large", "medium", "thumbnail"] as const;
  for (const key of keys) {
    const v = sizes[key];
    if (typeof v === "string" && v.startsWith("http")) return v;
    if (v && typeof v === "object" && typeof v.url === "string" && v.url)
      return v.url;
  }
  return "";
}

/** Build optional Basic auth headers for the WordPress REST API. */
function getWordPressAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {};
  const user = process.env.WORDPRESS_REST_USER;
  const pass = process.env.WORDPRESS_REST_PASSWORD;
  if (user && pass) {
    const credentials = Buffer.from(`${user}:${pass}`).toString("base64");
    headers["Authorization"] = `Basic ${credentials}`;
  }
  return headers;
}

/**
 * Resolve a WordPress media attachment ID to its public `source_url`.
 *
 * Used as a safety net when ACF returns a File/Image ID instead of a URL.
 * Prefer setting the ACF Return Format to File URL / Image Array in WordPress.
 */
async function fetchMediaSourceUrl(attachmentId: number): Promise<string> {
  try {
    const response = await fetch(
      `${WORDPRESS_CONFIG.apiUrl}/wp-json/wp/v2/media/${attachmentId}`,
      {
        headers: getWordPressAuthHeaders(),
        next: { revalidate: WORDPRESS_CONFIG.revalidateTime },
      }
    );
    if (!response.ok) {
      console.warn(
        `[Media] Failed to fetch attachment ${attachmentId}: ${response.status}`
      );
      return "";
    }
    const attachment = (await response.json()) as { source_url?: string };
    return attachment.source_url?.trim() || "";
  } catch (error) {
    console.error("[Media] Error fetching attachment:", error);
    return "";
  }
}

async function resolveThumbnailUrl(acf: ACFFields): Promise<string> {
  const thumb = acf.thumbnail;
  if (typeof thumb === "string") return thumb.trim();
  if (typeof thumb === "number") {
    return fetchMediaSourceUrl(thumb);
  }
  if (thumb && typeof thumb === "object" && !Array.isArray(thumb)) {
    const fromObj = pickSizeUrlFromImageObject(thumb as AcfImageObject);
    if (fromObj) return fromObj;
  }
  return "";
}

/**
 * Transform WordPress REST API response to PdfFile interface
 * Extracts ACF fields and renames for easier frontend use
 *
 * Handles File URL (string), File Array / object with `url`, and File ID
 * (number; resolved via the media endpoint as a safety net).
 */
async function transformPdfFile(post: WordPressPost): Promise<PdfFile> {
  let pdfFileUrl = "";
  const acf = getAcfFields(post);
  const pdfField = acf.pdf_file;

  if (typeof pdfField === "string") {
    pdfFileUrl = pdfField;
  } else if (
    pdfField &&
    typeof pdfField === "object" &&
    "url" in pdfField &&
    typeof (pdfField as { url: unknown }).url === "string"
  ) {
    pdfFileUrl = (pdfField as { url: string }).url;
  } else if (typeof pdfField === "number") {
    pdfFileUrl = await fetchMediaSourceUrl(pdfField);
  }

  return {
    id: post.id,
    slug: canonicalSlug(post.slug),
    title: post.title.rendered,
    publishedDate: post.date,
    pdfFileUrl: pdfFileUrl,
  };
}

/**
 * Transform WordPress REST API response to VideoPost interface
 * Extracts ACF fields and handles nested image/embed objects
 */
async function transformVideoPost(post: WordPressPost): Promise<VideoPost> {
  const acf = getAcfFields(post);
  const thumbnailUrl = await resolveThumbnailUrl(acf);
  const embedRaw = acfString(acf.video_embed_url);
  const videoEmbedUrl = normalizeVideoEmbedUrl(embedRaw);

  return {
    id: post.id,
    slug: canonicalSlug(post.slug),
    title: post.title.rendered,
    publishedDate: post.date,
    description: acfString(acf.short_description),
    fullDescription: acfString(acf.full_description),
    thumbnail: thumbnailUrl,
    videoEmbedUrl,
  };
}

// ─── Fetch Functions ──────────────────────────────────────────────────────

/**
 * Fetch all PDF files from WordPress
 *
 * @returns Array of PdfFile objects, or empty array if error
 *
 * Error handling: Returns empty array instead of throwing,
 * so components don't crash if WordPress is unreachable
 */
export async function fetchPdfFiles(): Promise<PdfFile[]> {
  try {
    const response = await fetch(WORDPRESS_ENDPOINTS.pdfFiles, {
      next: {
        revalidate: WORDPRESS_CONFIG.revalidateTime, // ISR revalidation
      },
    });

    if (!response.ok) {
      console.warn(
        `[WordPress] Failed to fetch PDFs: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const posts: WordPressPost[] = await response.json();
    return Promise.all(posts.map(transformPdfFile));
  } catch (error) {
    console.error("[WordPress] Error fetching PDFs:", error);
    return [];
  }
}

/**
 * Fetch all video posts from WordPress
 *
 * @returns Array of VideoPost objects, or empty array if error
 *
 * Error handling: Returns empty array instead of throwing,
 * so components don't crash if WordPress is unreachable
 */
export async function fetchVideoPosts(): Promise<VideoPost[]> {
  try {
    const response = await fetch(WORDPRESS_ENDPOINTS.videoPosts, {
      next: {
        revalidate: WORDPRESS_CONFIG.revalidateTime, // ISR revalidation
      },
    });

    if (!response.ok) {
      console.warn(
        `[WordPress] Failed to fetch videos: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const posts: WordPressPost[] = await response.json();
    return Promise.all(posts.map(transformVideoPost));
  } catch (error) {
    console.error("[WordPress] Error fetching videos:", error);
    return [];
  }
}

/**
 * Fetch a single PDF file by slug
 *
 * @param slug - The WordPress post slug (URL-friendly identifier)
 * @returns PdfFile object or undefined if not found
 *
 * Strategy: Fetch all PDFs and find by slug
 * (Alternative: Could filter server-side with ?slug=... parameter)
 */
export async function getPdfBySlug(slug: string): Promise<PdfFile | undefined> {
  const target = canonicalSlug(slug);
  const pdfs = await fetchPdfFiles();
  return pdfs.find((pdf) => canonicalSlug(pdf.slug) === target);
}

/**
 * Fetch a single video post by slug
 *
 * @param slug - The WordPress post slug (URL-friendly identifier)
 * @returns VideoPost object or undefined if not found
 *
 * Strategy: Fetch all videos and find by slug
 * (Alternative: Could filter server-side with ?slug=... parameter)
 */
export async function getVideoBySlug(slug: string): Promise<VideoPost | undefined> {
  const target = canonicalSlug(slug);
  const videos = await fetchVideoPosts();
  return videos.find((video) => canonicalSlug(video.slug) === target);
}
