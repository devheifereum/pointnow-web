"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Trophy, Medal, Award, Crown, Search, ChevronLeft, ChevronRight, Loader2, User } from "lucide-react";
import { customersApi } from "@/lib/api/customers";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { Customer, LeaderboardMetadata } from "@/lib/types/customers";

interface RestaurantLeaderboardProps {
  restaurantName?: string;
}

export default function RestaurantLeaderboard({ restaurantName }: RestaurantLeaderboardProps) {
  // restaurantName is available but not currently used
  void restaurantName;
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [metadata, setMetadata] = useState<LeaderboardMetadata | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });

  const businessId = user?.businessId || "";

  useEffect(() => {
    if (!businessId) {
      setError("Business ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    fetchMetadata();
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, pagination.page]);

  const fetchMetadata = async () => {
    if (!businessId) return;

    try {
      const response = await customersApi.getLeaderboardMetadata(businessId);
      setMetadata(response.data.metadata);
    } catch (err) {
      console.error("Failed to fetch metadata:", err);
    }
  };

  const fetchCustomers = async () => {
    if (!businessId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await customersApi.getLeaderboard({
        business_id: businessId,
        page: pagination.page,
        limit: pagination.limit,
      });

      setCustomers(response.data.customers || []);
      setPagination({
        page: response.data.metadata.page,
        limit: response.data.metadata.limit,
        total: response.data.metadata.total,
        total_pages: response.data.metadata.total_pages,
        has_next: response.data.metadata.has_next,
        has_previous: response.data.metadata.has_previous,
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "Failed to load customers");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Format customer for display
  const formatCustomer = (customer: Customer, index: number) => {
    const rank = (pagination.page - 1) * pagination.limit + index + 1;
    const joinedDate = customer.created_at
      ? new Date(customer.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "N/A";
    
    // Calculate last visit (if available) - use last_visit_at from leaderboard API
    const lastVisit = customer.last_visit_at
      ? new Date(customer.last_visit_at).toLocaleDateString("en-US", { 
          month: "short", 
          day: "numeric", 
          year: "numeric" 
        })
      : customer.last_visit
      ? new Date(customer.last_visit).toLocaleDateString("en-US", { 
          month: "short", 
          day: "numeric", 
          year: "numeric" 
        })
      : "Never";

    // Determine badge based on points - use total_points from leaderboard API
    const points = customer.total_points ?? customer.points ?? 0;
    let badge = "Bronze";
    if (points >= 10000) badge = "Diamond";
    else if (points >= 5000) badge = "Platinum";
    else if (points >= 2000) badge = "Gold";
    else if (points >= 1000) badge = "Silver";

    // Use total_visits from leaderboard API
    const visits = customer.total_visits ?? customer.visits ?? 0;

    // Get avatar color based on name
    const avatarColors = [
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
    const avatarColor = avatarColors[(customer.name || "").length % avatarColors.length];

    return {
      rank,
      name: customer.name || "Unknown Customer",
      phone: customer.phone_number || "-",
      points: points,
      visits: visits,
      joinedDate,
      lastVisit,
      badge,
      avatarColor,
    };
  };

  const filteredCustomers = customers
    .map((customer, index) => formatCustomer(customer, index))
    .filter((entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.phone.includes(searchQuery)
    );


  // Medal icon paths - Using local Flaticon images
  const medalIcons = {
    gold: "/medal-1.png", // 1st place - Gold medal
    silver: "/medal-2.png", // 2nd place - Silver medal
    bronze: "/medal-3.png", // 3rd place - Bronze medal
  };

  // Medal Icon Components using images from Flaticon
  const GoldMedalIcon = ({ size = 24 }: { size?: number }) => (
    <img
      src={medalIcons.gold}
      alt="Gold Medal - 1st Place"
      width={size}
      height={size}
      className="drop-shadow-lg"
      style={{ objectFit: 'contain' }}
    />
  );

  const SilverMedalIcon = ({ size = 24 }: { size?: number }) => (
    <img
      src={medalIcons.silver}
      alt="Silver Medal - 2nd Place"
      width={size}
      height={size}
      className="drop-shadow-lg"
      style={{ objectFit: 'contain' }}
    />
  );

  const BronzeMedalIcon = ({ size = 24 }: { size?: number }) => (
    <img
      src={medalIcons.bronze}
      alt="Bronze Medal - 3rd Place"
      width={size}
      height={size}
      className="drop-shadow-lg"
      style={{ objectFit: 'contain' }}
    />
  );

  const getMedalIcon = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="relative">
          <GoldMedalIcon size={24} />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="relative">
          <SilverMedalIcon size={24} />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="relative">
          <BronzeMedalIcon size={24} />
        </div>
      );
    }
    return <span className="text-gray-400 font-bold text-sm sm:text-base">#{rank}</span>;
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Diamond":
        return "bg-purple-100 text-purple-700";
      case "Platinum":
        return "bg-gray-100 text-gray-700";
      case "Gold":
        return "bg-yellow-100 text-yellow-700";
      case "Silver":
        return "bg-gray-200 text-gray-800";
      case "Bronze":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-gilroy-black text-black mb-2">Customer Leaderboard</h1>
        <p className="text-xs sm:text-sm text-gray-600">View top customers by points</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 sm:py-20">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-[#7bc74d]" />
            <span className="ml-3 text-sm sm:text-base text-gray-600">Loading customers...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Visits
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Badge
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Last Visit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((entry) => (
                        <tr key={entry.rank} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getMedalIcon(entry.rank)}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full ${entry.avatarColor} flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0`}>
                                <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-gilroy-extrabold text-black">{entry.name}</div>
                                <div className="text-xs text-gray-500">{entry.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <div className="text-base lg:text-lg font-gilroy-black text-[#7bc74d]">{entry.points.toLocaleString()}</div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{entry.visits} times</div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <span className={`${getBadgeColor(entry.badge)} text-xs font-semibold px-2 lg:px-3 py-1 rounded-full`}>
                              {entry.badge}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{entry.lastVisit}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No customers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 p-4">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((entry) => (
                  <div key={entry.rank} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {getMedalIcon(entry.rank)}
                        </div>
                        <div className={`w-10 h-10 rounded-full ${entry.avatarColor} flex items-center justify-center flex-shrink-0`}>
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-black truncate">{entry.name}</h3>
                          <p className="text-xs text-gray-600">{entry.phone}</p>
                        </div>
                      </div>
                      <span className={`${getBadgeColor(entry.badge)} text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ml-2`}>
                        {entry.badge}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Points:</span>
                        <span className="text-lg font-gilroy-black text-[#7bc74d]">{entry.points.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Visits:</span>
                        <span className="text-sm text-gray-900">{entry.visits} times</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Last Visit:</span>
                        <span className="text-sm text-gray-900">{entry.lastVisit}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No customers found
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} total)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.has_previous}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <span className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-black">
                    Page {pagination.page}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.has_next}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#7bc74d]" />
            <p className="text-xs sm:text-sm text-gray-600">Total Customers</p>
          </div>
          <p className="text-xl sm:text-2xl font-gilroy-black text-black">
            {metadata?.total_customers?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#7bc74d]" />
            <p className="text-xs sm:text-sm text-gray-600">Total Points</p>
          </div>
          <p className="text-xl sm:text-2xl font-gilroy-black text-[#7bc74d]">
            {metadata?.total_points?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#7bc74d]" />
            <p className="text-xs sm:text-sm text-gray-600">Total Visits</p>
          </div>
          <p className="text-xl sm:text-2xl font-gilroy-black text-black">
            {metadata?.total_visits?.toLocaleString() || "0"}
          </p>
        </div>
      </div>
    </>
  );
}

