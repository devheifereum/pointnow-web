"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Building2, Phone, MapPin, Eye, EyeOff } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Navbar from "@/components/Navbar";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";

export default function RestaurantAuthScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    ownerName: "",
    registrationNumber: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await authApi.login({
          email: formData.email,
          password: formData.password,
        });

        setAuth(response.data.user, response.data.backend_tokens);

        // Check if user is admin or staff
        const user = response.data.user;
        const isAdminOrStaff = user.admin || user.staff;

        if (isAdminOrStaff) {
          // Redirect to restaurant dashboard
          router.push("/my-restaurant/dashboard");
        } else {
          // If user logs in but is not admin/staff, redirect to home
          router.push("/home");
        }
      } else {
        // Register Business
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        if (!formData.latitude || !formData.longitude) {
          setError("Please provide latitude and longitude for your business location");
          setIsLoading(false);
          return;
        }

        const response = await authApi.registerBusiness({
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: "ADMIN",
          is_active: true,
          metadata: {},
          business: {
            name: formData.businessName,
            registration_number: formData.registrationNumber,
            description: formData.description,
            address: formData.address,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            metadata: {},
            is_active: true,
          },
        });

        setAuth(response.data.user, response.data.backend_tokens);
        
        // Redirect to restaurant dashboard
        router.push("/my-restaurant/dashboard");
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "An error occurred. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
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
        <Navbar />

        <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-6">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] px-2 sm:px-4 lg:px-6">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Left Side - Branding */}
                  <div className="relative bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] p-8 lg:p-12 xl:p-16 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-7xl mb-6">🍽️</div>
                      <h2 className="text-4xl font-gilroy-black mb-4">
                        {isLogin ? "Welcome Back!" : "Join PointNow"}
                      </h2>
                      <p className="text-xl opacity-90 mb-8">
                        {isLogin
                          ? "Sign in to manage your loyalty program and reward your customers."
                          : "Start rewarding your customers and grow your business with our powerful loyalty platform."}
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-left">
                          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-gilroy-extrabold text-sm">Unlimited Customers</h3>
                            <p className="text-xs opacity-90">Track and reward without limits</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-left">
                          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-gilroy-extrabold text-sm">Easy Setup</h3>
                            <p className="text-xs opacity-90">Get started in minutes</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-left">
                          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-gilroy-extrabold text-sm">24/7 Support</h3>
                            <p className="text-xs opacity-90">We&apos;re here when you need us</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Form */}
                  <div className="p-6 sm:p-8 lg:p-12 xl:p-16">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-gilroy-black text-black mb-2">
                        {isLogin ? "Login to Your Account" : "Create Your Account"}
                      </h1>
                      <p className="text-gray-600 text-sm">
                        {isLogin
                          ? "Enter your credentials to access your dashboard"
                          : "Get started with PointNow in just a few minutes"}
                      </p>
                    </div>
                    {/* Toggle */}
                    <div className="flex items-center justify-center mb-6 relative z-10">
                      <div className="bg-gray-100 rounded-xl p-1 inline-flex">
                        <button
                          type="button"
                          onClick={() => setIsLogin(true)}
                          className={`px-5 py-2 rounded-lg font-semibold transition-all text-sm cursor-pointer ${
                            isLogin
                              ? "bg-[#7bc74d] text-white shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          Login
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsLogin(false)}
                          className={`px-5 py-2 rounded-lg font-semibold transition-all text-sm cursor-pointer ${
                            !isLogin
                              ? "bg-[#7bc74d] text-white shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          Register
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                {!isLogin && (
                  <>
                    {/* Two-column grid for register fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                          Business Name *
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            id="businessName"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            required={!isLogin}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                            placeholder="Enter your business name"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="registrationNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                          Registration Number *
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            id="registrationNumber"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleInputChange}
                            required={!isLogin}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                            placeholder="e.g., SSM2003"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required={!isLogin}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                          Business Address *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required={!isLogin}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                            placeholder="Enter business address"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="latitude" className="block text-sm font-semibold text-gray-700 mb-2">
                          Latitude *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            step="any"
                            id="latitude"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleInputChange}
                            required={!isLogin}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                            placeholder="e.g., 39.0481"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="longitude" className="block text-sm font-semibold text-gray-700 mb-2">
                          Longitude *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            step="any"
                            id="longitude"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleInputChange}
                            required={!isLogin}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                            placeholder="e.g., -29.5238"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required={!isLogin}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                        placeholder="Describe your business..."
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div className="sm:col-span-1">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required={!isLogin}
                          className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-[#7bc74d] focus:ring-[#7bc74d]" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link href="#" className="text-sm text-[#7bc74d] hover:text-[#6ab63d] font-semibold">
                      Forgot password?
                    </Link>
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        required
                        className="mt-1 rounded border-gray-300 text-[#7bc74d] focus:ring-[#7bc74d]"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the{" "}
                        <Link href="#" className="text-[#7bc74d] hover:text-[#6ab63d] font-semibold">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="text-[#7bc74d] hover:text-[#6ab63d] font-semibold">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                  </div>
                )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors shadow-lg"
                    >
                      {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                    </button>
                    </form>

                    {/* Divider */}
                    <div className="my-5 flex items-center">
                      <div className="flex-1 border-t border-gray-200"></div>
                      <span className="px-4 text-sm text-gray-500">or</span>
                      <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Social Login */}
                    <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-5">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </button>

                    {/* Switch Mode */}
                    <div className="text-center space-y-2">
                      <p className="text-gray-600 text-sm">
                        {isLogin ? "Don&apos;t have an account? " : "Already have an account? "}
                        <button
                          type="button"
                          onClick={() => setIsLogin(!isLogin)}
                          className="text-[#7bc74d] hover:text-[#6ab63d] font-semibold"
                        >
                          {isLogin ? "Register now" : "Login"}
                        </button>
                      </p>
                      <p className="text-gray-500 text-xs">
                        Are you a customer?{" "}
                        <Link href="/auth?mode=user" className="text-[#7bc74d] hover:text-[#6ab63d] font-semibold">
                          Login as Customer
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}