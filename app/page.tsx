import { fetchPdfFiles, fetchVideoPosts } from "@/lib/wordpress-service";
import { HomePageContent } from "@/components/home-page-content";

export default async function Home() {
  const [pdfs, videos] = await Promise.all([
    fetchPdfFiles(),
    fetchVideoPosts(),
  ]);

  return <HomePageContent pdfs={pdfs} videos={videos} />;
}
