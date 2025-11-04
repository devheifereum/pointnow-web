"use client";

import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  Award,
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface RestaurantAnalyticsProps {
  restaurantName?: string;
}

export default function RestaurantAnalytics({ restaurantName }: RestaurantAnalyticsProps) {
  // Mock analytics data
  const stats = [
    {
      label: "Total Customers",
      value: "1,247",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Points Issued",
      value: "458,920",
      change: "+18%",
      changeType: "positive" as const,
      icon: Award,
      color: "from-[#7bc74d] to-[#6ab63d]",
    },
    {
      label: "Points Redeemed",
      value: "234,150",
      change: "+8%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Active This Month",
      value: "892",
      change: "+5%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const recentActivity = [
    { customer: "John Doe", action: "Earned 50 points", time: "2 minutes ago" },
    { customer: "Jane Smith", action: "Redeemed 100 points", time: "15 minutes ago" },
    { customer: "Mike Johnson", action: "Earned 25 points", time: "1 hour ago" },
    { customer: "Sarah Williams", action: "Earned 75 points", time: "2 hours ago" },
    { customer: "David Brown", action: "Redeemed 200 points", time: "3 hours ago" },
  ];

  const topCustomers = [
    { name: "Sarah Johnson", points: 15840, visits: 89 },
    { name: "Michael Chen", points: 14250, visits: 76 },
    { name: "Emma Williams", points: 12890, visits: 68 },
    { name: "James Anderson", points: 11560, visits: 62 },
    { name: "Olivia Martinez", points: 10240, visits: 54 },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-gilroy-black text-black mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Track your loyalty program performance</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-gilroy-black text-black">Recent Activity</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-black">{activity.customer}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-gilroy-black text-black">Top Customers</h2>
            <Award className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-black">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.visits} visits</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-gilroy-extrabold text-[#7bc74d]">{customer.points.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Points Distribution Chart Placeholder */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-gilroy-black text-black mb-6">Points Distribution (Last 30 Days)</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
          <p className="text-gray-500">Chart visualization coming soon</p>
        </div>
      </div>
    </>
  );
}

