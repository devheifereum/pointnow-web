"use client";

import React, { useState } from "react";
import { Trophy, Medal, Award, Crown, TrendingUp, Calendar, Star, ChevronLeft, Search } from "lucide-react";
import { LightRays } from "@/components/ui/light-rays";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface LeaderboardScreenProps {
  restaurantName: string;
}

export default function LeaderboardScreen({ restaurantName }: LeaderboardScreenProps) {
  const [timeFilter, setTimeFilter] = useState<"all-time" | "monthly" | "weekly">("all-time");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock restaurant data based on the name
  const restaurantData = {
    name: restaurantName.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
    emoji: getRestaurantEmoji(restaurantName),
    totalMembers: 2847,
    totalPoints: 1284567,
    rayColor: getRestaurantColor(restaurantName),
  };

  // Mock leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah Johnson",
      points: 15840,
      visits: 89,
      joinedDate: "Jan 2024",
      lastVisit: "2 days ago",
      badge: "Diamond",
      avatar: "👩",
      trend: "+12%"
    },
    {
      rank: 2,
      name: "Michael Chen",
      points: 14250,
      visits: 76,
      joinedDate: "Dec 2023",
      lastVisit: "1 day ago",
      badge: "Diamond",
      avatar: "👨",
      trend: "+8%"
    },
    {
      rank: 3,
      name: "Emma Williams",
      points: 12890,
      visits: 68,
      joinedDate: "Feb 2024",
      lastVisit: "Today",
      badge: "Platinum",
      avatar: "👩‍🦰",
      trend: "+15%"
    },
    {
      rank: 4,
      name: "James Anderson",
      points: 11560,
      visits: 62,
      joinedDate: "Mar 2024",
      lastVisit: "5 hours ago",
      badge: "Platinum",
      avatar: "🧔",
      trend: "+10%"
    },
    {
      rank: 5,
      name: "Olivia Martinez",
      points: 10240,
      visits: 54,
      joinedDate: "Jan 2024",
      lastVisit: "Yesterday",
      badge: "Platinum",
      avatar: "👱‍♀️",
      trend: "+6%"
    },
    {
      rank: 6,
      name: "David Lee",
      points: 9875,
      visits: 51,
      joinedDate: "Apr 2024",
      lastVisit: "3 days ago",
      badge: "Gold",
      avatar: "👨‍💼",
      trend: "+9%"
    },
    {
      rank: 7,
      name: "Sophia Taylor",
      points: 9120,
      visits: 48,
      joinedDate: "Feb 2024",
      lastVisit: "1 week ago",
      badge: "Gold",
      avatar: "👩‍💻",
      trend: "+7%"
    },
    {
      rank: 8,
      name: "Daniel Brown",
      points: 8560,
      visits: 45,
      joinedDate: "Mar 2024",
      lastVisit: "4 days ago",
      badge: "Gold",
      avatar: "👨‍🎓",
      trend: "+5%"
    },
    {
      rank: 9,
      name: "Ava Garcia",
      points: 7940,
      visits: 42,
      joinedDate: "May 2024",
      lastVisit: "Today",
      badge: "Gold",
      avatar: "👩‍🔬",
      trend: "+11%"
    },
    {
      rank: 10,
      name: "William Davis",
      points: 7320,
      visits: 39,
      joinedDate: "Jan 2024",
      lastVisit: "2 days ago",
      badge: "Silver",
      avatar: "👨‍⚕️",
      trend: "+4%"
    }
  ];

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
  const filteredLeaderboard = leaderboardData.filter((customer) => {
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
            href="/restaurants"
            className="inline-flex items-center text-gray-600 hover:text-[#7bc74d] transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Restaurants
          </Link>

          {/* Restaurant Header */}
          <div className="relative bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] rounded-3xl p-8 mb-8 overflow-hidden">
            <LightRays
              count={8}
              color="rgba(255, 255, 255, 0.2)"
              blur={30}
              speed={8}
              length="90%"
              className="absolute inset-0"
            />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-6 md:mb-0">
                <div className="text-6xl mr-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  {restaurantData.emoji}
                </div>
                <div className="text-white">
                  <h1 className="text-4xl font-gilroy-black mb-2">{restaurantData.name}</h1>
                  <p className="text-xl opacity-90">Points Leaderboard</p>
                </div>
              </div>
              
              <div className="flex gap-6 text-white text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[120px]">
                  <div className="text-3xl font-gilroy-black">{restaurantData.totalMembers.toLocaleString()}</div>
                  <div className="text-sm opacity-90">Total Members</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[120px]">
                  <div className="text-3xl font-gilroy-black">{(restaurantData.totalPoints / 1000).toFixed(0)}K</div>
                  <div className="text-sm opacity-90">Points Earned</div>
                </div>
              </div>
            </div>
          </div>

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

          {/* Top 3 Podium - Only show when no search or when top 3 are in results */}
          {(!searchQuery || filteredLeaderboard.some(c => c.rank <= 3)) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* 2nd Place */}
              {(!searchQuery || filteredLeaderboard.some(c => c.rank === 2)) && (
                <div className="md:order-1 order-2">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-400/10 to-transparent rounded-bl-full" />
                    <div className="relative z-10">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="text-5xl mb-2">{leaderboardData[1].avatar}</div>
                          <div className="absolute -top-2 -right-2">
                            {getMedalIcon(2)}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-gilroy-extrabold text-center mb-2 text-black">{leaderboardData[1].name}</h3>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-gilroy-black text-[#7bc74d]">
                          {leaderboardData[1].points.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <span>{leaderboardData[1].visits} visits</span>
                        <span>•</span>
                        <span className="flex items-center text-green-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {leaderboardData[1].trend}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {(!searchQuery || filteredLeaderboard.some(c => c.rank === 1)) && (
                <div className="md:order-2 order-1">
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-yellow-400 relative overflow-hidden transform md:scale-105">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-bl-full" />
                    <div className="relative z-10">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="text-6xl mb-2">{leaderboardData[0].avatar}</div>
                          <div className="absolute -top-4 -right-4 animate-pulse">
                            {getMedalIcon(1)}
                          </div>
                        </div>
                      </div>
                      <div className={`${getBadgeColor(leaderboardData[0].badge)} text-xs font-semibold px-3 py-1 rounded-full w-fit mx-auto mb-3`}>
                        {leaderboardData[0].badge} Member
                      </div>
                      <h3 className="text-2xl font-gilroy-black text-center mb-2 text-black">{leaderboardData[0].name}</h3>
                      <div className="text-center mb-4">
                        <div className="text-4xl font-gilroy-black text-[#7bc74d]">
                          {leaderboardData[0].points.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <span>{leaderboardData[0].visits} visits</span>
                        <span>•</span>
                        <span className="flex items-center text-green-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {leaderboardData[0].trend}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {(!searchQuery || filteredLeaderboard.some(c => c.rank === 3)) && (
                <div className="md:order-3 order-3">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full" />
                    <div className="relative z-10">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="text-5xl mb-2">{leaderboardData[2].avatar}</div>
                          <div className="absolute -top-2 -right-2">
                            {getMedalIcon(3)}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-gilroy-extrabold text-center mb-2 text-black">{leaderboardData[2].name}</h3>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-gilroy-black text-[#7bc74d]">
                          {leaderboardData[2].points.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <span>{leaderboardData[2].visits} visits</span>
                        <span>•</span>
                        <span className="flex items-center text-green-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {leaderboardData[2].trend}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rest of Leaderboard */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Visits</th>
                    <th className="px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Badge</th>
                    <th className="px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Trend</th>
                    <th className="px-6 py-4 text-left text-xs font-gilroy-extrabold text-gray-700 uppercase tracking-wider">Last Visit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeaderboard.slice(searchQuery ? 0 : 3).map((customer) => (
                    <tr key={customer.rank} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getMedalIcon(customer.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-3xl mr-3">{customer.avatar}</div>
                          <div>
                            <div className="text-sm font-gilroy-extrabold text-gray-900">{customer.name}</div>
                            <div className="text-xs text-gray-500">Joined {customer.joinedDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-gilroy-black text-[#7bc74d]">{customer.points.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.visits} times</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${getBadgeColor(customer.badge)} text-xs font-semibold px-3 py-1 rounded-full`}>
                          {customer.badge}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-green-600 text-sm font-semibold">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {customer.trend}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {customer.lastVisit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* No Results */}
            {filteredLeaderboard.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-gilroy-extrabold text-black mb-2">No customers found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* Current User Position */}
          <div className="mt-8">
            <h3 className="text-xl font-gilroy-black text-black mb-4">Your Position</h3>
            <div className="bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] rounded-2xl shadow-lg overflow-hidden border-2 border-[#7bc74d]">
              <div className="bg-white/10 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mr-4">
                      <div className="text-3xl font-gilroy-black text-white">#48</div>
                    </div>
                    <div className="flex items-center flex-1">
                      <div className="text-5xl mr-4">👤</div>
                      <div className="text-white">
                        <div className="text-xl font-gilroy-extrabold mb-1">You (Current User)</div>
                        <div className="text-sm opacity-90">Joined Mar 2024</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 text-white">
                    <div className="text-center">
                      <div className="text-3xl font-gilroy-black">3,450</div>
                      <div className="text-sm opacity-90">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-gilroy-black">28</div>
                      <div className="text-sm opacity-90">Visits</div>
                    </div>
                    <div className="text-center">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Silver
                      </span>
                      <div className="text-sm opacity-90 mt-1">Badge</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center text-2xl font-gilroy-black">
                        <TrendingUp className="w-5 h-5 mr-1" />
                        +8%
                      </div>
                      <div className="text-sm opacity-90">Trend</div>
                    </div>
                  </div>
                </div>
                
                {/* Progress to Next Rank */}
                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2 text-white">
                    <span className="text-sm font-semibold">Progress to Rank #47</span>
                    <span className="text-sm">120 points to go</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: '75%' }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-white/80">
                    You need 120 more points to move up to rank #47. Keep visiting to earn more!
                  </div>
                </div>

                {/* Quick Stats Comparison */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-xs text-white/80 mb-1">Points to Top 10</div>
                    <div className="text-2xl font-gilroy-black text-white">3,870</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-xs text-white/80 mb-1">Last Visit</div>
                    <div className="text-2xl font-gilroy-black text-white">3 days</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-xs text-white/80 mb-1">Next Reward</div>
                    <div className="text-2xl font-gilroy-black text-white">550 pts</div>
                  </div>
                </div>
              </div>
            </div>
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
                  <li>• Refer friends to earn bonus points</li>
                  <li>• Complete special challenges for extra rewards</li>
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

// Helper functions
function getRestaurantEmoji(slug: string): string {
  const emojiMap: { [key: string]: string } = {
    "bella-vista": "🍝",
    "sakura-sushi": "🍣",
    "spice-garden": "🍛",
    "burger-palace": "🍔",
    "le-petit-cafe": "🥐",
    "taco-fiesta": "🌮",
    "golden-dragon": "🥢",
    "mediterranean-breeze": "🫒",
    "steakhouse-prime": "🥩",
    "thai-garden": "🍜",
    "pizza-corner": "🍕",
    "sushi-master": "🍱",
  };
  return emojiMap[slug] || "🍽️";
}

function getRestaurantColor(slug: string): string {
  const colorMap: { [key: string]: string } = {
    "bella-vista": "rgba(123, 199, 77, 0.4)",
    "sakura-sushi": "rgba(59, 130, 246, 0.4)",
    "spice-garden": "rgba(245, 158, 11, 0.4)",
    "burger-palace": "rgba(239, 68, 68, 0.4)",
    "le-petit-cafe": "rgba(168, 85, 247, 0.4)",
    "taco-fiesta": "rgba(34, 197, 94, 0.4)",
    "golden-dragon": "rgba(220, 38, 127, 0.4)",
    "mediterranean-breeze": "rgba(34, 197, 94, 0.4)",
    "steakhouse-prime": "rgba(139, 69, 19, 0.4)",
    "thai-garden": "rgba(251, 146, 60, 0.4)",
    "pizza-corner": "rgba(34, 197, 94, 0.4)",
    "sushi-master": "rgba(59, 130, 246, 0.4)",
  };
  return colorMap[slug] || "rgba(123, 199, 77, 0.4)";
}

