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

export default function RestaurantAnalytics({ restaurantName: _restaurantName }: RestaurantAnalyticsProps) {
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
        analyticsApi.getMetadata(params),
        analyticsApi.getTopCustomers(params),
        analyticsApi.getPointHistoricalData(params),
      ]);

      setMetadata(metadataRes.data);
      setTopCustomers(customersRes.data || []);
      setHistoricalData(historicalRes.data || []);
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
  const stats = [
    {
      label: "Total Customers",
      value: metadata?.total_customers?.toLocaleString() || "0",
      change: "+12%", // TODO: Calculate from historical data
      changeType: "positive" as const,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Points Issued",
      value: metadata?.total_points_issued?.toLocaleString() || "0",
      change: "+18%", // TODO: Calculate from historical data
      changeType: "positive" as const,
      icon: Award,
      color: "from-[#7bc74d] to-[#6ab63d]",
    },
    {
      label: "Points Redeemed",
      value: metadata?.points_redeemed?.toLocaleString() || "0",
      change: "+8%", // TODO: Calculate from historical data
      changeType: "positive" as const,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Active This Month",
      value: metadata?.active_this_month?.toLocaleString() || "0",
      change: "+5%", // TODO: Calculate from historical data
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
    },
  ];


  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-gilroy-black text-black mb-2">Analytics & Insights</h1>
            <p className="text-gray-600">Track your loyalty program performance</p>
          </div>
          
          {/* Date Range Picker */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] text-black"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] text-black"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.changeType === "positive" ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-gilroy-black text-black mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Top Customers */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-gilroy-black text-black">Top Customers</h2>
            <Award className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topCustomers.length > 0 ? (
              topCustomers.map((customer, index) => (
                <div key={customer.id || index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center text-white font-bold">
                      {customer.rank || index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-black">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.visits || 0} visits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-gilroy-extrabold text-[#7bc74d]">{(customer.points || 0).toLocaleString()}</p>
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

      {/* Points Historical Data Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-gilroy-black text-black mb-6">Points Historical Data</h2>
        {historicalData.length > 0 ? (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
            {/* TODO: Add chart library (e.g., recharts, chart.js) for visualization */}
            <div className="text-center">
              <p className="text-gray-500 mb-4">Chart visualization coming soon</p>
              <div className="text-sm text-gray-400">
                {historicalData.length} data points available
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
            <p className="text-gray-500">No historical data available for this period</p>
          </div>
        )}
      </div>
        </>
      )}
    </>
  );
}

