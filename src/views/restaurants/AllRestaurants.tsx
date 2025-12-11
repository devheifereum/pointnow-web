"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Search, Grid, List, Building2, Lock, ChevronLeft, ChevronRight, ChevronDown, Users, Gift, TrendingUp, Star, ArrowRight, Zap, Shield, Award, Flame, Globe, X } from "lucide-react";
import { LightRays } from "@/components/ui/light-rays";
import { StripedPattern } from "@/components/magicui/striped-pattern";
import Navbar from "@/components/Navbar";
import { businessApi } from "@/lib/api/business";
import { regionsApi } from "@/lib/api/regions";
import { ApiClientError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/store";
import type { Business, TrendingBusiness } from "@/lib/types/business";
import type { RegionCountryCode } from "@/lib/types/regions";

const FEATURED_BUSINESS_ID = "cmhw3d766000zq2h240xtkpiz";

// Floating decoration component
const FloatingOrb = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <div 
    className={`absolute rounded-full blur-3xl opacity-30 animate-pulse ${className}`}
    style={{ animationDelay: `${delay}s`, animationDuration: '4s' }}
  />
);

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

export default function AllRestaurants() {
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [featuredBusiness, setFeaturedBusiness] = useState<TrendingBusiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 100,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);
  const [countries, setCountries] = useState<RegionCountryCode[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(searchParams.get("country_code") || "");
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  
  // Determine if we should show featured business (when no search query)
  const showFeatured = !searchQuery.trim();

  // Fetch featured business from trending API
  useEffect(() => {
    const fetchFeaturedBusiness = async () => {
      try {
        setIsFeaturedLoading(true);
        const response = await businessApi.getTrending();
        const featured = response.data.businesses.find(b => b.id === FEATURED_BUSINESS_ID);
        if (featured) {
          setFeaturedBusiness(featured);
        }
      } catch (err) {
        console.error("Failed to fetch featured business:", err);
      } finally {
        setIsFeaturedLoading(false);
      }
    };

    fetchFeaturedBusiness();
  }, []);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoadingCountries(true);
        const response = await regionsApi.getCountryCodes();
        // Sort countries alphabetically by name
        const sortedCountries = [...response.data.regions].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setCountries(sortedCountries);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Update search query, page, and country when URL params change
  useEffect(() => {
    const queryParam = searchParams.get("query");
    const pageParam = searchParams.get("page");
    const countryParam = searchParams.get("country_code");
    
    if (queryParam !== null) {
      setSearchQuery(queryParam);
    } else {
      setSearchQuery("");
    }
    
    if (pageParam) {
      const pageNum = parseInt(pageParam, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setPage(pageNum);
      }
    } else {
      setPage(1);
    }

    if (countryParam !== null) {
      setSelectedCountryCode(countryParam);
    } else {
      setSelectedCountryCode("");
    }
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Reset to page 1 when searching
    setPage(1);
    // Update URL without triggering navigation
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("query", value.trim());
    } else {
      params.delete("query");
    }
    params.delete("page"); // Reset to page 1
    router.replace(`/businesses?${params.toString()}`, { scroll: false });
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    setPage(1); // Reset to page 1 when filtering
    // Update URL without triggering navigation
    const params = new URLSearchParams(searchParams.toString());
    if (countryCode) {
      params.set("country_code", countryCode);
    } else {
      params.delete("country_code");
    }
    params.delete("page"); // Reset to page 1
    router.replace(`/businesses?${params.toString()}`, { scroll: false });
  };

  const handleClearCountry = () => {
    handleCountryChange("");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Update URL with new page
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.replace(`/businesses?${params.toString()}`, { scroll: false });
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Only fetch businesses when there's a search query
    if (!searchQuery.trim()) {
      setBusinesses([]);
      setIsLoading(false);
      return;
    }

    const fetchBusinesses = async () => {
      const startTime = Date.now();
      const minLoadingTime = 500; // Minimum loading time to prevent flickering
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await businessApi.search({ 
          query: searchQuery.trim(), 
          page, 
          limit,
          country_code: selectedCountryCode || undefined,
        });
        
        // Ensure minimum loading time to prevent blinking
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        
        setBusinesses(response.data.businesses);
        
        // Update pagination metadata
        if (response.data.metadata) {
          const metadata = response.data.metadata;
          setPagination({
            total: metadata.total,
            page: metadata.page,
            limit: metadata.limit,
            total_pages: metadata.total_pages,
            has_next: metadata.has_next,
            has_previous: metadata.has_previous,
          });
        } else {
          const total = response.data.businesses.length;
          const calculatedTotalPages = Math.ceil(total / limit);
          setPagination({
            total: total,
            page: page,
            limit: limit,
            total_pages: calculatedTotalPages,
            has_next: page < calculatedTotalPages,
            has_previous: page > 1,
          });
        }
      } catch (err) {
        // Ensure minimum loading time even on error
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        
        if (err instanceof ApiClientError) {
          setError(err.message || "Failed to load businesses");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid too many API calls and prevent blinking
    // Increased delay to 600ms for smoother UX
    const timeoutId = setTimeout(() => {
      fetchBusinesses();
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [page, limit, searchQuery, selectedCountryCode]);

  const featuredSlug = featuredBusiness ? createSlug(featuredBusiness.name) : "";
  const featuredHasMultipleImages = featuredBusiness?.business_images && featuredBusiness.business_images.length > 1;
  const currentFeaturedImage = featuredBusiness?.business_images?.[featuredImageIndex];

  const handleFeaturedPreviousImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (featuredBusiness?.business_images && featuredBusiness.business_images.length > 0) {
      const newIndex = featuredImageIndex === 0 
        ? featuredBusiness.business_images.length - 1 
        : featuredImageIndex - 1;
      setFeaturedImageIndex(newIndex);
    }
  };

  const handleFeaturedNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (featuredBusiness?.business_images && featuredBusiness.business_images.length > 0) {
      const newIndex = (featuredImageIndex + 1) % featuredBusiness.business_images.length;
      setFeaturedImageIndex(newIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Striped Pattern Background */}
      <StripedPattern
        width={60}
        height={60}
        direction="left"
        className="opacity-[0.03] text-[#7bc74d]"
      />

      {/* Floating Decorative Orbs */}
      {showFeatured && (
        <>
          <FloatingOrb className="w-96 h-96 bg-[#7bc74d] -top-48 -right-48" delay={0} />
          <FloatingOrb className="w-64 h-64 bg-[#7bc74d] top-1/3 -left-32" delay={1} />
          <FloatingOrb className="w-80 h-80 bg-[#6ab63d] bottom-1/4 -right-40" delay={2} />
        </>
      )}
      
      {/* Navigation */}
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 sm:pt-28 md:pt-32 lg:pt-36">
        {/* Hero Header for Featured View */}
        {showFeatured ? (
          <div className="text-center mb-16">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7bc74d]/10 via-[#6ab63d]/5 to-[#7bc74d]/10 backdrop-blur-sm border border-[#7bc74d]/20 px-5 py-2.5 rounded-full mb-8 shadow-sm">
              <div className="w-2 h-2 bg-[#7bc74d] rounded-full animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-[#5a9e3a] to-[#7bc74d] bg-clip-text text-transparent tracking-wide uppercase">
                Loyalty Rewards Platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-gilroy-black text-black mb-6 leading-tight">
              Earn Points.
              <span className="block bg-gradient-to-r from-[#7bc74d] to-[#4a9e2a] bg-clip-text text-transparent">
                Get Rewarded.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of customers earning loyalty points at their favorite local businesses. 
              Every purchase brings you closer to exclusive rewards.
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth?mode=user">
                  <button className="group relative bg-gradient-to-r from-[#7bc74d] to-[#5a9e3a] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-[#7bc74d]/25 hover:shadow-xl hover:shadow-[#7bc74d]/30 transition-all duration-300 inline-flex items-center gap-3 overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#6ab63d] to-[#4a8e2a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Gift className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Start Earning Free</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>No credit card required</span>
                </div>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-500" />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium">10,000+ users</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-sm font-medium text-gray-600 ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-gilroy-black text-black mb-2">Search Results</h1>
                <p className="text-lg text-gray-600">Find your favorite businesses</p>
              </div>
              {!isAuthenticated && (
                <Link href="/auth?mode=user">
                  <button className="bg-gradient-to-r from-[#7bc74d] to-[#5a9e3a] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-[#7bc74d]/20 hover:shadow-xl transition-all duration-300">
                    Login to Track Points
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className={`${showFeatured ? 'max-w-3xl mx-auto mb-20' : 'mb-8'}`}>
          <div className={`flex flex-col ${!showFeatured ? 'lg:flex-row' : ''} gap-4 mb-6`}>
            <div className="flex-1 flex gap-2 sm:gap-3">
              {/* Search Input */}
              <div className="flex-1 relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-[#7bc74d]/20 to-[#6ab63d]/20 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${showFeatured ? 'scale-105' : ''}`} />
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-[#7bc74d] transition-colors z-10" />
                  <input
                    type="text"
                    placeholder="Search for businesses, cafes, restaurants..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className={`w-full pl-10 sm:pl-12 ${searchQuery ? 'pr-9 sm:pr-10' : 'pr-3 sm:pr-4'} py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-[#7bc74d] focus:ring-4 focus:ring-[#7bc74d]/10 text-black placeholder-gray-400 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange("")}
                      className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors z-20 flex-shrink-0"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Country Filter - Next to search box */}
              <div className="relative flex items-center">
                {selectedCountryCode && (
                  <button
                    onClick={handleClearCountry}
                    className="absolute -left-6 sm:-left-7 p-1 hover:bg-gray-100 rounded-lg transition-colors z-20 flex-shrink-0"
                    aria-label="Clear country filter"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
                <div className="relative">
                  <Globe className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    disabled={isLoadingCountries}
                    className={`pl-8 sm:pl-10 pr-6 sm:pr-8 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-[#7bc74d] focus:ring-4 focus:ring-[#7bc74d]/10 text-black shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed min-w-[110px] sm:min-w-[130px] max-w-[130px] sm:max-w-[150px]`}
                    title={selectedCountryCode ? countries.find(c => c.country_code === selectedCountryCode)?.name || "All Countries" : "All Countries"}
                  >
                    <option value="">All</option>
                    {countries.map((country) => (
                      <option key={country.country_code} value={country.country_code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* View Mode Toggle - Only show when searching */}
            {!showFeatured && (
              <div className="flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-white shadow-md text-black font-medium" 
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-white shadow-md text-black font-medium" 
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </button>
              </div>
            )}
          </div>

          {/* Results Count - Only show when searching */}
          {!showFeatured && (
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm text-gray-600 font-medium">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#7bc74d] border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </span>
                ) : (
                  pagination.total > 0 ? (
                    `Showing ${((pagination.page - 1) * pagination.limit) + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} business${pagination.total !== 1 ? 'es' : ''}${searchQuery ? ` for "${searchQuery}"` : ''}${selectedCountryCode ? ` in ${countries.find(c => c.country_code === selectedCountryCode)?.name || selectedCountryCode}` : ''}`
                  ) : (
                    `No businesses found${searchQuery ? ` for "${searchQuery}"` : ''}${selectedCountryCode ? ` in ${countries.find(c => c.country_code === selectedCountryCode)?.name || selectedCountryCode}` : ''}`
                  )
                )}
              </div>
              {selectedCountryCode && (
                <button
                  onClick={handleClearCountry}
                  className="text-xs text-[#7bc74d] hover:text-[#6ab63d] font-medium flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear country filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Featured Business Hero Card */}
        {showFeatured && (
          <>
            {isFeaturedLoading ? (
              <div className="max-w-5xl mx-auto mb-24">
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-pulse">
                  <div className="md:flex">
                    <div className="md:w-1/2 h-72 md:h-96 bg-gradient-to-br from-gray-200 to-gray-300" />
                    <div className="md:w-1/2 p-10">
                      <div className="h-6 bg-gray-200 rounded-full w-32 mb-6" />
                      <div className="h-10 bg-gray-200 rounded-xl w-3/4 mb-4" />
                      <div className="h-4 bg-gray-200 rounded-lg w-full mb-2" />
                      <div className="h-4 bg-gray-200 rounded-lg w-5/6 mb-8" />
                      <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            ) : featuredBusiness ? (
              <div className="max-w-5xl mx-auto mb-24">
                {/* Featured Label */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#7bc74d]" />
                  <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 px-4 py-2 rounded-full">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-orange-600 tracking-wide uppercase">Featured Business</span>
                  </div>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#7bc74d]" />
                </div>

                <Link href={`/leaderboard/${featuredSlug}`} className="block group">
                  <div className="relative bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover:border-[#7bc74d]/40">
                    {/* Gradient Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#7bc74d]/20 via-transparent to-[#7bc74d]/20 rounded-[2rem] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                    
                    <div className="relative md:flex bg-white rounded-[2rem]">
                      {/* Image Section */}
                      <div className="md:w-1/2 relative h-72 md:h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        {currentFeaturedImage ? (
                          <>
                            <Image
                              src={currentFeaturedImage.image_url}
                              alt={featuredBusiness.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                            {featuredHasMultipleImages && (
                              <>
                                <button
                                  onClick={handleFeaturedPreviousImage}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md hover:bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-30"
                                  aria-label="Previous image"
                                >
                                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                                </button>
                                <button
                                  onClick={handleFeaturedNextImage}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md hover:bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-30"
                                  aria-label="Next image"
                                >
                                  <ChevronRight className="w-5 h-5 text-gray-800" />
                                </button>
                                {featuredBusiness.business_images && (
                                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full z-20 font-medium">
                                    {featuredImageIndex + 1} / {featuredBusiness.business_images.length}
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <LightRays
                              count={5}
                              color="rgba(123, 199, 77, 0.4)"
                              blur={25}
                              speed={6}
                              length="80%"
                              className="absolute inset-0"
                            />
                            <div className="relative z-10 flex items-center justify-center h-full">
                              <Building2 className="w-28 h-28 text-[#7bc74d]" />
                            </div>
                          </>
                        )}
                        
                        {/* Customer Count Badge */}
                        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full z-20 flex items-center gap-2.5 shadow-lg">
                          <div className="w-8 h-8 bg-[#7bc74d]/10 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-[#7bc74d]" />
                          </div>
                          <span className="text-sm font-bold text-gray-800">{featuredBusiness.total_customers.toLocaleString()} customers</span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                        {/* Rating Badge */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 px-3 py-1.5 rounded-full w-fit mb-5">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-yellow-700">Top Rated Business</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-4 group-hover:text-[#7bc74d] transition-colors duration-300">
                          {featuredBusiness.name}
                        </h2>
                        
                        {featuredBusiness.description && (
                          <p className="text-gray-600 mb-6 line-clamp-3 text-lg leading-relaxed">
                            {featuredBusiness.description}
                          </p>
                        )}

                        {featuredBusiness.address && (
                          <div className="flex items-start gap-3 text-gray-500 mb-8 p-4 bg-gray-50 rounded-xl">
                            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#7bc74d]" />
                            <span className="line-clamp-2">{featuredBusiness.address}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-[#7bc74d] font-semibold text-lg group-hover:gap-4 transition-all duration-300">
                          <span>Explore Leaderboard</span>
                          <div className="w-10 h-10 bg-[#7bc74d]/10 rounded-full flex items-center justify-center group-hover:bg-[#7bc74d] transition-colors duration-300">
                            <ArrowRight className="w-5 h-5 group-hover:text-white transition-colors duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ) : null}

            {/* Product Description / How It Works Section */}
            <div className="mb-24">
              <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-6">
                  <Zap className="w-4 h-4 text-[#7bc74d]" />
                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Simple Process</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-gilroy-black text-black mb-5">
                  How It Works
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Start earning rewards in three simple steps. No complicated setup required.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[#7bc74d]/20 via-[#7bc74d]/40 to-[#7bc74d]/20" />
                
                {/* Step 1 */}
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#7bc74d]/20 transition-all duration-500 text-center group">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#7bc74d] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-[#7bc74d]/30">
                    1
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-[#7bc74d]/10 to-[#6ab63d]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Search className="w-10 h-10 text-[#7bc74d]" />
                  </div>
                  <h3 className="text-xl font-gilroy-extrabold text-black mb-3">Find a Business</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Search for participating businesses near you and discover amazing local spots
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#7bc74d]/20 transition-all duration-500 text-center group">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#7bc74d] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-[#7bc74d]/30">
                    2
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-[#7bc74d]/10 to-[#6ab63d]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <TrendingUp className="w-10 h-10 text-[#7bc74d]" />
                  </div>
                  <h3 className="text-xl font-gilroy-extrabold text-black mb-3">Earn Points</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Make purchases and automatically earn loyalty points with every transaction
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#7bc74d]/20 transition-all duration-500 text-center group">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#7bc74d] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-[#7bc74d]/30">
                    3
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-[#7bc74d]/10 to-[#6ab63d]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Gift className="w-10 h-10 text-[#7bc74d]" />
                  </div>
                  <h3 className="text-xl font-gilroy-extrabold text-black mb-3">Get Rewards</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Redeem your points for exclusive discounts, freebies, and special offers
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="relative mb-24 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7bc74d] via-[#5a9e3a] to-[#7bc74d] rounded-[2.5rem]" />
              <div 
                className="absolute inset-0 opacity-100"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/path%3E%3C/svg%3E")`,
                }}
              />
              
              <div className="relative px-8 py-16 md:py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-gilroy-black text-white mb-3">100+</div>
                    <div className="text-white/70 text-sm md:text-base font-medium">Partner Businesses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-gilroy-black text-white mb-3">10K+</div>
                    <div className="text-white/70 text-sm md:text-base font-medium">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-gilroy-black text-white mb-3">50K+</div>
                    <div className="text-white/70 text-sm md:text-base font-medium">Points Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-gilroy-black text-white mb-3">5K+</div>
                    <div className="text-white/70 text-sm md:text-base font-medium">Rewards Claimed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="mb-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#7bc74d]/10 px-4 py-2 rounded-full mb-6">
                    <Award className="w-4 h-4 text-[#7bc74d]" />
                    <span className="text-sm font-semibold text-[#7bc74d] uppercase tracking-wide">Why Choose Us</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-gilroy-black text-black mb-6 leading-tight">
                    The Smarter Way to 
                    <span className="text-[#7bc74d]"> Earn Rewards</span>
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    We have partnered with the best local businesses to bring you an unparalleled loyalty experience. 
                    Every purchase counts towards your next reward.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { icon: Zap, title: "Instant Points", desc: "Points credited immediately after purchase" },
                      { icon: Shield, title: "Secure & Private", desc: "Your data is always protected" },
                      { icon: Gift, title: "Exclusive Rewards", desc: "Access to special offers and discounts" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#7bc74d]/30 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#7bc74d]/10 to-[#6ab63d]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-6 h-6 text-[#7bc74d]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7bc74d]/20 to-[#6ab63d]/10 rounded-[2rem] blur-3xl" />
                  <div className="relative bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: "4.9", label: "User Rating", suffix: "/5" },
                        { value: "24/7", label: "Support", suffix: "" },
                        { value: "100%", label: "Satisfaction", suffix: "" },
                        { value: "0", label: "Hidden Fees", suffix: "" },
                      ].map((stat, i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-[#7bc74d]/5 transition-colors duration-300">
                          <div className="text-3xl font-gilroy-black text-[#7bc74d] mb-1">
                            {stat.value}<span className="text-xl">{stat.suffix}</span>
                          </div>
                          <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] mb-8 bg-white border border-gray-200">
              <FloatingOrb className="w-64 h-64 bg-[#7bc74d]/20 -top-32 -right-32" delay={0} />
              <FloatingOrb className="w-48 h-48 bg-[#7bc74d]/20 -bottom-24 -left-24" delay={1.5} />
              
              <div className="relative px-8 py-16 md:py-20 text-center">
                <h2 className="text-3xl md:text-5xl font-gilroy-black text-gray-900 mb-6 leading-tight">
                  Ready to Start Earning?
                </h2>
                <p className="text-gray-600 mb-10 max-w-xl mx-auto text-lg">
                  Join thousands of happy customers who are already earning rewards at their favorite local businesses.
                </p>
                {!isAuthenticated && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/auth?mode=user">
                      <button className="group relative bg-[#7bc74d] hover:bg-[#6ab63d] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-lg shadow-[#7bc74d]/30 transition-all duration-300 inline-flex items-center gap-3">
                        Create Free Account
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                    <span className="text-gray-600 text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Free forever, no credit card
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Loading State - Skeleton Loaders (Only when searching) */}
        {!showFeatured && isLoading && (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20 animate-pulse"
                >
                  {/* Image Skeleton */}
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300" />
                  
                  {/* Content Skeleton */}
                  <div className="p-6">
                    <div className="mb-3">
                      <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded-lg w-full mb-1" />
                      <div className="h-4 bg-gray-200 rounded-lg w-5/6" />
                    </div>
                    
                    {/* Address Skeleton */}
                    <div className="flex items-start gap-1 mb-4">
                      <div className="w-4 h-4 bg-gray-200 rounded mt-0.5 flex-shrink-0" />
                      <div className="h-4 bg-gray-200 rounded-lg w-2/3" />
                    </div>
                    
                    {/* Button Skeleton */}
                    <div className="h-12 bg-gray-200 rounded-xl w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 flex items-center space-x-6 border border-white/20 animate-pulse"
                >
                  {/* Image Skeleton */}
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex-shrink-0" />
                  
                  {/* Content Skeleton */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-2" />
                      <div className="h-4 bg-gray-200 rounded-lg w-full mb-1" />
                      <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-4 bg-gray-200 rounded-lg w-32" />
                      </div>
                      <div className="h-10 bg-gray-200 rounded-lg w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Error State (Only when searching) */}
        {!showFeatured && error && !isLoading && (
          <div className="text-center py-16">
            {(error.includes("Invalid access token") || error.includes("not authorized") || error.includes("unauthorized")) ? (
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                  <div className="mb-4 flex justify-center">
                    <Lock className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-gilroy-extrabold text-black mb-2">Login Required</h3>
                  <p className="text-gray-600 mb-6">Please login to view businesses</p>
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

        {/* Businesses Grid/List (Only when searching) */}
        {!showFeatured && !isLoading && !error && (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businesses.map((business, index) => {
                const slug = createSlug(business.name);
                const iconColor = getBusinessIconColor(business.name);
                const rayColor = getRayColor(index);
                const currentImageIndex = imageIndices[business.id] || 0;
                const hasMultipleImages = business.business_images && business.business_images.length > 1;
                const currentImage = business.business_images?.[currentImageIndex];
                
                const handlePreviousImage = (e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (business.business_images && business.business_images.length > 0) {
                    const newIndex = currentImageIndex === 0 
                      ? business.business_images.length - 1 
                      : currentImageIndex - 1;
                    setImageIndices(prev => ({ ...prev, [business.id]: newIndex }));
                  }
                };
                
                const handleNextImage = (e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (business.business_images && business.business_images.length > 0) {
                    const newIndex = (currentImageIndex + 1) % business.business_images.length;
                    setImageIndices(prev => ({ ...prev, [business.id]: newIndex }));
                  }
                };
                
                return (
                  <Link
                    key={business.id}
                    href={`/leaderboard/${slug}`}
                    className="block"
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-white/20">
                      {/* Business Image with Light Rays */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                        {currentImage ? (
                          <>
                            <Image
                              src={currentImage.image_url}
                              alt={business.name}
                              fill
                              className="object-cover transition-opacity duration-300"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            {hasMultipleImages && (
                              <>
                                <button
                                  onClick={handlePreviousImage}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-30"
                                  aria-label="Previous image"
                                >
                                  <ChevronLeft className="w-4 h-4 text-black" />
                                </button>
                                <button
                                  onClick={handleNextImage}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-30"
                                  aria-label="Next image"
                                >
                                  <ChevronRight className="w-4 h-4 text-black" />
                                </button>
                                {business.business_images && (
                                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full z-20">
                                    {currentImageIndex + 1} / {business.business_images.length}
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                        
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full z-20">
                          <span className="text-sm font-semibold text-black">{business.registration_number}</span>
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
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center space-x-6 group cursor-pointer border border-white/20">
                      {/* Business Image */}
                      <div className="relative w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        {(() => {
                          const currentImageIndex = imageIndices[business.id] || 0;
                          const hasMultipleImages = business.business_images && business.business_images.length > 1;
                          const currentImage = business.business_images?.[currentImageIndex];
                          
                          const handlePreviousImage = (e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (business.business_images && business.business_images.length > 0) {
                              const newIndex = currentImageIndex === 0 
                                ? business.business_images.length - 1 
                                : currentImageIndex - 1;
                              setImageIndices(prev => ({ ...prev, [business.id]: newIndex }));
                            }
                          };
                          
                          const handleNextImage = (e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (business.business_images && business.business_images.length > 0) {
                              const newIndex = (currentImageIndex + 1) % business.business_images.length;
                              setImageIndices(prev => ({ ...prev, [business.id]: newIndex }));
                            }
                          };
                          
                          return currentImage ? (
                            <>
                              <Image
                                src={currentImage.image_url}
                                alt={business.name}
                                fill
                                className="object-cover transition-opacity duration-300"
                                unoptimized
                              />
                              <div className="absolute inset-0 bg-black/10" />
                              {hasMultipleImages && (
                                <>
                                  <button
                                    onClick={handlePreviousImage}
                                    className="absolute left-0.5 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-30"
                                    aria-label="Previous image"
                                  >
                                    <ChevronLeft className="w-3 h-3 text-black" />
                                  </button>
                                  <button
                                    onClick={handleNextImage}
                                    className="absolute right-0.5 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-30"
                                    aria-label="Next image"
                                  >
                                    <ChevronRight className="w-3 h-3 text-black" />
                                  </button>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <LightRays
                                count={3}
                                color={rayColor}
                                blur={15}
                                speed={8}
                                length="80%"
                                className="absolute inset-0"
                              />
                              <div className={`relative z-10 ${iconColor}`}>
                                <Building2 className="w-10 h-10" />
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {/* Business Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-gilroy-extrabold text-black mb-1">
                              {business.name}
                            </h3>
                            {business.description && (
                              <p className="text-gray-600 text-sm line-clamp-2">{business.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            {business.address && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span className="line-clamp-1">{business.address}</span>
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


        {/* Pagination (Only when searching) */}
        {!showFeatured && !isLoading && !error && businesses.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t-2 border-gray-300 bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-700 text-center sm:text-left">
              {pagination.total_pages > 1 ? (
                <>Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} total businesses)</>
              ) : (
                <>Showing {businesses.length} of {pagination.total || businesses.length} business{(pagination.total || businesses.length) !== 1 ? 'es' : ''}</>
              )}
            </div>
            {pagination.total_pages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.has_previous}
                  className="p-2 sm:p-3 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 font-bold" />
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-black bg-gray-100 rounded-lg border border-gray-200">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.has_next}
                  className="p-2 sm:p-3 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 font-bold" />
                </button>
              </div>
            )}
            {pagination.total_pages <= 1 && pagination.total > businesses.length && (
              <div className="text-sm text-gray-500 italic">
                (Some businesses filtered out)
              </div>
            )}
          </div>
        )}

        {/* No Results (Only when searching) */}
        {!showFeatured && !isLoading && !error && businesses.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4 flex justify-center">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-gilroy-extrabold text-black mb-2">No businesses found</h3>
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

