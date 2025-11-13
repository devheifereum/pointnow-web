"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Loader2, Building2 } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { LightRays } from "@/components/ui/light-rays";
import { businessApi } from "@/lib/api/business";
import { ApiClientError } from "@/lib/api/client";
import type { Business } from "@/lib/types/business";

// Helper function to create slug from name
const createSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

// Helper function to get business icon color based on business name
const getBusinessIconColor = (name: string): string => {
  const colors = [
    "text-blue-500",
    "text-green-500",
    "text-purple-500",
    "text-orange-500",
    "text-red-500",
    "text-indigo-500",
    "text-pink-500",
    "text-cyan-500",
    "text-yellow-500",
    "text-teal-500",
    "text-amber-500",
    "text-violet-500",
    "text-emerald-500",
  ];
  return colors[name.length % colors.length];
};

// Helper function to get ray color
const getRayColor = (index: number): string => {
  const colors = [
    "rgba(123, 199, 77, 0.4)",
    "rgba(59, 130, 246, 0.4)",
    "rgba(245, 158, 11, 0.4)",
    "rgba(239, 68, 68, 0.4)",
    "rgba(168, 85, 247, 0.4)",
    "rgba(34, 197, 94, 0.4)",
  ];
  return colors[index % colors.length];
};

export default function Restaurants() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await businessApi.getAll({ page: 1, limit: 6 });
        // Only show active businesses
        const activeBusinesses = response.data.businesses.filter(business => business.is_active);
        setBusinesses(activeBusinesses);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message || "Failed to load businesses");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  if (isLoading) {
    return (
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#7bc74d]" />
            <p className="mt-4 text-gray-600">Loading businesses...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-gray-50 overflow-hidden">
      {/* Flickering Grid Background */}
      <FlickeringGrid
        className="absolute inset-0 opacity-20"
        squareSize={8}
        gridGap={12}
        flickerChance={0.1}
        color="#7bc74d"
        maxOpacity={0.3}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-gilroy-black text-black mb-4 drop-shadow-sm">
            Our Partner Merchants
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto drop-shadow-sm">
            Trusted by 1000+ businesses and loved by millions of customers. Check your loyalty points and earn rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((business, index) => {
            const slug = createSlug(business.name);
            const iconColor = getBusinessIconColor(business.name);
            const rayColor = getRayColor(index);
            
            return (
              <Link
                key={business.id}
                href={`/leaderboard/${slug}`}
                className="block"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-white/20">
                  {/* Business Image with Light Rays */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                    {/* Light Rays Effect */}
                    <LightRays
                      count={4}
                      color={rayColor}
                      blur={20}
                      speed={6}
                      length="70%"
                      className="absolute inset-0"
                    />
                    
                    <div className={`relative z-10 ${iconColor}`}>
                      <Building2 className="w-16 h-16" />
                    </div>
                    
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full z-20">
                      <span className="text-sm font-semibold text-gray-700">{business.registration_number}</span>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-gilroy-extrabold text-black mb-1">
                          {business.name}
                        </h3>
                        {business.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">{business.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    {business.address && (
                      <div className="flex items-start gap-1 mb-4 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{business.address}</span>
                      </div>
                    )}

                    {/* Point Now Button */}
                    <button className="w-full mt-4 bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold py-3 rounded-xl transition-colors">
                      Point Now
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/businesses">
            <button className="bg-white border-2 border-[#7bc74d] text-[#7bc74d] hover:bg-[#7bc74d] hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              View All Partner Merchants
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
