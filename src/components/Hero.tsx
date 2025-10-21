import React from "react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

export default function Hero() {
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
    Experience the Joy of Fresh Food Delivered to Your Doorstep
  </span>
</div>


      <h1 className="text-6xl md:text-7xl font-gilroy-black text-black leading-tight mb-6 tracking-tight">
        Fresh from the kitchen
        <br /> to your doorstep an
        <br /> easy dining solution
      </h1>

      <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
        Enjoy farm-fresh ingredients and gourmet recipes crafted by expert chefs,
        conveniently delivered to your doorstep for a delightful dining experience.
      </p>

      {/* Search */}
      <div className="flex items-center max-w-xl mx-auto bg-white rounded-full p-2 shadow-lg">
        <input
          type="text"
          placeholder="Search food or your location..."
          className="flex-1 px-5 py-3 text-base text-gray-700 outline-none rounded-full"
        />
        <button className="bg-[#7bc74d] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6ab63d] transition">
          Search now
        </button>
      </div>
    </section>
  );
}
