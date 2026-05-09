import { transform } from "next/dist/build/swc";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
    
    <main className="relative bg-white overflow-x-hidden pb-32">

      {/* - Decorative images, all are absolute - */}

      {/* Left Side */}

      {/* Top left: black spray question mark */}
      <div className="absolute left-0 top-[450] w-25 lg:block">
        <img src="/Question-1.jpeg" alt="" aria-hidden="true" className="w-full" />
      </div>

      {/* Bottom left: hand with broken mirror */}
      <div className="absolute left-0 bottom-0 w-30 pointer-events-none select-none hidden lg:block">
        <img src="/puzzle.jpeg" alt="" aria-hidden="true" className="w-full" />
      </div>

      {/* Bottom left: magazine — between mirror and button */}
      <div className="absolute left-55 bottom-0 w-65 pointer-events-none select-none hidden lg:block">
        <img src="/magazine.jpeg" alt="" aria-hidden="true" className="w-full" />
      </div>

      {/* Right Side */}

      {/* Top right: transparent question mark */}
      <div className="absolute right-0 top-[280px] w-35 pointer-events-none select-none hidden lg:block">
        <img src="/Question-2.jpeg" alt="" aria-hidden="true" className="w-full" />
      </div>

      {/* Bottom right: face question mark */}
      <div className="absolute right-0 bottom-[80px] w-36 pointer-events-none select-none hidden lg:block"
        style={{ transform: "translateX(15%)" }}>
        <img src="/Question-3.jpeg" alt="" aria-hidden="true" className="w-full" />
      </div>

      {/* Middle */}

      {/* Right middle: screaming woman */}
      <div className="absolute right-0 top-[65%] w-45 pointer-events-none select-none hidden lg:block">
        <img src="/loud.jpeg" alt="" aria-hidden="true" className="w-full" />
      </div>

      {/* - PAGE CONTENT - */}

      {/* Stage lights banner */}
      <div className="w-full h-[250px]">
        <img src="/Up.jpeg" alt="" className="w-full object-cover" />
      </div>

      {/* Title */}
      <h1 className="font-cobalt text-center text-5xl mt-10 mb-45 tracking-wide">
        ჩვენ შესახებ
      </h1>

      {/* Text Sections with Graffiti */}
      <div className="max-w-4xl mx-auto px-5">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Left: main body text */}
          <div className="flex-1">
            <p className="font-alk-tall text-[25px] text-black leading-relaxed">
              ეს არის ჩვენი ხმა, ჩვენი სარკე, ჩვენი სცენა.ჩვენი სტუდენტური ჟურნალი ახალგაზრდების
              თვალით უყურებს საქართველოს რეალობას და აღწერს იმ პრობლემებს,
              რომლებიც ყველაზე მეტად გვეხება. თითოეული გვერდი ჩვენი მიზნის ნაწილია: იყოს ხმა მათთვის,
              ვინც ხშირად უჩინარად რჩება, და გაჩუქოს სივრცე, სადაც თავისუფლად გამოხატავ საკუთარ აზრებს.
            </p>
          </div>

          {/* Right: Graff logo image */}
          <div className="w-[400px]">
            <img src="/Graff.jpeg" alt="" className="w-full rounded-2xl" />
          </div>

        </div>

        {/* Section: რატომ — centered below */}
        <div className="mt-12 text-left">
          <span className="font-cobalt text-[25px] text-red-600 tracking-wide">რატომ:</span>
          <p className="font-alk-tall text-[25px] text-black leading-relaxed">
            ჩვენ გვჯერა, რომ თითოეული ფიქრი, თითოეული ტექსტი და თითოეული ანალიტიკური აზრი ხელს უწყობს ახალი, 
            უფრო გახსნილი და თვითშეგნებული საზოგადოების შექმნას. Grafitti არის სივრცე, სადაც ხმა და ნაგლეჯები, 
            დარდიც და ოცნებაც,  თანაბრად მნიშვნელოვანი და დაფასებულია.
          </p>
        </div>

        {/* Section: ჩვენი მისია — centered below */}
        <div className="text-left">
          <span className="font-cobalt text-[25px] text-red-600 tracking-wide">ჩვენი მისია:</span>
          <p className="font-alk-tall text-[25px] text-black leading-relaxed">
            ჩვენი მიზანია გახდეს პლატფორმა ახალგაზრდებისთვის, რომლებიც ხედავენ საქართველოს პრობლემებს, ფიქრობენ, გრძნობენ და მოქმედებენ. 
            გვინდა, რომ ჩვენი მკითხველები დაინახონ საკუთარი თავი, გაიაზრონ თავიანთი გარემო და დაიმახსოვრონ, რომ მათი ხმა მნიშვნელოვანია.
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-12">
          <Link
            href="/" 
            className="font-cobalt text-[23px] text-black border-2 border-black rounded-4xl px-25 py-7 hover:bg-black hover:text-white transition-colors duration-300 tracking-wide whitespace-nowrap"
          >
            ჟურნალზე გადასვლა
          </Link>
        </div>

      </div>

    </main>
</>
  );
}
