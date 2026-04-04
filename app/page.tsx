import Image from "next/image";
import { Carousel } from "@/components/carousel";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#f5f5f3] font-sans dark:bg-black p-4">
      {/* Remove the H1 since it's now in the header */}
      <div className="w-full max-w-2xl mt-4 relative">
        <Image
          src="/hero.png"
          alt="Graffiti Issue"
          width={800}
          height={1200}
          className="w-full h-auto object-cover shadow-2xl"
        />
      </div>

      {/* გამყოფი ხაზი */}
      <div className="w-screen border-t border-black mt-10" />
      
      <div className="py-10">
        <Carousel />
      </div>

    </div>
  );
}

