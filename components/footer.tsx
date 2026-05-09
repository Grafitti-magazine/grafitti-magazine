import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white px-14 pt-14">
      {/* მთავარი ნაწილი */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row pb-12">
        {/* Left: Logo + tagline */}
        <div className="max-w-xs">
          <span className="font-cobalt text-6xl text-white leading-none">
            გრაფიტი
          </span>
          <p className="font-alk-tall text-white/90 text-[18px] mt-14 leading-relaxed">
            თავისუფალი თვითგამოხატვის სივრცე, ხამამაღალი იდეებისთვის,
            განსხვავებული ხედვებისთვის და იმ თემებისთვის, რომლებიც ხშირად
            ,,კედლებს გარეთ" რჩება.
          </p>
        </div>

        {/* Nav + Inputs grouped on the right */}
        <div className="md:ml-auto flex flex-col md:flex-row items-center gap-12 md:gap-30 mt-12 md:mt-0 w-full md:w-auto">
          <div className="flex flex-col items-center justify-between gap-2 font-alk-tall text-white">
            <Link
              href="/about"
              className="text-3xl hover:text-white/70 transition-colors mt-2"
            >
              ჩვენს შესახებ
            </Link>
            <Link
              href="/gallery"
              className="text-3xl hover:text-white/70 transition-colors mt-2"
            >
              არქივი
            </Link>
            <Link
              href="/gallery"
              className="text-3xl hover:text-white/70 transition-colors mt-2"
            >
              ფოტო
            </Link>
            <Link
              href="/gallery"
              className="text-3xl hover:text-white/70 transition-colors mt-2"
            >
              ვიდეო
            </Link>
          </div>

          {/* Email fields with embedded buttons */}
          <div className="flex flex-col gap-5 md:min-w-85">
            <div className="flex flex-col gap-0">
              <p className="font-alk-tall text-white text-[20px] text-center">
                არ გამოტოვო ჟურნალის ახალი ნომრები!
              </p>
              <div className="flex items-center bg-white rounded-full pr-1 pl-4 py-1">
                <input
                  type="email"
                  placeholder="შეიყვანეთ თქვენი ელ.ფოსტა"
                  className="flex-1 bg-transparent text-black text-[16px] outline-none placeholder:text-black/40 focus:placeholder-transparent min-w-0 translate-y-[2px]"
                />
                <button className="font-cobalt bg-black text-white text-[19px] font-bold px-3 py-2 rounded-full hover:bg-black/80 transition-colors whitespace-nowrap shrink-0">
                  გამოწერა
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-0">
              <p className="font-alk-tall text-white text-[20px] text-center">
                გსურს გახდე გრაფიტის წევრი?
              </p>
              <div className="flex items-center bg-white rounded-full pr-1 pl-4 py-1">
                <input
                  type="email"
                  placeholder="მოგვწერე შენი სახელი და ელ.ფოსტა"
                  className="flex-1 bg-transparent text-black text-[16px] outline-none placeholder:text-black/40 focus:placeholder-transparent min-w-0 translate-y-[2px]"
                />
                <button className="font-cobalt bg-black text-white text-[19px] font-bold px-3 py-2 rounded-full hover:bg-black/80 transition-colors whitespace-nowrap shrink-0">
                  გაგზავნა
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* გამყოფი */}
      <div className="max-w-7xl mx-auto border-t border-white" />

      {/* ქვედა ნაწილი */}
      <div className="max-w-7xl mx-auto py-5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="flex flex-wrap justify-center items-center gap-6">
          <Link href="" aria-label="Instagram">
            <svg
              className="w-7 h-7 text-white hover:text-white/70 transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </Link>

          <Link href="#" aria-label="TikTok">
            <svg
              className="w-7 h-7 text-white hover:text-white/70 transition-colors"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </Link>

          <span className="font-cobalt text-white text-3xl">
            +995 123 456 789
          </span>
        </div>

        <span className="font-alk-tall text-white text-xl md:text-3xl break-all">
          thegrafittimagazine@gmail.com
        </span>
      </div>
    </footer>
  );
}
