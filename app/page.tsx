"use client";

import dynamic from "next/dynamic";
import { Carousel } from "@/components/carousel";

const PDFReader = dynamic(() => import("@/components/pdfReader"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <div className="flex flex-col flex-1 items-center justify-center font-sans p-4 w-full">
        <div className="w-full max-w-6xl mt-4 relative">
          <PDFReader fileUrl="გრაფიტი.pdf" />
        </div>

        {/* გამყოფი ხაზი */}
      </div>
      <div className="w-full border-t border-black mt-10" />
      <div className="py-10">
        <Carousel />
      </div>
    </div>
  );
}
