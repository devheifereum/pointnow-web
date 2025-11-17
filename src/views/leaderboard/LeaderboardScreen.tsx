"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, Crown, Calendar, Star, ChevronLeft, ChevronRight, Search, Loader2, LogIn, ArrowRight, Building2, User, Lightbulb } from "lucide-react";
import { LightRays } from "@/components/ui/light-rays";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { customersApi } from "@/lib/api/customers";
import { businessApi } from "@/lib/api/business";
import { ApiClientError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/store";
import type { Customer, CustomerPosition } from "@/lib/types/customers";
import type { Business } from "@/lib/types/business";

interface LeaderboardScreenProps {
  restaurantName: string;
}

// Helper function to create slug from name
const createSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

export default function LeaderboardScreen({ restaurantName }: LeaderboardScreenProps) {
  const [timeFilter, setTimeFilter] = useState<"all-time" | "monthly" | "weekly">("all-time");
  const [searchQuery, setSearchQuery] = useState("");
  const [leaderboardData, setLeaderboardData] = useState<Customer[]>([]);
  const [businessData, setBusinessData] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<CustomerPosition | null>(null);
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);
  const [isNotCustomer, setIsNotCustomer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user: authUser } = useAuthStore();


  // Fetch business by name/slug
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await businessApi.getAll({ limit: 100 });
        const businesses = response.data.businesses;
        const matchingBusiness = businesses.find(
          (b) => createSlug(b.name) === restaurantName
        );
        
        if (matchingBusiness) {
          setBusinessData(matchingBusiness);
          setBusinessId(matchingBusiness.id);
          setCurrentImageIndex(0); // Reset image index when business changes
        } else {
          setError("Business not found");
          setIsLoading(false);
        }
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message || "Failed to load business");
        } else {
          setError("An unexpected error occurred");
        }
        setIsLoading(false);
      }
    };

    fetchBusiness();
  }, [restaurantName]);

  // Fetch leaderboard data
  useEffect(() => {
    if (!businessId) return;

    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const now = new Date();
        const endDate = now.toISOString().split('T')[0];
        let startDate: string | undefined;
        
        if (timeFilter === "weekly") {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          startDate = weekAgo.toISOString().split('T')[0];
        } else if (timeFilter === "monthly") {
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          startDate = monthAgo.toISOString().split('T')[0];
        }
        
        const response = await customersApi.getLeaderboard({
          business_id: businessId,
          page: 1,
          limit: 100,
          start_date: startDate,
          end_date: timeFilter !== "all-time" ? endDate : undefined,
        });
        
        setLeaderboardData(response.data.customers || []);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message || "Failed to load leaderboard");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [businessId, timeFilter]);

  // Fetch user position
  useEffect(() => {
    if (!businessId || !authUser?.user?.id) return;

    const fetchUserPosition = async () => {
      try {
        setIsLoadingPosition(true);
        setIsNotCustomer(false);
        
        // First, get the user profile to retrieve the customer ID
        const profileResponse = await customersApi.getUserProfile(authUser.user.id);
        const customerId = profileResponse.data.user.customer?.id;
        
        if (!customerId) {
          // User doesn't have a customer record yet
          setUserPosition(null);
          setIsNotCustomer(true);
          return;
        }
        
        const response = await customersApi.getPosition({
          business_id: businessId,
          customer_id: customerId,
        });
        setUserPosition(response.data.position);
        setIsNotCustomer(false);
      } catch (err) {
        // Check if user is not a customer for this business
        if (err instanceof ApiClientError) {
          const errorMessage = err.message.toLowerCase();
          if (
            errorMessage.includes("customer business not found") ||
            errorMessage.includes("customer not found") ||
            errorMessage.includes("not a customer") ||
            err.status === 404
          ) {
            setIsNotCustomer(true);
            setUserPosition(null);
            return;
          }
          console.error("Failed to fetch user position:", err);
        }
        setUserPosition(null);
        setIsNotCustomer(false);
      } finally {
        setIsLoadingPosition(false);
      }
    };

    fetchUserPosition();
  }, [businessId, authUser?.user?.id]);

  // Helper functions for display
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

  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Get badge based on points
  const getBadge = (points: number): string => {
    if (points >= 10000) return "Diamond";
    if (points >= 5000) return "Platinum";
    if (points >= 2000) return "Gold";
    return "Silver";
  };

  // Get avatar color based on name
  const getAvatarColor = (name: string): string => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-cyan-500",
      "bg-yellow-500",
      "bg-teal-500",
    ];
    return colors[name.length % colors.length];
  };

  // Extended customer type for display
  interface DisplayCustomer extends Customer {
    rank: number;
    points: number;
    visits: number;
    lastVisit: string;
    badge: string;
    avatarColor: string;
    joinedDate: string;
  }

  // Get medal component based on rank
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-500 fill-yellow-500" />;
      case 2:
        return <Medal className="w-7 h-7 text-gray-400 fill-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600 fill-orange-600" />;
      default:
        return <div className="w-8 h-8 flex items-center justify-center text-gray-500 font-gilroy-black text-lg">#{rank}</div>;
    }
  };

  // Get badge color
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Diamond":
        return "bg-gradient-to-r from-blue-400 to-cyan-400 text-white";
      case "Platinum":
        return "bg-gradient-to-r from-slate-300 to-slate-400 text-white";
      case "Gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white";
      case "Silver":
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // Filter leaderboard based on search query
  const filteredLeaderboard: DisplayCustomer[] = leaderboardData
    .map((customer, index) => {
      const totalPoints = (customer as Customer & { total_points?: number }).total_points || customer.points || 0;
      const totalVisits = (customer as Customer & { total_visits?: number }).total_visits || customer.visits || 0;
      const lastVisitAt = (customer as Customer & { last_visit_at?: string }).last_visit_at || customer.last_visit;
      
      return {
        ...customer,
        rank: index + 1,
        points: totalPoints,
        visits: totalVisits,
        lastVisit: formatDate(lastVisitAt),
        badge: getBadge(totalPoints),
        avatarColor: getAvatarColor(customer.name),
        joinedDate: customer.created_at 
          ? new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : "N/A",
      };
    })
    .filter((customer) => {
      if (!searchQuery) return true;
      return customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             customer.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
             customer.rank.toString().includes(searchQuery);
    });

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Effects */}
      <FlickeringGrid
        className="absolute inset-0 opacity-10"
        squareSize={6}
        gridGap={8}
        flickerChance={0.05}
        color="#7bc74d"
        maxOpacity={0.2}
      />
      
      <AnimatedGridPattern
        className="opacity-20"
        width={60}
        height={60}
        numSquares={50}
        maxOpacity={0.05}
        duration={4}
      />

      <div className="relative z-10">
        {/* Navigation */}
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link 
            href="/businesses"
            className="inline-flex items-center text-gray-600 hover:text-[#7bc74d] transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Businesses
          </Link>

          {/* Business Header */}
          {isLoading && !businessData ? (
            <div className="relative bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] rounded-3xl p-8 mb-8 overflow-hidden">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 mb-8">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          ) : businessData ? (
            <div className="relative bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] rounded-3xl p-8 mb-8 overflow-hidden">
              <LightRays
                count={8}
                color="rgba(255, 255, 255, 0.2)"
                blur={30}
                speed={8}
                length="90%"
                className="absolute inset-0"
              />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center">
                  <div className="relative mr-4 sm:mr-6 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 overflow-hidden group">
                    {businessData.business_images && businessData.business_images.length > 0 ? (
                      <>
                        <img
                          src={businessData.business_images[currentImageIndex]?.image_url || businessData.business_images[0].image_url}
                          alt={businessData.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-lg transition-opacity duration-300"
                        />
                        {businessData.business_images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const newIndex = currentImageIndex === 0 
                                  ? businessData.business_images!.length - 1 
                                  : currentImageIndex - 1;
                                setCurrentImageIndex(newIndex);
                              }}
                              className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-30"
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const newIndex = (currentImageIndex + 1) % businessData.business_images!.length;
                                setCurrentImageIndex(newIndex);
                              }}
                              className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-30"
                              aria-label="Next image"
                            >
                              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                            </button>
                            <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full z-20">
                              {currentImageIndex + 1} / {businessData.business_images.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <Building2 className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 ${getBusinessIconColor(businessData.name)}`} />
                    )}
                  </div>
                  <div className="text-white">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-gilroy-black mb-1 sm:mb-2">{businessData.name}</h1>
                    <p className="text-base sm:text-lg md:text-xl opacity-90">Points Leaderboard</p>
                  </div>
                </div>
                
                <div className="flex gap-3 sm:gap-4 md:gap-6 text-white text-center w-full md:w-auto justify-center md:justify-end">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 flex-1 md:flex-none md:min-w-[120px]">
                    <div className="text-2xl sm:text-3xl font-gilroy-black">{leaderboardData.length}</div>
                    <div className="text-xs sm:text-sm opacity-90">Total Members</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 flex-1 md:flex-none md:min-w-[120px]">
                    <div className="text-2xl sm:text-3xl font-gilroy-black">
                      {Math.round(leaderboardData.reduce((sum, c) => {
                        const totalPoints = (c as Customer & { total_points?: number }).total_points || c.points || 0;
                        return sum + totalPoints;
                      }, 0) / 1000)}K
                    </div>
                    <div className="text-xs sm:text-sm opacity-90">Points Earned</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Search Bar and Time Filter */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-gilroy-black text-black">Top Customers</h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 sm:min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, rank, or badge..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-500 bg-white shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Time Filter */}
                <div className="flex bg-white rounded-xl p-1 shadow-sm">
                  <button
                    onClick={() => setTimeFilter("all-time")}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      timeFilter === "all-time" ? "bg-[#7bc74d] text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    All Time
                  </button>
                  <button
                    onClick={() => setTimeFilter("monthly")}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      timeFilter === "monthly" ? "bg-[#7bc74d] text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Monthly
                  </button>
                  <button
                    onClick={() => setTimeFilter("weekly")}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      timeFilter === "weekly" ? "bg-[#7bc74d] text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Weekly
                  </button>
                </div>
              </div>
            </div>

            {/* Search Results Count */}
            {searchQuery && (
              <div className="text-sm text-gray-600 mb-4">
                Found {filteredLeaderboard.length} {filteredLeaderboard.length === 1 ? 'customer' : 'customers'} matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#7bc74d]" />
              <p className="mt-4 text-gray-600">Loading leaderboard...</p>
            </div>
          )}

          {/* Top 3 Podium - Only show when no search or when top 3 are in results */}
          {!isLoading && filteredLeaderboard.length > 0 && (!searchQuery || filteredLeaderboard.some(c => c.rank <= 3)) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* 2nd Place */}
              {filteredLeaderboard.length > 1 && (!searchQuery || filteredLeaderboard.some(c => c.rank === 2)) && (
                <div className="md:order-1 order-2">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-400/10 to-transparent rounded-bl-full" />
                    <div className="relative z-10">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className={`w-16 h-16 rounded-full ${filteredLeaderboard[1].avatarColor} flex items-center justify-center mb-2`}>
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute -top-2 -right-2">
                            {getMedalIcon(2)}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-gilroy-extrabold text-center mb-2 text-black">{filteredLeaderboard[1].name}</h3>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-gilroy-black text-[#7bc74d]">
                          {filteredLeaderboard[1].points.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <span>{filteredLeaderboard[1].visits} visits</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {filteredLeaderboard.length > 0 && (!searchQuery || filteredLeaderboard.some(c => c.rank === 1)) && (
                <div className="md:order-2 order-1">
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-yellow-400 relative overflow-hidden transform md:scale-105">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-bl-full" />
                    <div className="relative z-10">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className={`w-20 h-20 rounded-full ${filteredLeaderboard[0].avatarColor} flex items-center justify-center mb-2`}>
                            <User className="w-10 h-10 text-white" />
                          </div>
                          <div className="absolute -top-4 -right-4 animate-pulse">
                            {getMedalIcon(1)}
                          </div>
                        </div>
                      </div>
                      <div className={`${getBadgeColor(filteredLeaderboard[0].badge)} text-xs font-semibold px-3 py-1 rounded-full w-fit mx-auto mb-3`}>
                        {filteredLeaderboard[0].badge} Member
                      </div>
                      <h3 className="text-2xl font-gilroy-black text-center mb-2 text-black">{filteredLeaderboard[0].name}</h3>
                      <div className="text-center mb-4">
                        <div className="text-4xl font-gilroy-black text-[#7bc74d]">
                          {filteredLeaderboard[0].points.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <span>{filteredLeaderboard[0].visits} visits</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {filteredLeaderboard.length > 2 && (!searchQuery || filteredLeaderboard.some(c => c.rank === 3)) && (
                <div className="md:order-3 order-3">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full" />
                    <div className="relative z-10">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className={`w-16 h-16 rounded-full ${filteredLeaderboard[2].avatarColor} flex items-center justify-center mb-2`}>
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute -top-2 -right-2">
                            {getMedalIcon(3)}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-gilroy-extrabold text-center mb-2 text-black">{filteredLeaderboard[2].name}</h3>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-gilroy-black text-[#7bc74d]">
                          {filteredLeaderboard[2].points.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <span>{filteredLeaderboard[2].visits} visits</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rest of Leaderboard */}
          {!isLoading && (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Rank</th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Customer</th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Points</th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Visits</th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Badge</th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Last Visit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredLeaderboard.slice(searchQuery ? 0 : 3).map((customer) => (
                        <tr key={customer.id || customer.rank} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getMedalIcon(customer.rank)}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full ${customer.avatarColor} flex items-center justify-center mr-3 flex-shrink-0`}>
                                <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-gilroy-extrabold text-gray-900">{customer.name}</div>
                                <div className="text-xs text-gray-500">Joined {customer.joinedDate}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-base lg:text-lg font-gilroy-black text-[#7bc74d]">{customer.points.toLocaleString()}</div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{customer.visits} times</div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span className={`${getBadgeColor(customer.badge)} text-xs font-semibold px-2 lg:px-3 py-1 rounded-full`}>
                              {customer.badge}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {customer.lastVisit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredLeaderboard.slice(searchQuery ? 0 : 3).map((customer) => (
                  <div key={customer.id || customer.rank} className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {getMedalIcon(customer.rank)}
                        </div>
                        <div className={`w-12 h-12 rounded-full ${customer.avatarColor} flex items-center justify-center flex-shrink-0`}>
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-gilroy-extrabold text-gray-900 truncate">{customer.name}</div>
                          <div className="text-xs text-gray-500">Joined {customer.joinedDate}</div>
                        </div>
                      </div>
                      <span className={`${getBadgeColor(customer.badge)} text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0`}>
                        {customer.badge}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-lg font-gilroy-black text-[#7bc74d]">{customer.points.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Points</div>
                      </div>
                      <div>
                        <div className="text-lg font-gilroy-black text-gray-900">{customer.visits}</div>
                        <div className="text-xs text-gray-600">Visits</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.lastVisit}</div>
                        <div className="text-xs text-gray-600">Last Visit</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* No Results */}
          {!isLoading && filteredLeaderboard.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="mb-4 flex justify-center">
                <Search className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-gilroy-extrabold text-black mb-2">No customers found</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">Try adjusting your search criteria</p>
              <button
                onClick={() => setSearchQuery("")}
                className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm sm:text-base"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Current User Position */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-lg sm:text-xl font-gilroy-black text-black mb-4">Your Position</h3>
            {!authUser?.user?.id ? (
              /* Not Logged In */
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-2 border-blue-200 p-6 sm:p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 rounded-full p-4 mb-4">
                    <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-gilroy-extrabold text-gray-900 mb-2">
                    Login to see your position
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md">
                    Sign in to check your ranking on the leaderboard and track your points at {businessData?.name || "this business"}!
                  </p>
                  <Link href="/auth?mode=user">
                    <button className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Login to Your Account
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                  <p className="text-xs text-gray-500 mt-4">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth?mode=user" className="text-[#7bc74d] hover:text-[#6ab63d] font-semibold">
                      Register now
                    </Link>
                  </p>
                </div>
              </div>
            ) : isLoadingPosition ? (
              <div className="bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-2 border-[#7bc74d] p-4 sm:p-6">
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-white" />
                  <span className="ml-3 text-white text-sm sm:text-base">Loading your position...</span>
                </div>
              </div>
            ) : isNotCustomer ? (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-2 border-orange-200 p-6 sm:p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-orange-100 rounded-full p-4 mb-4">
                    <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-gilroy-extrabold text-gray-900 mb-2">
                    You are not a customer for this business
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-md">
                    Visit {businessData?.name || "this business"} and make a purchase to join the leaderboard and start earning points!
                  </p>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span>Start earning points by visiting the business</span>
                  </div>
                </div>
              </div>
            ) : userPosition ? (
                <div className="bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-2 border-[#7bc74d]">
                  <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 mr-3 sm:mr-4 flex-shrink-0">
                          <div className="text-2xl sm:text-3xl font-gilroy-black text-white">#{userPosition.position}</div>
                        </div>
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                            <User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                          </div>
                          <div className="text-white min-w-0">
                            <div className="text-base sm:text-lg md:text-xl font-gilroy-extrabold mb-1 truncate">
                              {authUser.user.name || "You"}
                            </div>
                            <div className="text-xs sm:text-sm opacity-90">
                              Joined {new Date(userPosition.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 sm:gap-4 md:gap-6 text-white w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-gilroy-black">{userPosition.total_points.toLocaleString()}</div>
                          <div className="text-xs sm:text-sm opacity-90">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-gilroy-black">{userPosition.total_visits}</div>
                          <div className="text-xs sm:text-sm opacity-90">Visits</div>
                        </div>
                        <div className="text-center">
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full block mb-1">
                            {getBadge(userPosition.total_points)}
                          </span>
                          <div className="text-xs sm:text-sm opacity-90">Badge</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress to Next Rank */}
                    {userPosition.position > 1 && filteredLeaderboard.length > 0 && (
                      <div className="mt-4 sm:mt-6 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
                        {(() => {
                          const nextRankCustomer = filteredLeaderboard.find(c => c.rank === userPosition.position - 1);
                          const pointsNeeded = nextRankCustomer 
                            ? nextRankCustomer.points - userPosition.total_points 
                            : 0;
                          const progressPercent = nextRankCustomer && nextRankCustomer.points > userPosition.total_points
                            ? Math.min(100, ((userPosition.total_points / nextRankCustomer.points) * 100))
                            : 100;
                          
                          return (
                            <>
                              <div className="flex items-center justify-between mb-2 text-white">
                                <span className="text-sm font-semibold">Progress to Rank #{userPosition.position - 1}</span>
                                {pointsNeeded > 0 && (
                                  <span className="text-sm">{pointsNeeded} points to go</span>
                                )}
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                <div 
                                  className="bg-white h-full rounded-full transition-all duration-500"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              {pointsNeeded > 0 && (
                                <div className="mt-2 text-xs text-white/80">
                                  You need {pointsNeeded} more points to move up to rank #{userPosition.position - 1}. Keep visiting to earn more!
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* Quick Stats Comparison */}
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {(() => {
                        const top10Customer = filteredLeaderboard.find(c => c.rank === 10);
                        const pointsToTop10 = top10Customer 
                          ? Math.max(0, top10Customer.points - userPosition.total_points)
                          : 0;
                        const lastVisitDays = userPosition.last_visit_at
                          ? Math.floor((new Date().getTime() - new Date(userPosition.last_visit_at).getTime()) / (1000 * 60 * 60 * 24))
                          : 0;
                        
                        return (
                          <>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                              <div className="text-xs text-white/80 mb-1">Points to Top 10</div>
                              <div className="text-2xl font-gilroy-black text-white">{pointsToTop10.toLocaleString()}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                              <div className="text-xs text-white/80 mb-1">Last Visit</div>
                              <div className="text-2xl font-gilroy-black text-white">
                                {lastVisitDays === 0 ? "Today" : lastVisitDays === 1 ? "1 day" : `${lastVisitDays} days`}
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                              <div className="text-xs text-white/80 mb-1">Total Points</div>
                              <div className="text-2xl font-gilroy-black text-white">{userPosition.total_points.toLocaleString()}</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : null}
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start">
              <div className="bg-blue-500 rounded-full p-3 mr-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-gilroy-extrabold text-gray-900 mb-2">How to Earn More Points</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Visit regularly and earn points with every purchase</li>
                  <li>• Climb the leaderboard and unlock exclusive perks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


