
import {
  fetchVideoPosts,
  fetchPdfFiles,
  getVideoBySlug as wpGetVideoBySlug,
  getPdfBySlug as wpGetPdfBySlug,
  type VideoPost,
  type PdfFile,
} from "./wordpress-service";

/**
 * Fallback Video Data (used when WordPress is unavailable)
 * This structure matches the VideoPost interface from wordpress-service.ts
 */
export type Video = VideoPost;

export const videos: Video[] = [
  {
    id: 1,
    slug: "tbilisi-isev-tovs-1",
    publishedDate: "2026-02-28",
    title: "თბილისში ისევ თოვს",
    description:
      "მოულოდნელი თოვლის საფარმა, მძიმე ავტობუსებს, ბარიკადები შეუქმნა ქართულ დედაქალაქს. ქუჩები გაიყინა, ქარები „ვერეს ბაღში ბობღდება.",
    fullDescription:
      "ინტერვიუ პირს დილომის ფორმატით ჩატარებული საუბარი, სადაც პირი ადმინი სვამს ნინანარ მომხდარებს და სპორტები კითხვებს, ხოლო მეორე პასუხობს მათ. მისი მიზანი მონარეტელი პირის ეხების, გამოდილოების, გამოტიაების და პროფელიენი სეკობარის ნინარება. ინტერვიუ შვილდება ესია ინფორმაციელი, ბიოგრაფიელი და ანალიტიური დო ანელოიდება ჟურნალისტიკა, ქვლებამ, მდინა და საუბარებელ-ელი პროციბამ.",
    thumbnail: "/hero.png",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    slug: "tbilisi-isev-tovs-2",
    publishedDate: "2026-02-28",
    title: "თბილისში ისევ თოვს",
    description:
      "მოულოდნელი თოვლის საფარმა, მძიმე ავტობუსებს, ბარიკადები შეუქმნა ქართულ დედაქალაქს. ქუჩები გაიყინა, ქარები „ვერეს ბაღში ბობღდება.",
    fullDescription:
      "ინტერვიუ პირს დილომის ფორმატით ჩატარებული საუბარი, სადაც პირი ადმინი სვამს ნინანარ მომხდარებს და სპორტები კითხვებს, ხოლო მეორე პასუხობს მათ. მისი მიზანი მონარეტელი პირის ეხების, გამოდილოების, გამოტიაების და პროფელიენი სეკობარის ნინარება. ინტერვიუ შვილდება ესია ინფორმაციელი, ბიოგრაფიელი და ანალიტიური დო ანელოიდება ჟურნალისტიკა, ქვლებამ, მდინა და საუბარებელ-ელი პროციბამ.",
    thumbnail: "/hero.png",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 3,
    slug: "tbilisi-isev-tovs-3",
    publishedDate: "2026-02-28",
    title: "თბილისში ისევ თოვს",
    description:
      "მოულოდნელი თოვლის საფარმა, მძიმე ავტობუსებს, ბარიკადები შეუქმნა ქართულ დედაქალაქს. ქუჩები გაიყინა, ქარები „ვერეს ბაღში ბობღდება.",
    fullDescription:
      "ინტერვიუ პირს დილომის ფორმატით ჩატარებული საუბარი, სადაც პირი ადმინი სვამს ნინანარ მომხდარებს და სპორტები კითხვებს, ხოლო მეორე პასუხობს მათ. მისი მიზანი მონარეტელი პირის ეხების, გამოდილოების, გამოტიაების და პროფელიენი სეკობარის ნინარება. ინტერვიუ შვილდება ესია ინფორმაციელი, ბიოგრაფიელი და ანალიტიური დო ანელოიდება ჟურნალისტიკა, ქვლებამ, მდინა და საუბარებელ-ელი პროციბამ.",
    thumbnail: "/hero.png",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 4,
    slug: "quchis-khelovneba",
    publishedDate: "2026-03-15",
    title: "ქუჩის ხელოვნება",
    description:
      "ახალი მხატვრები, ახალი კედლები. თბილისის ცენტრში გაჩნდა გრაფიტის ახალი ნამუშევრები, რომლებიც ქალაქის სულს ასახავს.",
    fullDescription:
      "ინტერვიუ პირს დილომის ფორმატით ჩატარებული საუბარი, სადაც პირი ადმინი სვამს ნინანარ მომხდარებს და სპორტები კითხვებს, ხოლო მეორე პასუხობს მათ. მისი მიზანი მონარეტელი პირის ეხების, გამოდილოების, გამოტიაების და პროფელიენი სეკობარის ნინარება. ინტერვიუ შვილდება ესია ინფორმაციელი, ბიოგრაფიელი და ანალიტიური დო ანელოიდება ჟურნალისტიკა, ქვლებამ, მდინა და საუბარებელ-ელი პროციბამ.",
    thumbnail: "/hero.png",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 5,
    slug: "ferebis-festivali",
    publishedDate: "2026-03-10",
    title: "ფერების ფესტივალი",
    description:
      "სამხრეთ კავკასიის უდიდეს ქუჩის ხელოვნების ფესტივალს ამ წელს ათასამდე ადამიანი დაესწრო. სხვადასხვა ქვეყნის მხატვრები შეიკრიბნენ.",
    fullDescription:
      "ინტერვიუ პირს დილომის ფორმატით ჩატარებული საუბარი, სადაც პირი ადმინი სვამს ნინანარ მომხდარებს და სპორტები კითხვებს, ხოლო მეორე პასუხობს მათ. მისი მიზანი მონარეტელი პირის ეხების, გამოდილოების, გამოტიაების და პროფელიენი სეკობარის ნინარება. ინტერვიუ შვილდება ესია ინფორმაციელი, ბიოგრაფიელი და ანალიტიური დო ანელოიდება ჟურნალისტიკა, ქვლებამ, მდინა და საუბარებელ-ელი პროციბამ.",
    thumbnail: "/hero.png",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 6,
    slug: "kedlebi-saubroben",
    publishedDate: "2026-03-05",
    title: "კედლები საუბრობენ",
    description:
      "ძველი ქალაქის კედლებზე ისტორია ისახება. გრაფიტი მხოლოდ ხელოვნება კი არ არის — ეს პოლიტიკური გამოხატვის ფორმაა.",
    fullDescription:
      "ინტერვიუ პირს დილომის ფორმატით ჩატარებული საუბარი, სადაც პირი ადმინი სვამს ნინანარ მომხდარებს და სპორტები კითხვებს, ხოლო მეორე პასუხობს მათ. მისი მიზანი მონარეტელი პირის ეხების, გამოდილოების, გამოტიაების და პროფელიენი სეკობარის ნინარება. ინტერვიუ შვილდება ესია ინფორმაციელი, ბიოგრაფიელი და ანალიტიური დო ანელოიდება ჟურნალისტიკა, ქვლებამ, მდინა და საუბარებელ-ელი პროციბამ.",
    thumbnail: "/hero.png",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

/**
 * DEPRECATED: Use wordpress-service.ts functions instead
 *
 * Get a video by slug from fallback data
 * For production, use: getVideoBySlug() from wordpress-service.ts
 */
export function getVideoBySlug(slug: string): Video | undefined {
  return videos.find((v) => v.slug === slug);
}

/**
 * DEPRECATED: Use wordpress-service.ts functions instead
 *
 * Get all videos from fallback data
 * For production, use: fetchVideoPosts() from wordpress-service.ts
 */
export async function getAllVideos(): Promise<VideoPost[]> {
  return fetchVideoPosts();
}

/**
 * DEPRECATED: Use wordpress-service.ts functions instead
 *
 * Get all PDFs from fallback data
 * For production, use: fetchPdfFiles() from wordpress-service.ts
 */
export async function getAllPdfs(): Promise<PdfFile[]> {
  return fetchPdfFiles();
}
