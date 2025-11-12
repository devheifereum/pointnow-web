"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { useAuthStore } from "@/lib/auth/store";

export default function Hero() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/restaurants?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/restaurants");
    }
  };
  return (
    <section className="relative text-center px-5 py-16 max-w-5xl mx-auto overflow-hidden">
      {/* Animated Grid Background */}
      <AnimatedGridPattern
        className="opacity-30"
        width={40}
        height={40}
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
      />
      {/* New Badge */}
<div className="flex items-center justify-center gap-3 bg-white rounded-full px-5 py-2 shadow-md w-fit mx-auto mb-10">
  <span className="bg-gradient-to-r from-[#ff9a76] to-[#ff7f59] text-white text-xs font-semibold px-3 py-1 rounded-full">
    NEW
  </span>
  <span className="text-gray-900 font-medium text-sm md:text-base">
    It&apos;s free FOREVER for unlimited customers
  </span>
</div>


      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-gilroy-black text-black leading-tight mb-4 sm:mb-6 tracking-tight px-4">
        Loyalty Points
        <br /> Management for
        <br /> Businesses & Brands
      </h1>

      <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
        Go live with your loyalty points system in 2 minutes flat. Customers check their points, merchants reward loyalty.
      </p>

      {/* Login Button - Show when not authenticated */}
      {!isAuthenticated && (
        <div className="mb-8 sm:mb-12 px-4">
          <Link href="/auth?mode=user">
            <button className="bg-[#7bc74d] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-[#6ab63d] transition shadow-lg hover:shadow-xl w-full sm:w-auto">
              Get Started - It&apos;s Free
            </button>
          </Link>
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center max-w-xl mx-auto bg-white rounded-full p-2 shadow-lg gap-2 sm:gap-0">
        <input
          type="text"
          placeholder="Search businesses or Point Now..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 outline-none rounded-full"
        />
        <button 
          type="submit"
          className="bg-[#7bc74d] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-[#6ab63d] transition text-sm sm:text-base whitespace-nowrap"
        >
          Search now
        </button>
      </form>
    </section>
  );
}
