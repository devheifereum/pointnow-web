import React from "react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-6 px-20 bg-white/70 backdrop-blur-md">
      <div className="text-3xl font-gilroy-extrabold text-black">PointNow.</div>
      <div className="flex items-center gap-10">
        {["Home", "Explore", "About us", "Blog", "Careers"].map((link) => (
          <a
            key={link}
            href="#"
            className="text-gray-700 font-medium hover:text-[#7bc74d] transition"
          >
            {link}
          </a>
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
          {/* Cart badge */}
          <span className="absolute -top-1 -right-1 bg-[#7bc74d] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            3
          </span>
        </button>
        <button className="bg-[#7bc74d] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6ab63d] transition">
          Sign up
        </button>
      </div>
    </nav>
  );
}
