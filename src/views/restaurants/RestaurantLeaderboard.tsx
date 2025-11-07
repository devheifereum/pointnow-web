"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, Crown, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { customersApi } from "@/lib/api/customers";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { Customer, LeaderboardMetadata } from "@/lib/types/customers";

interface RestaurantLeaderboardProps {
  restaurantName?: string;
}

export default function RestaurantLeaderboard({ restaurantName: _restaurantName }: RestaurantLeaderboardProps) {
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
      const response = await customersApi.getAll({
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
    
    // Calculate last visit (if available)
    const lastVisit = customer.last_visit
      ? new Date(customer.last_visit).toLocaleDateString()
      : "Never";

    // Determine badge based on points (you can customize this logic)
    const points = customer.points || 0;
    let badge = "Bronze";
    if (points >= 10000) badge = "Diamond";
    else if (points >= 5000) badge = "Platinum";
    else if (points >= 2000) badge = "Gold";
    else if (points >= 1000) badge = "Silver";

    return {
      rank,
      name: customer.name || "Unknown Customer",
      phone: customer.phone_number || "-",
      points: points,
      visits: customer.visits || 0,
      joinedDate,
      lastVisit,
      badge,
      avatar: "👤", // Default avatar, you can customize based on customer data
    };
  };

  const filteredCustomers = customers
    .map((customer, index) => formatCustomer(customer, index))
    .filter((entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.phone.includes(searchQuery)
    );


  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
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
      <div className="mb-6">
        <h1 className="text-3xl font-gilroy-black text-black mb-2">Customer Leaderboard</h1>
        <p className="text-gray-600">View top customers by points</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#7bc74d]" />
            <span className="ml-3 text-gray-600">Loading customers...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Visits
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Badge
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Last Visit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((entry) => (
                      <tr key={entry.rank} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getMedalIcon(entry.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-3xl mr-3">{entry.avatar}</div>
                            <div>
                              <div className="text-sm font-gilroy-extrabold text-black">{entry.name}</div>
                              <div className="text-xs text-gray-500">{entry.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-gilroy-black text-[#7bc74d]">{entry.points.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{entry.visits} times</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`${getBadgeColor(entry.badge)} text-xs font-semibold px-3 py-1 rounded-full`}>
                            {entry.badge}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} total)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.has_previous}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-black">
                    Page {pagination.page}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.has_next}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-[#7bc74d]" />
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>
          <p className="text-2xl font-gilroy-black text-black">
            {metadata?.total_customers?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-[#7bc74d]" />
            <p className="text-sm text-gray-600">Total Points</p>
          </div>
          <p className="text-2xl font-gilroy-black text-[#7bc74d]">
            {metadata?.total_points?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-[#7bc74d]" />
            <p className="text-sm text-gray-600">Total Visits</p>
          </div>
          <p className="text-2xl font-gilroy-black text-black">
            {metadata?.total_visits?.toLocaleString() || "0"}
          </p>
        </div>
      </div>
    </>
  );
}

