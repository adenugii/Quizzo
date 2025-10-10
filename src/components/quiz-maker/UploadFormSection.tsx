"use client";
import { useState, useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { uploadQuiz } from "@/services/quizservices";
import Cookies from "js-cookie";

export default function UploadFormSection({ token }: { token: string }) {
  const [difficulty, setDifficulty] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.type !== "application/pdf") {
        setLocalError("File harus berupa PDF.");
        setFile(null);
        return;
      }
      setFile(f);
      setLocalError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      if (f.type !== "application/pdf") {
        setLocalError("File harus berupa PDF.");
        setFile(null);
        return;
      }
      setFile(f);
      setLocalError(null);
    }
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const isReady = file && difficulty && numQuestions;

  const handleSubmit = async () => {
    if (!isReady || !file) return;
    setLoading(true);
    setLocalError(null);
    try {
      const token = Cookies.get("token") || "";
      await uploadQuiz({
        file,
        num_questions: Number(numQuestions),
        difficulty,
        description,
        token
        
      });
      setSuccess(true);
    } catch (err: unknown) {
      setLocalError((err as Error).message || "Gagal upload quiz");
    } finally {
      setLoading(false);
      if (success) {
        window.location.reload();
      }
    }
  };

  return (
    <section className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-gray-900 mb-3 text-base">Upload Materi</h2>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Tingkat Kesulitan</label>
          <div className="flex gap-4">
            {["easy", "medium", "hard"].map((level) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={difficulty === level}
                  onChange={() => setDifficulty(level)}
                  className="accent-[#2563eb]"
                />
                <span className="capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Jumlah Soal</label>
          <input
            type="number"
            min={1}
            max={20}
            value={numQuestions}
            onChange={e => setNumQuestions(Number(e.target.value))}
            className="w-24 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            placeholder="1-20"
          />
        </div>
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg py-8 cursor-pointer transition hover:border-[#2563eb] bg-[#fafbfc]"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
          <span className="text-gray-500 text-base mb-1">
            Drag & drop file atau klik untuk upload
          </span>
          <span className="text-xs text-gray-400 mb-3">
            Mendukung PDF, DOCX (Maks. 10MB)
          </span>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="mt-2 px-5 py-2 bg-[#2563eb] text-white rounded-md font-medium text-sm shadow hover:bg-[#1e40af] transition"
            onClick={handlePickFile}
          >
            Pilih File
          </button>
          {file && <span className="mt-2 text-xs text-[#2563eb]">{file.name}</span>}
          {localError && <span className="mt-2 text-xs text-red-500">{localError}</span>}
        </label>
        <div className="mb-5">
          <br />
          <h2 className="font-semibold text-gray-900 mb-2 text-base">
            tulis deskripsi materi kamu untuk hasil maksimal
          </h2>
          <textarea
            rows={4}
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-900 text-sm bg-[#fafbfc] focus:outline-none focus:border-[#2563eb] resize-none"
            placeholder="Tulis deskripsi materi kamu di sini..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button
          type="button"
          disabled={!isReady || loading}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-lg font-semibold text-base shadow transition mt-6
            ${isReady && !loading
              ? "bg-[#2563eb] text-white hover:bg-[#1e40af]"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
        >
          {loading ? "Memproses..." : "Generate Quiz dengan AI"}
        </button>
        {success && (
          <div className="mt-4 text-green-600 font-semibold text-center">
            Quiz berhasil diupload!
          </div>
        )}
        {localError && (
          <div className="mt-4 text-red-500 font-semibold text-center">
            {localError}
          </div>
        )}
      </div>
    </section>
  );
}
