/**
 * ISR and Cache Revalidation Helpers
 *
 * These functions are used in API routes to manually trigger
 * Incremental Static Regeneration (ISR) when content is updated in WordPress.
 *
 * Usage:
 * - Call these in API routes that receive webhook notifications from WordPress
 * - Example: When a new video is published, WordPress sends a webhook to
 *   /api/revalidate, which calls revalidateVideos()
 */

import { revalidatePath } from "next/cache";
import { WORDPRESS_CONFIG } from "./wordpress";

/**
 * Revalidate PDF file pages
 * Triggers ISR for any page that displays PDF data
 */
export async function revalidatePdfFiles(): Promise<void> {
  try {
    // Revalidate home page (shows PDF)
    revalidatePath("/", "page");
    console.log("[Revalidate] PDF files cache cleared");
  } catch (error) {
    console.error("[Revalidate] Error clearing PDF cache:", error);
  }
}

/**
 * Revalidate video post pages
 * Triggers ISR for any page that displays video data
 */
export async function revalidateVideoPosts(): Promise<void> {
  try {
    // Revalidate home page (shows video carousel)
    revalidatePath("/", "page");
    // Revalidate all article pages (dynamic routes)
    revalidatePath("/article", "page");
    console.log("[Revalidate] Video posts cache cleared");
  } catch (error) {
    console.error("[Revalidate] Error clearing video cache:", error);
  }
}

/**
 * Revalidate all content
 * Clears cache for everything - use when multiple content types change
 */
export async function revalidateAll(): Promise<void> {
  try {
    revalidatePath("/", "layout");
    console.log("[Revalidate] All pages cache cleared");
  } catch (error) {
    console.error("[Revalidate] Error clearing all cache:", error);
  }
}

/**
 * Get current ISR revalidation time (for reference)
 * @returns Revalidation time in seconds
 */
export function getRevalidationTime(): number {
  return WORDPRESS_CONFIG.revalidateTime;
}
