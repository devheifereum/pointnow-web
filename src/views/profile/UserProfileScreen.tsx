"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth/store";
// import { useRouter } from "next/navigation";
import { User, MapPin, Phone, Mail, Trophy, Store, Gift, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { customersApi } from "@/lib/api/customers";
import { ApiClientError } from "@/lib/api/client";


interface UserProfileScreenProps {
  userId: string;
}

export default function UserProfileScreen({ userId }: UserProfileScreenProps) {
  // const router = useRouter();
  const { user: authUser, isAuthenticated } = useAuthStore();
  const [profileData, setProfileData] = useState<{
    user: {
      id: string;
      email: string;
      name: string;
      phone_number: string;
    };
    totalPoints: number;
    totalVisits: number;
    totalBusinesses: number;
    restaurantConnections: Array<{
      businessId: string;
      businessName: string;
      points: number;
      visits: number;
      lastVisit: string;
    }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await customersApi.getUserProfile(userId);
      
      const restaurantConnections = response.data.customer_businesses.map((cb) => ({
        businessId: cb.business.id,
        businessName: cb.business.name,
        points: cb.total_points,
        visits: cb.total_visits,
        lastVisit: cb.last_visit_at,
      }));

      setProfileData({
        user: response.data.user,
        totalPoints: response.data.metadata.total_points,
        totalVisits: response.data.metadata.total_visits,
        totalBusinesses: response.data.metadata.total_businesses,
        restaurantConnections,
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "Failed to load profile data");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Disable auth check for UI development
    loadProfileData();
    
    // Original auth code (commented out for UI development)
    /*
    if (!isAuthenticated || !authUser) {
      router.push("/auth");
      return;
    }

    // Verify user ID matches
    if (authUser.user.id !== userId) {
      router.push("/home");
      return;
    }

    loadProfileData();
    */
  }, [userId, loadProfileData]);

  // Mock user data for UI development when not authenticated
  const mockUser = {
    id: userId,
    email: "user@example.com",
    name: "John Doe",
    phone_number: "+1 234-567-8900",
  };

  const user = profileData?.user || authUser?.user || mockUser;
  const restaurantConnections = profileData?.restaurantConnections || [];
  const totalPoints = profileData?.totalPoints || 0;

  if (!isAuthenticated || !authUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-gilroy-black text-black mb-2">My Profile</h1>
            <p className="text-gray-600">View your points and business connections</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-500">Loading profile...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <>
              {/* User Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-gilroy-black text-black mb-2">
                      {user.name || user.email.split("@")[0]}
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      {user.phone_number && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{user.phone_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Points</p>
                      <p className="text-3xl font-gilroy-black text-black">{totalPoints.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl flex items-center justify-center">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Businesses</p>
                      <p className="text-3xl font-gilroy-black text-black">{profileData?.totalBusinesses || restaurantConnections.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Visits</p>
                      <p className="text-3xl font-gilroy-black text-black">
                        {profileData?.totalVisits || restaurantConnections.reduce((sum, conn) => sum + conn.visits, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Connections */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-gilroy-black text-black flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-[#7bc74d]" />
                    Business Connections
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Points you&apos;ve earned at each business
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  {restaurantConnections.length > 0 ? (
                    restaurantConnections.map((connection) => {
                      // Convert business name to URL-friendly slug
                      const restaurantSlug = connection.businessName
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "");
                      const leaderboardUrl = `/leaderboard/${encodeURIComponent(restaurantSlug)}`;
                      
                      return (
                        <Link
                          key={connection.businessId}
                          href={leaderboardUrl}
                          className="block p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl flex items-center justify-center flex-shrink-0">
                                <Store className="w-8 h-8 text-white" />
                              </div>
                              <div>
                                <h4 className="text-xl font-gilroy-extrabold text-black mb-1">
                                  {connection.businessName}
                                </h4>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Trophy className="w-4 h-4" />
                                    {connection.visits} visits
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    Last visit: {new Date(connection.lastVisit).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 mb-1">Points</p>
                              <p className="text-3xl font-gilroy-black text-[#7bc74d]">
                                {connection.points.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="p-12 text-center">
                      <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg font-medium">No business connections yet</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Start earning points by visiting businesses!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-gilroy-black text-black mb-2">My Profile</h1>
          <p className="text-gray-600">View your points and business connections</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">Loading profile...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {/* User Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-gilroy-black text-black mb-2">
                    {user.name || user.email.split("@")[0]}
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    {user.phone_number && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{user.phone_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Points</p>
                    <p className="text-3xl font-gilroy-black text-black">{totalPoints.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Businesses</p>
                    <p className="text-3xl font-gilroy-black text-black">{restaurantConnections.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Visits</p>
                      <p className="text-3xl font-gilroy-black text-black">
                        {profileData?.totalVisits || restaurantConnections.reduce((sum, conn) => sum + conn.visits, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            {/* Business Connections */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-gilroy-black text-black flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-[#7bc74d]" />
                  Business Connections
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Points you&apos;ve earned at each business
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {restaurantConnections.length > 0 ? (
                  restaurantConnections.map((connection) => {
                    // Convert business name to URL-friendly slug
                    const restaurantSlug = connection.businessName
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "");
                    const leaderboardUrl = `/leaderboard/${encodeURIComponent(restaurantSlug)}`;
                    
                    return (
                      <Link
                        key={connection.businessId}
                        href={leaderboardUrl}
                        className="block p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl flex items-center justify-center flex-shrink-0">
                              <Store className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-gilroy-extrabold text-black mb-1">
                                {connection.businessName}
                              </h4>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Trophy className="w-4 h-4" />
                                  {connection.visits} visits
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  Last visit: {new Date(connection.lastVisit).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Points</p>
                            <p className="text-3xl font-gilroy-black text-[#7bc74d]">
                              {connection.points.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="p-12 text-center">
                    <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No business connections yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Start earning points by visiting businesses!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

