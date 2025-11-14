"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth/store";
// import { useRouter } from "next/navigation";
import { User, MapPin, Phone, Mail, Trophy, Store, Gift, TrendingUp, Edit2, Lock, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { customersApi } from "@/lib/api/customers";
import { usersApi } from "@/lib/api/users";
import { ApiClientError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";


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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

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

  const handleOpenEditDialog = () => {
    const currentUser = profileData?.user || authUser?.user || mockUser;
    setEditName(currentUser.name || "");
    setIsEditDialogOpen(true);
  };

  const handleUpdateName = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const currentUser = profileData?.user || authUser?.user || mockUser;
    if (editName.trim() === currentUser.name) {
      setIsEditDialogOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      const response = await usersApi.updateUser(userId, { name: editName.trim() });
      
      // Update local state
      if (profileData) {
        setProfileData({
          ...profileData,
          user: {
            ...profileData.user,
            name: response.data.user.name,
          },
        });
      }

      // Reload profile data to ensure consistency
      await loadProfileData();

      toast.success("Name updated successfully!");
      setIsEditDialogOpen(false);
    } catch (err) {
      if (err instanceof ApiClientError) {
        toast.error(err.message || "Failed to update name");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenPasswordDialog = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordErrors({});
    setIsPasswordDialogOpen(true);
  };

  const validatePasswordForm = () => {
    const errors: typeof passwordErrors = {};

    if (!currentPassword.trim()) {
      errors.current = "Current password is required";
    }

    if (!newPassword.trim()) {
      errors.new = "New password is required";
    } else if (newPassword.length < 6) {
      errors.new = "New password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      errors.confirm = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      errors.confirm = "Passwords do not match";
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.new = "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await usersApi.updateUser(userId, { 
        password: newPassword,
        current_password: currentPassword 
      });
      
      toast.success("Password updated successfully!");
      setIsPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
    } catch (err) {
      if (err instanceof ApiClientError) {
        const errorMessage = err.message || "Failed to update password";
        if (errorMessage.toLowerCase().includes("current password") || errorMessage.toLowerCase().includes("incorrect")) {
          setPasswordErrors({ current: "Current password is incorrect" });
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

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
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                      <h2 className="text-2xl font-gilroy-black text-black">
                      {user.name || user.email.split("@")[0]}
                    </h2>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button
                          onClick={handleOpenEditDialog}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit Name</span>
                        </Button>
                        <Button
                          onClick={handleOpenPasswordDialog}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Change Password</span>
                        </Button>
                      </div>
                    </div>
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

        {/* Edit Name Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Name</DialogTitle>
              <DialogDescription>
                Update your display name. This will be visible to businesses you connect with.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isUpdating) {
                      handleUpdateName();
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                  placeholder="Enter your name"
                  disabled={isUpdating}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isUpdating}
                className="w-full sm:w-auto text-white hover:text-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateName}
                disabled={isUpdating || !editName.trim()}
                className="w-full sm:w-auto bg-[#7bc74d] hover:bg-[#6ab63d] text-white"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new password. Make sure it&apos;s at least 6 characters long.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="current-password" className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (passwordErrors.current) {
                        setPasswordErrors({ ...passwordErrors, current: undefined });
                      }
                    }}
                    className={`w-full px-4 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black ${
                      passwordErrors.current ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter current password"
                    disabled={isUpdatingPassword}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isUpdatingPassword}
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.current && (
                  <p className="text-sm text-red-600">{passwordErrors.current}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordErrors.new) {
                        setPasswordErrors({ ...passwordErrors, new: undefined });
                      }
                      // Clear confirm error if passwords match
                      if (passwordErrors.confirm && e.target.value === confirmPassword) {
                        setPasswordErrors({ ...passwordErrors, confirm: undefined });
                      }
                    }}
                    className={`w-full px-4 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black ${
                      passwordErrors.new ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter new password"
                    disabled={isUpdatingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isUpdatingPassword}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.new && (
                  <p className="text-sm text-red-600">{passwordErrors.new}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordErrors.confirm) {
                        setPasswordErrors({ ...passwordErrors, confirm: undefined });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isUpdatingPassword) {
                        handleUpdatePassword();
                      }
                    }}
                    className={`w-full px-4 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black ${
                      passwordErrors.confirm ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Confirm new password"
                    disabled={isUpdatingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isUpdatingPassword}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.confirm && (
                  <p className="text-sm text-red-600">{passwordErrors.confirm}</p>
                )}
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsPasswordDialogOpen(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setShowCurrentPassword(false);
                  setShowNewPassword(false);
                  setShowConfirmPassword(false);
                  setPasswordErrors({});
                }}
                disabled={isUpdatingPassword}
                className="w-full sm:w-auto text-white hover:text-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
                className="w-full sm:w-auto bg-[#7bc74d] hover:bg-[#6ab63d] text-white"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                    <h2 className="text-2xl font-gilroy-black text-black">
                    {user.name || user.email.split("@")[0]}
                  </h2>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        onClick={handleOpenEditDialog}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Name</span>
                      </Button>
                      <Button
                        onClick={handleOpenPasswordDialog}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Change Password</span>
                      </Button>
                    </div>
                  </div>
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

        {/* Edit Name Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Name</DialogTitle>
              <DialogDescription>
                Update your display name. This will be visible to businesses you connect with.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isUpdating) {
                      handleUpdateName();
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                  placeholder="Enter your name"
                  disabled={isUpdating}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isUpdating}
                className="w-full sm:w-auto text-white hover:text-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateName}
                disabled={isUpdating || !editName.trim()}
                className="w-full sm:w-auto bg-[#7bc74d] hover:bg-[#6ab63d] text-white"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new password. Make sure it&apos;s at least 6 characters long.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="current-password" className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (passwordErrors.current) {
                        setPasswordErrors({ ...passwordErrors, current: undefined });
                      }
                    }}
                    className={`w-full px-4 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black ${
                      passwordErrors.current ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter current password"
                    disabled={isUpdatingPassword}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isUpdatingPassword}
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.current && (
                  <p className="text-sm text-red-600">{passwordErrors.current}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordErrors.new) {
                        setPasswordErrors({ ...passwordErrors, new: undefined });
                      }
                      // Clear confirm error if passwords match
                      if (passwordErrors.confirm && e.target.value === confirmPassword) {
                        setPasswordErrors({ ...passwordErrors, confirm: undefined });
                      }
                    }}
                    className={`w-full px-4 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black ${
                      passwordErrors.new ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter new password"
                    disabled={isUpdatingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isUpdatingPassword}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.new && (
                  <p className="text-sm text-red-600">{passwordErrors.new}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordErrors.confirm) {
                        setPasswordErrors({ ...passwordErrors, confirm: undefined });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isUpdatingPassword) {
                        handleUpdatePassword();
                      }
                    }}
                    className={`w-full px-4 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black ${
                      passwordErrors.confirm ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Confirm new password"
                    disabled={isUpdatingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isUpdatingPassword}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.confirm && (
                  <p className="text-sm text-red-600">{passwordErrors.confirm}</p>
                )}
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsPasswordDialogOpen(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setShowCurrentPassword(false);
                  setShowNewPassword(false);
                  setShowConfirmPassword(false);
                  setPasswordErrors({});
                }}
                disabled={isUpdatingPassword}
                className="w-full sm:w-auto text-white hover:text-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
                className="w-full sm:w-auto bg-[#7bc74d] hover:bg-[#6ab63d] text-white"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

