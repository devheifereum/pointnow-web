"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Award,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import { analyticsApi } from "@/lib/api/analytics";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { AnalyticsMetadata, TopCustomer, PointHistoricalDataPoint } from "@/lib/types/analytics";

interface RestaurantAnalyticsProps {
  restaurantName?: string;
}

export default function RestaurantAnalytics({ restaurantName }: RestaurantAnalyticsProps) {
  // restaurantName is available but not currently used
  void restaurantName;
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<AnalyticsMetadata | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [historicalData, setHistoricalData] = useState<PointHistoricalDataPoint[]>([]);

  // Date range state - default to last 30 days
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const businessId = user?.businessId || "";

  useEffect(() => {
    if (!businessId) {
      setError("Business ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, startDate, endDate]);

  const fetchAnalytics = async () => {
    if (!businessId) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = {
        business_id: businessId,
        start_date: startDate,
        end_date: endDate,
      };

      const [metadataRes, customersRes, historicalRes] = await Promise.all([
        analyticsApi.getMetadata({ business_id: businessId }),
        analyticsApi.getTopCustomers({ business_id: businessId }),
        analyticsApi.getPointHistoricalData(params),
      ]);

      setMetadata(metadataRes.data.metadata);
      setTopCustomers(customersRes.data.customers || []);
      setHistoricalData(historicalRes.data.historical_data || []);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "Failed to load analytics data");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Format metadata into stats cards
  const stats: Array<{
    label: string;
    value: string;
    change: string;
    changeType: "positive" | "negative" | "neutral";
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = [
    {
      label: "Total Customers",
      value: metadata?.total_customers?.toLocaleString() || "0",
      change: "+12%", // TODO: Calculate from historical data
      changeType: "positive",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Points",
      value: metadata?.total_points?.toLocaleString() || "0",
      change: "+18%", // TODO: Calculate from historical data
      changeType: "positive",
      icon: Award,
      color: "from-[#7bc74d] to-[#6ab63d]",
    },
    {
      label: "Active Customers",
      value: metadata?.total_active_customers?.toLocaleString() || "0",
      change: "+8%", // TODO: Calculate from historical data
      changeType: "positive",
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Recent Customer",
      value: metadata?.recent_customers?.name || "None",
      change: metadata?.recent_customers?.email || "",
      changeType: "neutral",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
    },
  ];


  return (
    <>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-gilroy-black text-black mb-2">Analytics & Insights</h1>
            <p className="text-xs sm:text-sm text-gray-600">Track your loyalty program performance</p>
          </div>
          
          {/* Date Range Picker */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] text-black"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] text-black"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#7bc74d]" />
          <span className="ml-3 text-gray-600">Loading analytics data...</span>
        </div>
      ) : (
        <>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${
                  stat.changeType === "positive" 
                    ? "text-green-600" 
                    : stat.changeType === "negative" 
                    ? "text-red-600" 
                    : "text-gray-600"
                }`}>
                  {stat.changeType === "positive" ? (
                    <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : stat.changeType === "negative" ? (
                    <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : null}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-gilroy-black text-black mb-1">{stat.value}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Top Customers */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-gilroy-black text-black">Top Customers</h2>
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {topCustomers.length > 0 ? (
              topCustomers.map((customer, index) => (
                <div key={customer.id || index} className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm sm:text-base text-black truncate">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.total_visits || 0} visits</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-base sm:text-lg font-gilroy-extrabold text-[#7bc74d]">{(customer.total_points || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No customer data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Points Historical Data */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <h2 className="text-lg sm:text-xl font-gilroy-black text-black mb-4 sm:mb-6">Points Historical Data</h2>
        {historicalData.length > 0 ? (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Count</th>
                    <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Total Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historicalData.map((dataPoint, index) => {
                    const date = new Date(dataPoint.date);
                    const formattedDate = date.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    });
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{formattedDate}</td>
                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 text-right">{dataPoint.count}</td>
                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-[#7bc74d] text-right">
                          {dataPoint.total_points.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="h-48 sm:h-64 flex items-center justify-center bg-gray-50 rounded-xl">
            <p className="text-sm sm:text-base text-gray-500 px-4 text-center">No historical data available for this period</p>
          </div>
        )}
      </div>
        </>
      )}
    </>
  );
}

