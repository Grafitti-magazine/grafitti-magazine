/**
 * WordPress REST API Configuration
 *
 * This file contains all configuration for connecting to the WordPress CMS.
 * Update these values when deploying to different environments.
 */

// Get WordPress API URL from environment, fallback to local development
const WORDPRESS_API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://cms.flyweb.space";

// ISR revalidation time in seconds (1 minute by default)
const ISR_REVALIDATE_TIME =
  parseInt(process.env.NEXT_PUBLIC_ISR_REVALIDATE_TIME || "60", 10);

/**
 * WordPress REST API endpoints
 * These correspond to Custom Post Types (CPTs)
 */
export const WORDPRESS_ENDPOINTS = {
  // PDF files Custom Post Type
  pdfFiles: `${WORDPRESS_API_URL}/wp-json/wp/v2/pdf_file`,
  // Video posts Custom Post Type
  videoPosts: `${WORDPRESS_API_URL}/wp-json/wp/v2/video_post`,
} as const;

/**
 * Export configuration constants for use throughout the app
 */
export const WORDPRESS_CONFIG = {
  apiUrl: WORDPRESS_API_URL,
  revalidateTime: ISR_REVALIDATE_TIME,
} as const;
