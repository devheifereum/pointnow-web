"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Search, Grid, List, Loader2 } from "lucide-react";
import { LightRays } from "@/components/ui/light-rays";
import { StripedPattern } from "@/components/magicui/striped-pattern";
import Navbar from "@/components/Navbar";
import { businessApi } from "@/lib/api/business";
import { ApiClientError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/store";
import type { Business } from "@/lib/types/business";

// Helper function to create slug from name
const createSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

// Helper function to get emoji based on business name
const getBusinessEmoji = (name: string): string => {
  const emojis = ["🏢", "🏪", "🏬", "🏭", "🏨", "🏦", "🏛️", "🏗️", "💼", "📊", "💰", "🎯", "📈"];
  return emojis[name.length % emojis.length];
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

export default function AllRestaurants() {
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [restaurants, setRestaurants] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page] = useState(1);
  const [limit] = useState(19);

  // Update search query when URL param changes
  useEffect(() => {
    const queryParam = searchParams.get("query");
    if (queryParam !== null) {
      setSearchQuery(queryParam);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Update URL without triggering navigation
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("query", value.trim());
    } else {
      params.delete("query");
    }
    router.replace(`/restaurants?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use search API if there's a query, otherwise use getAll
        const response = searchQuery.trim()
          ? await businessApi.search({ query: searchQuery.trim(), page, limit })
          : await businessApi.getAll({ page, limit });
        
        // For getAll, filter by is_active. For search, show all results (search API doesn't return is_active)
        const businesses = searchQuery.trim()
          ? response.data.businesses
          : response.data.businesses.filter(business => business.is_active !== false);
        setRestaurants(businesses);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message || "Failed to load restaurants");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchRestaurants();
    }, searchQuery.trim() ? 300 : 0);

    return () => clearTimeout(timeoutId);
  }, [page, limit, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Striped Pattern Background */}
      <StripedPattern
        width={60}
        height={60}
        direction="left"
        className="opacity-5 text-[#7bc74d]"
      />
      
      {/* Navigation */}
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-gilroy-black text-black mb-4">All Restaurants</h1>
              <p className="text-lg text-black">Discover amazing restaurants near you</p>
            </div>
            {!isAuthenticated && (
              <Link href="/auth?mode=user">
                <button className="bg-[#7bc74d] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#6ab63d] transition shadow-lg hover:shadow-xl">
                  Login to Track Points
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-500"
              />
            </div>


            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-sm text-black" : "text-black"
                }`}
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-white shadow-sm text-black" : "text-black"
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-black">
            {isLoading ? "Loading..." : `Showing ${restaurants.length} restaurant${restaurants.length !== 1 ? 's' : ''}${searchQuery.trim() ? ` for "${searchQuery}"` : ''}`}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#7bc74d]" />
            <p className="mt-4 text-gray-600">Loading restaurants...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-16">
            {(error.includes("Invalid access token") || error.includes("not authorized") || error.includes("unauthorized")) ? (
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                  <div className="text-6xl mb-4">🔒</div>
                  <h3 className="text-2xl font-gilroy-extrabold text-black mb-2">Login Required</h3>
                  <p className="text-gray-600 mb-6">Please login to view restaurants</p>
                  <Link href="/auth?mode=user">
                    <button className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl">
                      Login
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-red-600">{error}</p>
            )}
          </div>
        )}

        {/* Restaurants Grid/List */}
        {!isLoading && !error && (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map((restaurant, index) => {
                const slug = createSlug(restaurant.name);
                const emoji = getBusinessEmoji(restaurant.name);
                const rayColor = getRayColor(index);
                
                return (
                  <Link
                    key={restaurant.id}
                    href={`/leaderboard/${slug}`}
                    className="block"
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-white/20">
                      {/* Restaurant Image with Light Rays */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                        <LightRays
                          count={4}
                          color={rayColor}
                          blur={20}
                          speed={6}
                          length="70%"
                          className="absolute inset-0"
                        />
                        
                        <div className="text-6xl relative z-10">{emoji}</div>
                        
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full z-20">
                          <span className="text-sm font-semibold text-black">{restaurant.registration_number}</span>
                        </div>
                      </div>

                      {/* Restaurant Info */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-gilroy-extrabold text-black mb-1">
                              {restaurant.name}
                            </h3>
                            {restaurant.description && (
                              <p className="text-gray-600 text-sm line-clamp-2">{restaurant.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Address */}
                        {restaurant.address && (
                          <div className="flex items-start gap-1 mb-4 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{restaurant.address}</span>
                          </div>
                        )}

                        {/* Order Button */}
                        <button className="w-full bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold py-3 rounded-xl transition-colors">
                          Point Now
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {restaurants.map((restaurant, index) => {
                const slug = createSlug(restaurant.name);
                const emoji = getBusinessEmoji(restaurant.name);
                const rayColor = getRayColor(index);
                
                return (
                  <Link
                    key={restaurant.id}
                    href={`/leaderboard/${slug}`}
                    className="block"
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center space-x-6 group cursor-pointer border border-white/20">
                      {/* Restaurant Image */}
                      <div className="relative w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <LightRays
                          count={3}
                          color={rayColor}
                          blur={15}
                          speed={8}
                          length="80%"
                          className="absolute inset-0"
                        />
                        <div className="text-3xl relative z-10">{emoji}</div>
                      </div>

                      {/* Restaurant Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-gilroy-extrabold text-black mb-1">
                              {restaurant.name}
                            </h3>
                            {restaurant.description && (
                              <p className="text-gray-600 text-sm line-clamp-2">{restaurant.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            {restaurant.address && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span className="line-clamp-1">{restaurant.address}</span>
                              </div>
                            )}
                          </div>
                          <button className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                            Point Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )
        )}


        {/* No Results */}
        {!isLoading && !error && restaurants.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-gilroy-extrabold text-black mb-2">No restaurants found</h3>
            <p className="text-black mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                handleSearchChange("");
              }}
              className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

