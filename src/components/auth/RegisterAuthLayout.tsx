"use client";
import { signup } from "@/services/authservices";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
	{
		icon: "/loginbola2.png",
		title: "Smart Quiz Generator",
		desc: "Belajar jadi seru dengan Quiz AI! Buat quiz pintar dengan teknologi AI terdepan",
		logoText: "",
	},
	{
		icon: "/logo_besar.png",
		title: "Smart Quiz Generator",
		desc: "Buat quiz pintar dengan teknologi AI terdepan",
		logoText: "QUIZZO",
	},
	{
		icon: "/loginbola1.png",
		title: "Smart Quiz Generator",
		desc: "Belajar jadi seru dengan Quiz AI! Buat quiz pintar dengan teknologi AI terdepan",
		logoText: "Smart Quiz",
	},
];

export default function RegisterAuthLayout({ onRegister }: {
  onRegister?: ({
    email,
    username,
    password,
    setError,
    setLoading,
  }: {
    email: string;
    username: string;
    password: string;
    setError: (msg: string | null) => void;
    setLoading: (v: boolean) => void;
  }) => Promise<void>;
}) {
	const [idx, setIdx] = useState(0);
	const [agree, setAgree] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const timer = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4000);
		return () => clearInterval(timer);
	}, []);

	function validateEmail(email: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
	function validatePassword(password: string) {
		return /[A-Z]/.test(password) && /\d/.test(password) && password.length >= 6;
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!agree || loading) return;
		const form = e.currentTarget;
		const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
		const username = (form.elements.namedItem("username") as HTMLInputElement)?.value;
		const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
		const confirm = (form.elements.namedItem("confirm") as HTMLInputElement)?.value;
		if (!email || !username || !password || !confirm) {
			setError("Semua field harus diisi.");
			return;
		}
		if (!validateEmail(email)) {
			setError("Email tidak valid.");
			return;
		}
		if (!validatePassword(password)) {
			setError("Password minimal 6 karakter, mengandung huruf besar dan angka.");
			return;
		}
		if (password !== confirm) {
			setError("Password dan konfirmasi password tidak sama.");
			return;
		}
		if (onRegister) {
			await onRegister({ email, username, password, setError, setLoading });
			return;
		}
		setLoading(true);
		setError(null);
		try {
			await signup({ email, username, password });
			router.push("/rekomendasi-akun");
		} catch (err) {
			setError((err as Error).message || "Gagal mendaftar.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf1ff] to-[#e3e6ee]">
			<div className="w-full max-w-3xl bg-white/0 rounded-2xl shadow-xl flex overflow-hidden">
				{/* Left slider */}
				<div className="w-1/2 bg-[#2563eb] flex flex-col justify-center items-center relative py-10 px-6 transition-all duration-500">
					<div className="relative w-full h-80 flex flex-col items-center justify-center">
						{slides.map((slide, i) => (
							<div
								key={i}
								className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${
									i === idx ? "opacity-100 z-10" : "opacity-0 z-0"
								}`}
							>
								<div className="relative mb-6">
									<div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg mx-auto">
										{slide.icon.endsWith(".png") ? (
											<Image src={slide.icon} alt="icon" width={56} height={56} />
										) : (
											slide.icon
										)}
									</div>
								</div>
								<div className="text-white text-2xl font-bold text-center mb-2">{slide.title}</div>
								<div className="text-blue-100 text-base text-center mb-6">{slide.desc}</div>
								<div className="flex gap-2 justify-center">
									{slides.map((_, j) => (
										<span
											key={j}
											className={`w-2 h-2 rounded-full ${j === idx ? "bg-white" : "bg-blue-300"} transition-all`}
										/>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
				{/* Right form */}
				<div className="w-1/2 bg-white flex flex-col justify-center px-8 py-10">
					<div className="mb-6">
						<div className="text-2xl font-bold text-gray-800 mb-1">Daftar Akun</div>
						<div className="text-sm text-gray-500">Mulai perjalanan belajar Anda</div>
					</div>
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div>
							<label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
							<input
								type="email"
								name="email"
								className="text-gray-800 w-full rounded-md border border-gray-300 shadow-[0_3px_10px_0_rgba(37,99,235,0.25)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition"
								placeholder="nama@email.com"
							/>
						</div>
						<div>
							<label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
							<input
								type="text"
								name="username"
								className="text-gray-800 w-full rounded-md border border-gray-300 shadow-[0_3px_10px_0_rgba(37,99,235,0.25)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition"
								placeholder="username"
							/>
						</div>
						<div>
							<label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									className="text-gray-800 w-full rounded-md border border-gray-300 shadow-[0_3px_10px_0_rgba(37,99,235,0.25)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition pr-10"
									placeholder="********"
								/>
								<button
									type="button"
									tabIndex={-1}
									className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2563eb] font-semibold"
									onClick={() => setShowPassword((v) => !v)}
								>
									{showPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>
						<div>
							<label className="block text-xs font-medium text-gray-700 mb-1">Konfirmasi Password</label>
							<div className="relative">
								<input
									type={showConfirm ? "text" : "password"}
									name="confirm"
									className="text-gray-700 w-full rounded-md border border-gray-300 shadow-[0_3px_10px_0_rgba(37,99,235,0.25)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition pr-10"
									placeholder="********"
								/>
								<button
									type="button"
									tabIndex={-1}
									className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2563eb] font-semibold"
									onClick={() => setShowConfirm((v) => !v)}
								>
									{showConfirm ? "Hide" : "Show"}
								</button>
							</div>
						</div>
						<label className="flex items-center gap-2 text-xs text-gray-600">
							<input
								type="checkbox"
								className="accent-[#2563eb]"
								checked={agree}
								onChange={(e) => setAgree(e.target.checked)}
							/>
							Saya setuju dengan{" "}
							<a href="#" className="text-[#2563eb] hover:underline">
								Syarat & Ketentuan
							</a>
						</label>
						{error && (
							<div className="text-xs text-red-500">{error}</div>
						)}
						<button
							type="submit"
							className={`w-full rounded-md py-2 font-semibold mt-2 transition shadow-md ${
								agree && !loading
									? "bg-[#2563eb] text-white hover:bg-[#174bbd] cursor-pointer"
									: "bg-gray-200 text-gray-400 cursor-not-allowed"
							}`}
							disabled={!agree || loading}
						>
							{loading ? "Mendaftar..." : "Daftar Sekarang"}
						</button>
					</form>
					<div className="text-xs text-gray-500 mt-6 text-center">
						Sudah punya akun?{" "}
						<Link href="/login" className="text-[#2563eb] hover:underline">
							Masuk di sini
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
