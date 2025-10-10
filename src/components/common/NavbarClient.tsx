"use client";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Buat Quiz", href: "/quiz-maker" },
  { name: "Studi grup", href: "/study-group" },
  { name: "Tentang", href: "/about-us" },
  { name: "History Quiz", href: "/history" },
];

export interface NavbarUser {
  avatar?: string;
  username?: string;
}

export default function NavbarClient({ user }: { user: NavbarUser | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const protectedLinks = ["/quiz-maker", "/history", "/study-groups"];

  const handleProtectedNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (!user && protectedLinks.includes(href)) {
      e.preventDefault();
      setShowLoginPopup(true);
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 md:px-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo_besar.png" alt="Quizzo Logo" width={32} height={32} />
          <span className="font-bold text-xl text-[#2563eb] tracking-tight">
            QNECTIFY
          </span>
        </Link>
        {/* Hamburger Mobile */}
        <button
          className="md:hidden text-2xl text-[#2563eb] focus:outline-none"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="material-icons">menu</span>
        </button>
        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleProtectedNav(e, link.href)}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-[#2563eb]" : "text-gray-700 hover:text-[#2563eb]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
        {/* Profile / Login */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/profile" className="flex items-center gap-2">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-[#2563eb] object-cover"
                />
              ) : (
                <FaUserCircle className="text-gray-400 text-3xl" />
              )}
              <span className="font-semibold text-gray-700">
                {user.username}
              </span>
            </Link>
          ) : (
            <Link href="/login">
              <button className="bg-[#2563eb] hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 pb-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => {
                handleProtectedNav(e, link.href);
                setMobileOpen(false);
              }}
              className={`text-base font-medium py-2 px-2 rounded transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-[#2563eb] bg-blue-50"
                  : "text-gray-700 hover:text-[#2563eb]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
      {/* Popup login */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="font-bold text-lg mb-2 text-center">
              Login Diperlukan
            </div>
            <div className="text-gray-600 text-center mb-4">
              Untuk mengakses fitur ini, Anda harus login terlebih dahulu.
            </div>
            <button
              className="w-full bg-[#2563eb] text-white rounded-md py-2 font-semibold hover:bg-[#174bbd] transition"
              onClick={() => {
                setShowLoginPopup(false);
                window.location.href = "/login";
              }}
            >
              Login Sekarang
            </button>
            <button
              className="w-full mt-2 bg-gray-200 text-gray-600 rounded-md py-2 font-semibold hover:bg-gray-300 transition"
              onClick={() => setShowLoginPopup(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
