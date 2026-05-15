/**
 * renders embedded videos from YouTube, Vimeo, or other iframe-based video hosts.
*/

interface VideoEmbedProps {
  embedUrl: string;
  title: string;
  thumbnail?: string;
}

export function VideoEmbed({ embedUrl, title, thumbnail }: VideoEmbedProps) {
  // Handle empty embed URL
  if (!embedUrl) {
    return (
      <div className="relative w-full bg-gray-200 flex items-center justify-center text-gray-500"
        style={{ aspectRatio: "16 / 9" }}>
        <p>Video not available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black overflow-hidden"
      style={{ aspectRatio: "16 / 9" }}>
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  );
}
