import React from "react";
import Link from "next/link";

export default function Navbar() {
  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Restaurants", href: "/restaurants" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <nav className="flex justify-between items-center py-6 px-20 bg-white/70 backdrop-blur-md">
      <Link href="/home" className="text-3xl font-gilroy-extrabold text-black hover:text-[#7bc74d] transition">
        PointNow.
      </Link>
      <div className="flex items-center gap-10">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-gray-700 font-medium hover:text-[#7bc74d] transition"
          >
            {link.label}
          </Link>
        ))}
        <button className="relative p-2 text-gray-700 hover:text-[#7bc74d] transition">
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
            />
          </svg>
          {/* Points badge */}
          <span className="absolute -top-1 -right-1 bg-[#7bc74d] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            3
          </span>
        </button>
        <div className="flex items-center gap-4">
          <Link href="/auth?mode=restaurant">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-semibold transition text-sm">
              Restaurant Login
            </button>
          </Link>
          <Link href="/auth?mode=user">
            <button className="bg-[#7bc74d] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6ab63d] transition">
              Login to Point Now
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
