 
import Image from "next/image";

export default function AboutVisiMisiSection() {
  return (
    <section className="bg-white py-16 px-4 flex items-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
        <div className="flex-1 flex flex-col items-start max-w-xl">
          <h2 className="text-3xl font-bold text-[#1751c6] mb-6">Visi & Misi</h2>
          <div className="mb-6">
            <div className="text-xl font-bold text-[#1751c6] mb-1">Visi</div>
            <div className="text-gray-700 mb-4">
              Menjadi platform edukasi digital terdepan yang mengubah cara belajar menjadi pengalaman yang menyenangkan, efektif, dan inklusif untuk semua.
            </div>
            <div className="text-xl font-bold text-[#1751c6] mb-1 mt-4">Misi</div>
            <ul className="text-gray-700 list-disc pl-5 space-y-1">
              <li>Mengintegrasikan AI untuk personalisasi pembelajaran dan peningkatan hasil belajar.</li>
              <li>Membangun komunitas belajar yang kolaboratif dan suportif.</li>
              <li>Menyediakan tools gamifikasi yang engaging dan inovatif.</li>
              <li>Mendukung akses pendidikan berkualitas tanpa batasan ruang dan waktu.</li>
            </ul>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="bg-[#2563eb] rounded-[2.5rem] flex flex-col items-center justify-center p-10 shadow-xl w-[320px] h-[320px] relative">
            <Image src="/rocket.svg" alt="Rocket" width={200} height={200} />
            <div className="text-white text-center text-base italic mt-6">
              &ldquo;Transformasi digital pendidikan dimulai dari sini&rdquo;
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
