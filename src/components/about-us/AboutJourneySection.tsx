/* eslint-disable prefer-const */
"use client";
import { useRef, useEffect, useState } from "react";
import { FaLightbulb, FaCode, FaRocket, FaStar } from "react-icons/fa";

const steps = [
	{
		icon: <FaLightbulb className="text-white" size={22} />,
		title: "Ide",
		desc: "Mengidentifikasi masalah dalam metode belajar tradisional",
		align: "left",
	},
	{
		icon: <FaCode className="text-white" size={22} />,
		title: "Prototipe",
		desc: "Pengembangan MVP dengan fitur-fitur dasar",
		align: "right",
	},
	{
		icon: <FaRocket className="text-white" size={22} />,
		title: "Launch",
		desc: "Peluncuran beta dengan 1000+ pengguna pertama",
		align: "left",
	},
	{
		icon: <FaStar className="text-white" size={22} />,
		title: "Masa Depan",
		desc: "Ekspansi fitur AI dan komunitas global",
		align: "right",
	},
];

export default function AboutJourneySection() {
	const ref = useRef<HTMLDivElement>(null);
	const [visibleStep, setVisibleStep] = useState(0);
	const [barHeight, setBarHeight] = useState(0);

	useEffect(() => {
		function onScroll() {
			if (!ref.current) return;
			const rect = ref.current.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			const visible = Math.max(0, windowHeight - rect.top);
			const total = rect.height;
			// Animate bar height (min 0, max 100%)
			const percent = Math.round((visible / total) * 100);
			setBarHeight(percent);

			// Animate steps one by one as user scrolls
			const stepTrigger = steps.map((_, i) => (i + 1) / steps.length);
			let step = 0;
			for (let i = 0; i < stepTrigger.length; i++) {
				if (percent >= stepTrigger[i]) step = i + 1;
			}
			setVisibleStep(step);
		}
		window.addEventListener("scroll", onScroll);
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<section
			id="about-journey"
			className="bg-[#f7fafd] py-16 px-4 flex flex-col items-center"
		>
			<h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
				Perjalanan Kami
			</h2>
			<p className="text-gray-500 mb-12 text-center">
				Dari ide hingga menjadi platform yang Anda gunakan hari ini
			</p>
			<div
				ref={ref}
				className="relative flex flex-col items-center w-full max-w-3xl mx-auto min-h-[520px]"
			>
				{/* Animated vertical bar */}
				<div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gray-200 z-0 overflow-hidden">
					<div
						className="absolute left-0 top-0 w-1 bg-[#2563eb] transition-all duration-700"
						style={{
							height: `${barHeight * 100}%`,
							transitionDuration: "1200ms",
						}}
					/>
				</div>
				{/* Steps */}
				{steps.map((step, i) => {
					// Last step (Masa Depan) is centered at the end
					
					// Other steps alternate left/right
					return (
						<div
							key={i}
							className={`relative z-10 flex items-center w-full mb-10 last:mb-0 transition-all duration-1200
                ${visibleStep > i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
              `}
							style={{ transitionDelay: `${i * 240}ms` }}
						>
							<div className="flex-1 text-right pr-8">
								{step.align === "left" && (
									<>
										<div className="font-semibold text-gray-700">
											{step.title}
										</div>
										<div className="text-gray-400 text-sm">
											{step.desc}
										</div>
									</>
								)}
							</div>
							<div className="flex flex-col items-center">
								<div className="w-12 h-12 rounded-full bg-[#2563eb] flex items-center justify-center shadow-lg mb-2">
									{step.icon}
								</div>
								<div className="w-1 h-10 bg-transparent" />
							</div>
							<div className="flex-1 text-left pl-8">
								{step.align === "right" && (
									<>
										<div className="font-semibold text-gray-700">
											{step.title}
										</div>
										<div className="text-gray-400 text-sm">
											{step.desc}
										</div>
									</>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
