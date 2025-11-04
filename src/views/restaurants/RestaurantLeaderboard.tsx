"use client";

import React, { useState } from "react";
import { Trophy, Medal, Award, Crown, Search, Calendar, TrendingUp } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  phone: string;
  points: number;
  visits: number;
  joinedDate: string;
  lastVisit: string;
  badge: string;
  avatar: string;
}

interface RestaurantLeaderboardProps {
  restaurantName?: string;
}

export default function RestaurantLeaderboard({ restaurantName }: RestaurantLeaderboardProps) {
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      name: "Sarah Johnson",
      phone: "+1 234-567-8900",
      points: 15840,
      visits: 89,
      joinedDate: "Jan 2024",
      lastVisit: "2 days ago",
      badge: "Diamond",
      avatar: "👩",
    },
    {
      rank: 2,
      name: "Michael Chen",
      phone: "+1 234-567-8901",
      points: 14250,
      visits: 76,
      joinedDate: "Dec 2023",
      lastVisit: "1 day ago",
      badge: "Diamond",
      avatar: "👨",
    },
    {
      rank: 3,
      name: "Emma Williams",
      phone: "+1 234-567-8902",
      points: 12890,
      visits: 68,
      joinedDate: "Feb 2024",
      lastVisit: "Today",
      badge: "Platinum",
      avatar: "👩‍🦰",
    },
    {
      rank: 4,
      name: "James Anderson",
      phone: "+1 234-567-8903",
      points: 11560,
      visits: 62,
      joinedDate: "Mar 2024",
      lastVisit: "5 hours ago",
      badge: "Platinum",
      avatar: "🧔",
    },
    {
      rank: 5,
      name: "Olivia Martinez",
      phone: "+1 234-567-8904",
      points: 10240,
      visits: 54,
      joinedDate: "Jan 2024",
      lastVisit: "Yesterday",
      badge: "Platinum",
      avatar: "👱‍♀️",
    },
    {
      rank: 6,
      name: "David Lee",
      phone: "+1 234-567-8905",
      points: 9875,
      visits: 51,
      joinedDate: "Apr 2024",
      lastVisit: "3 days ago",
      badge: "Gold",
      avatar: "👨‍💼",
    },
    {
      rank: 7,
      name: "Sophia Taylor",
      phone: "+1 234-567-8906",
      points: 9120,
      visits: 48,
      joinedDate: "May 2024",
      lastVisit: "1 week ago",
      badge: "Gold",
      avatar: "👩‍💼",
    },
    {
      rank: 8,
      name: "William Brown",
      phone: "+1 234-567-8907",
      points: 8450,
      visits: 45,
      joinedDate: "Jun 2024",
      lastVisit: "2 days ago",
      badge: "Gold",
      avatar: "👨",
    },
  ];

  const filteredLeaderboard = leaderboardData.filter((entry) =>
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

          {/* Time Filter */}
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            {(["all", "month", "week"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                  timeFilter === filter
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {filter === "all" ? "All Time" : filter === "month" ? "This Month" : "This Week"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
              {filteredLeaderboard.map((entry) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-[#7bc74d]" />
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>
          <p className="text-2xl font-gilroy-black text-black">{filteredLeaderboard.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-[#7bc74d]" />
            <p className="text-sm text-gray-600">Total Points</p>
          </div>
          <p className="text-2xl font-gilroy-black text-[#7bc74d]">
            {filteredLeaderboard.reduce((sum, entry) => sum + entry.points, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-[#7bc74d]" />
            <p className="text-sm text-gray-600">Total Visits</p>
          </div>
          <p className="text-2xl font-gilroy-black text-black">
            {filteredLeaderboard.reduce((sum, entry) => sum + entry.visits, 0)}
          </p>
        </div>
      </div>
    </>
  );
}

