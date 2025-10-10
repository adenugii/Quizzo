import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full bg-[#f4f8ff] py-12 px-4 flex items-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
        <div className="flex-1 flex flex-col items-start max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] font-extrabold leading-tight text-[#222] mb-4">
            Upload materi apapun lalu dapatkan{" "}
            <span className="text-[#2563EB]"> quiz AI otomatis. </span>
            belajar jadi seru dengan
            <br />
            <span className="text-[#2563EB]">XP, level, dan badge!</span>
          </h1>
          <p className="text-[#6b7280] text-base md:text-lg mb-6">
            Transformasi cara belajar Anda dengan teknologi AI yang mengubah
            materi pembelajaran menjadi quiz interaktif dengan sistem gamifikasi
            yang menyenangkan.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#1d4ed8] transition drop-shadow-lg"
          >
            <span>
              {/* <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path fill="currentColor" d="M10.7 2.3a1 1 0 0 0-1.4 0l-7 7a1 1 0 0 0 1.1 1.6l2.6-.7 2.2 5.5a1 1 0 0 0 1.9-.1l.7-2.7 2.7-.7a1 1 0 0 0 .1-1.9l-5.5-2.2.7-2.6a1 1 0 0 0-1.6-1.1l7-7z"/>
              </svg> */}
            </span>
            Mulai Sekarang
          </a>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/rocket.svg"
            alt="Quizzo App Mockup"
            width={370}
            height={370}
            className="rounded-xl shadow-xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
