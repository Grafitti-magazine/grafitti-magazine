import Link from "next/link";
import { notFound } from "next/navigation";
import { Carousel } from "@/components/carousel";
import { VideoEmbed } from "@/components/video-embed";
import { getVideoBySlug, fetchVideoPosts } from "@/lib/wordpress-service";

function ArticleDescription({ text }: { text: string }) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const looksLikeHtml =
    /^<[a-z!?]/i.test(trimmed) || /^<!--\s*wp:/i.test(trimmed);
  if (looksLikeHtml) {
    return (
      <div
        className="font-alk-tall text-[20px] text-black/90 leading-snug max-w-5xl [&_p]:mb-4 [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    );
  }
  return (
    <p className="font-alk-tall text-[20px] text-black/90 leading-snug max-w-5xl whitespace-pre-wrap">
      {trimmed}
    </p>
  );
}

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  const allVideos = await fetchVideoPosts();

  if (!video) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3]">
      {/* უკან დაბრუნება */}
      <div className="max-w-5xl mx-auto px-6 pt-6 flex flex-col gap-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-alk-tall text-[30px] text-black hover:text-red-600 transition-opacity duration-200 w-fit"
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: "block", transform: "translateY(1px)" }}
          >
            <path d="M14 9H4M8 4L3 9L8 14" />
          </svg>
          <span className="transform: translate-y-1">უკან დაბრუნება</span>
        </Link>

        {/* Video player - now using embedded video URL from WordPress */}
        <div className="w-full">
          <VideoEmbed
            embedUrl={video.videoEmbedUrl}
            title={video.title}
            thumbnail={video.thumbnail}
          />
        </div>
      </div>

      {/* Title + Description */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-6">
        <h1 className="font-cobalt text-5xl text-black leading-tight mb-6">
          {video.title}
        </h1>
        <ArticleDescription text={video.fullDescription} />
      </div>

      {/* Divider */}
      {/* <div className="w-full border-t border-black mt-6" /> */}

      {/* Carousel */}
      <div className="py-10">
        <Carousel videos={allVideos} />
      </div>
    </main>
  );
}
