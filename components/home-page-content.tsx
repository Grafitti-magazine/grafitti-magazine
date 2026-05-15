"use client";

import dynamic from "next/dynamic";
import { Carousel } from "@/components/carousel";
import { getPdfReaderUrl } from "@/lib/pdf-display-url";
import type { PdfFile, VideoPost } from "@/lib/wordpress-service";

const PDFReader = dynamic(() => import("@/components/pdfReader"), {
  ssr: false,
});

export type HomePageContentProps = {
  pdfs: PdfFile[];
  videos: VideoPost[];
};

export function HomePageContent({ pdfs, videos }: HomePageContentProps) {
  const currentPdf = pdfs.length > 0 ? pdfs[0] : null;
  const pdfUrl =
    currentPdf?.pdfFileUrl && currentPdf.pdfFileUrl.trim().length > 0
      ? currentPdf.pdfFileUrl.trim()
      : null;

  const readerUrl = pdfUrl ? getPdfReaderUrl(pdfUrl) : null;

  return (
    <div>
      <div className="flex flex-col flex-1 items-center justify-center font-sans p-4 w-full">
        <div className="w-full max-w-6xl mt-4 relative">
          {readerUrl ? (
            <PDFReader fileUrl={readerUrl} />
          ) : (
            <div className="bg-gray-100 aspect-video flex items-center justify-center text-gray-500 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-semibold">PDF Not Loaded</p>
                <p className="text-sm text-gray-400 mt-2">
                  No PDF available. 
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full border-t border-black mt-10" />
      <div className="py-10">
        <Carousel videos={videos} />
      </div>
    </div>
  );
}
