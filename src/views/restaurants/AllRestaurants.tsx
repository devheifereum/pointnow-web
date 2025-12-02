"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Search, Grid, List, Building2, Lock, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(true);
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

  // Update search query and page when URL params change
  useEffect(() => {
    const queryParam = searchParams.get("query");
    const pageParam = searchParams.get("page");
    
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
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use search API if there's a query, otherwise use getAll
        const response = searchQuery.trim()
          ? await businessApi.search({ query: searchQuery.trim(), page, limit })
          : await businessApi.getAll({ page, limit });
        
        // For getAll, filter by is_active. For search, show all results (search API doesn't return is_active)
        const filteredBusinesses = searchQuery.trim()
          ? response.data.businesses
          : response.data.businesses.filter(business => business.is_active !== false);
        setBusinesses(filteredBusinesses);
        
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
          // Fallback: calculate pagination from response if metadata is missing
          // Note: This is a fallback - the API should always return metadata
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
          if (err instanceof ApiClientError) {
            setError(err.message || "Failed to load businesses");
          } else {
            setError("An unexpected error occurred");
          }
        } finally {
          setIsLoading(false);
        }
      };

      // Debounce search to avoid too many API calls
      const timeoutId = setTimeout(() => {
        fetchBusinesses();
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
              <h1 className="text-4xl font-gilroy-black text-black mb-4">All Businesses</h1>
              <p className="text-lg text-black">Discover amazing businesses near you</p>
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
                placeholder="Search businesses..."
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
            {isLoading ? "Loading..." : (
              pagination.total > 0 ? (
                `Showing ${((pagination.page - 1) * pagination.limit) + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} business${pagination.total !== 1 ? 'es' : ''}${searchQuery.trim() ? ` for "${searchQuery}"` : ''}`
              ) : (
                `No businesses found${searchQuery.trim() ? ` for "${searchQuery}"` : ''}`
              )
            )}
          </div>
        </div>

        {/* Loading State - Skeleton Loaders */}
        {isLoading && (
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

        {/* Error State */}
        {error && !isLoading && (
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

        {/* Businesses Grid/List */}
        {!isLoading && !error && (
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


        {/* Pagination */}
        {!isLoading && !error && businesses.length > 0 && (
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

        {/* No Results */}
        {!isLoading && !error && businesses.length === 0 && (
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

