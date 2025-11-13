"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Gift, Shield } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Navbar from "@/components/Navbar";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { VerifyLoginOTPResponse } from "@/lib/types/auth";

// Phone input wrapper styles - extracted to avoid duplication
const PHONE_INPUT_STYLES = `
  .phone-input-wrapper .PhoneInput {
    display: flex !important;
    align-items: center !important;
    width: 100% !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 0.75rem !important;
    padding: 0.625rem !important;
    transition: all 0.2s !important;
  }
  .phone-input-wrapper .PhoneInput:focus-within {
    outline: none !important;
    ring: 2px !important;
    ring-color: #7bc74d !important;
    border-color: transparent !important;
  }
  .phone-input-wrapper .PhoneInputCountry {
    margin-right: 0.5rem !important;
    padding-right: 0.5rem !important;
    padding-left: 0.5rem !important;
  }
  .phone-input-wrapper .PhoneInputCountryIcon {
    width: 1.5em;
    height: 1.5em;
  }
  .phone-input-wrapper .PhoneInputCountrySelectArrow {
    margin-left: 0.25rem !important;
    margin-right: 0.25rem !important;
  }
  .phone-input-wrapper .PhoneInputInput {
    flex: 1 !important;
    margin-left: 0 !important;
    padding-left: 0.5rem !important;
    border: none !important;
    outline: none !important;
    background: transparent !important;
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
    color: #000000 !important;
  }
  .phone-input-wrapper .PhoneInputCountrySelect {
    color: #000000 !important;
  }
  .phone-input-wrapper .PhoneInputCountrySelectArrow {
    color: #9ca3af !important;
  }
`;

export default function UserAuthScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    role: "CUSTOMER",
  });
  const [phoneValue, setPhoneValue] = useState<string | undefined>();
  const [loginPhoneValue, setLoginPhoneValue] = useState<string | undefined>();
  const [pendingAuthData, setPendingAuthData] = useState<{
    phone: string;
    email?: string;
    role?: string;
    isLogin: boolean;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  /**
   * Validates phone number format
   */
  const isValidPhoneNumber = (phone: string | undefined): boolean => {
    if (!phone || phone.trim() === "") return false;
    // PhoneInput provides E.164 format (e.g., +60123456789)
    // We accept any phone number format, will extract digits later
    return phone.trim().length >= 8;
  };

  /**
   * Extracts only digits from phone number (removes +, spaces, dashes, etc.)
   * Keeps the country code but removes the plus sign
   * Example: "+60123456789" → "60123456789"
   */
  const extractPhoneDigits = (phone: string | undefined): string => {
    if (!phone) return "";
    
    // Remove all non-digit characters (removes +, spaces, dashes, etc.)
    // This keeps the country code digits but removes the plus sign
    return phone.replace(/\D/g, "");
  };

  /**
   * Validates email format
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  /**
   * Handles initial form submission (before OTP verification)
   * Validates input and transitions to OTP screen
   */
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login flow - validate phone number
        if (!isValidPhoneNumber(loginPhoneValue)) {
          setError("Please provide a valid phone number");
          setIsLoading(false);
          return;
        }

        // Extract only digits (remove + and country code)
        const phoneDigits = extractPhoneDigits(loginPhoneValue);
        
        // Call login endpoint to send OTP - API: POST /auth/login/phone_number
        await authApi.loginWithPhone({
          phone_number: phoneDigits,
        });

        // Store data and show OTP screen
        setPendingAuthData({
          phone: phoneDigits,
          isLogin: true,
        });
        setShowOTPScreen(true);
      } else {
        // Registration flow - validate phone and email
        if (!isValidPhoneNumber(phoneValue)) {
          setError("Please provide a valid phone number");
          setIsLoading(false);
          return;
        }

        const trimmedEmail = formData.email.trim();
        if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
          setError("Please provide a valid email address");
          setIsLoading(false);
          return;
        }

        // Extract only digits (remove + and country code)
        const phoneDigits = extractPhoneDigits(phoneValue);
        
        // Call register endpoint to send OTP - API: POST /auth/register/phone_number
        await authApi.registerUserWithPhone({
          email: trimmedEmail,
          phone_number: phoneDigits,
          role: formData.role,
        });

        // Store data and show OTP screen
        setPendingAuthData({
          phone: phoneDigits,
          email: trimmedEmail,
          role: formData.role,
          isLogin: false,
        });
        setShowOTPScreen(true);
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Provide more specific error messages based on status code
        if (err.status === 400) {
          setError("Invalid phone number or email. Please check your input.");
        } else if (err.status === 404 && isLogin) {
          setError("Phone number not found. Please register first.");
        } else if (err.status === 409 && !isLogin) {
          setError("An account with this phone number or email already exists.");
        } else if (err.status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(err.message || "An error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles OTP verification and completes authentication
   * Calls the appropriate OTP verification endpoint based on flow
   */
  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAuthData) {
      setError("Session expired. Please start again.");
      return;
    }

    // Validate OTP format (6 digits)
    if (!formData.otp || formData.otp.length !== 6 || !/^\d{6}$/.test(formData.otp)) {
      setError("Please enter a valid 6-digit OTP code");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      if (pendingAuthData.isLogin) {
        // Verify login OTP - API: POST /auth/verify/login/phone_number/otp
        const response = await authApi.verifyLoginOTP({
          otp_code: formData.otp,
        });

        // Validate response structure
        if (!response.data || !response.data.user || !response.data.backend_tokens) {
          throw new Error("Invalid response from server");
        }

        // Login OTP verify returns User format with backend_tokens
        setAuth(response.data.user, response.data.backend_tokens);

        router.push("/home");
      } else {
        // Verify register OTP - API: POST /auth/verify/register/phone_number/otp
        // Response structure: { message, status, data: { user: User, backend_tokens: { access_token, refresh_token, expires_in } } }
        // Note: The actual response matches VerifyLoginOTPResponse structure, not VerifyRegisterOTPResponse
        const response = await authApi.verifyRegisterOTP({
          otp_code: formData.otp,
        }) as unknown as VerifyLoginOTPResponse;

        // Log full response for debugging
        console.log("Register OTP Verify Response:", JSON.stringify(response, null, 2));

        // Validate response structure
        if (!response) {
          console.error("No response received");
          throw new Error("No response from server");
        }

        // The register OTP verify response has the same structure as login OTP verify
        // { message, status, data: { user: User, backend_tokens: BackendTokens } }
        if (!response.data) {
          console.error("Response missing data field:", response);
          throw new Error("Invalid response structure - missing data field");
        }

        if (!response.data.user || !response.data.backend_tokens) {
          console.error("Missing required fields in response:", {
            hasUser: !!response.data.user,
            hasBackendTokens: !!response.data.backend_tokens,
            responseKeys: Object.keys(response),
            dataKeys: response.data ? Object.keys(response.data) : [],
            fullResponse: response
          });
          throw new Error("Invalid response from server - missing required fields (user or backend_tokens)");
        }

        if (!response.data.backend_tokens.access_token || !response.data.backend_tokens.refresh_token) {
          console.error("Missing tokens in backend_tokens:", {
            hasAccessToken: !!response.data.backend_tokens.access_token,
            hasRefreshToken: !!response.data.backend_tokens.refresh_token,
            backendTokens: response.data.backend_tokens
          });
          throw new Error("Invalid response from server - missing access_token or refresh_token");
        }

        // Validate user object structure
        if (!response.data.user.id) {
          console.error("User object missing id:", response.data.user);
          throw new Error("Invalid user data - missing id");
        }

        try {
          // Register OTP verify returns User format with backend_tokens (same as login)
          console.log("Setting auth with user:", {
            id: response.data.user.id,
            email: response.data.user.email,
            name: response.data.user.name,
            phone_number: response.data.user.phone_number,
            hasAccessToken: !!response.data.backend_tokens.access_token,
            hasRefreshToken: !!response.data.backend_tokens.refresh_token
          });
          
          // Use setAuth (same as login) since we have User + BackendTokens format
          setAuth(response.data.user, response.data.backend_tokens);
          
          console.log("Auth set successfully, redirecting to /home");
          
          // Redirect immediately after successful authentication
          router.push("/home");
        } catch (authError) {
          console.error("Error setting auth:", authError);
          // Re-throw with more context
          if (authError instanceof Error) {
            throw authError;
          }
          throw new Error("Failed to authenticate. Please try logging in.");
        }
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      
      if (err instanceof ApiClientError) {
        // Provide more specific error messages based on status code
        if (err.status === 400) {
          setError("Invalid OTP code. Please check and try again.");
        } else if (err.status === 401) {
          setError("OTP verification failed. The code may have expired. Please request a new one.");
        } else if (err.status === 404) {
          setError("OTP session not found. Please start the process again.");
        } else if (err.status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(err.message || "An error occurred. Please try again.");
        }
      } else {
        // Log the actual error for debugging
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Unexpected error details:", {
          error: err,
          message: errorMessage,
          stack: err instanceof Error ? err.stack : undefined
        });
        setError(errorMessage || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setShowOTPScreen(false);
    setPendingAuthData(null);
    setFormData({ ...formData, otp: "" });
    setError(null);
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
                  <div className="relative bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] p-6 sm:p-8 lg:p-12 xl:p-16 flex items-center justify-center min-h-[300px] lg:min-h-auto">
                          <div className="text-center text-white">
                      <div className="text-5xl sm:text-6xl lg:text-7xl mb-4 sm:mb-6">
                        {showOTPScreen ? "🔐" : "🎁"}
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-gilroy-black mb-3 sm:mb-4">
                        {showOTPScreen
                          ? "Verify Your Account"
                          : isLogin
                          ? "Welcome Back!"
                          : "Join PointNow"}
                      </h2>
                      <p className="hidden lg:block text-base sm:text-lg lg:text-xl opacity-90 mb-6 sm:mb-8 px-4">
                        {showOTPScreen
                          ? "Enter the verification code sent to your phone number to continue."
                          : isLogin
                          ? "Sign in to check your points and redeem rewards at your favorite businesses."
                          : "Start earning points and unlock exclusive rewards at businesses near you."}
                      </p>
                      
                      <div className="hidden lg:block space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-2 sm:gap-3 text-left">
                          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 flex-shrink-0">
                            <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <h3 className="font-gilroy-extrabold text-xs sm:text-sm">Earn Points</h3>
                            <p className="text-xs opacity-90">Get rewarded for every visit</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-left">
                          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 flex-shrink-0">
                            <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <h3 className="font-gilroy-extrabold text-xs sm:text-sm">Redeem Rewards</h3>
                            <p className="text-xs opacity-90">Use points for discounts & freebies</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-left">
                          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 flex-shrink-0">
                            <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <h3 className="font-gilroy-extrabold text-xs sm:text-sm">Track Progress</h3>
                            <p className="text-xs opacity-90">See your points across all businesses</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Form */}
                  <div className="p-6 sm:p-8 lg:p-12 xl:p-16">
                    {/* Header */}
                    {!showOTPScreen && (
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-gilroy-black text-black mb-2">
                          {isLogin ? "Login to Your Account" : "Create Your Account"}
                        </h1>
                        <p className="text-gray-600 text-sm">
                          {isLogin
                            ? "Enter your phone number to sign in"
                            : "Get started with PointNow and start earning rewards"}
                        </p>
                      </div>
                    )}
                    {/* Toggle */}
                    {!showOTPScreen && (
                      <div className="flex items-center justify-center mb-6 relative z-10">
                        <div className="bg-gray-100 rounded-xl p-1 inline-flex">
                          <Link
                            href="/auth?mode=user"
                            className="px-5 py-2 rounded-lg font-semibold transition-all text-sm cursor-pointer bg-[#7bc74d] text-white shadow-sm"
                          >
                            User
                          </Link>
                          <Link
                            href="/auth?mode=business"
                            className="px-5 py-2 rounded-lg font-semibold transition-all text-sm cursor-pointer text-gray-600 hover:text-gray-900"
                          >
                            Business
                          </Link>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {showOTPScreen ? (
                      /* OTP Verification Screen */
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#7bc74d] bg-opacity-10 rounded-full mb-4">
                            <Shield className="w-8 h-8 text-[#7bc74d]" />
                          </div>
                          <h2 className="text-xl font-gilroy-black text-black mb-2">
                            Verify Your Phone Number
                          </h2>
                          <p className="text-gray-600 text-sm">
                            We&apos;ve sent a verification code to
                          </p>
                          <p className="text-gray-900 font-semibold mt-1">
                            {pendingAuthData?.phone}
                          </p>
                        </div>

                        <form onSubmit={handleOTPVerify} className="space-y-5">
                          <div>
                            <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                              Enter OTP Code
                            </label>
                            <div className="relative max-w-xs mx-auto">
                              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={formData.otp}
                                onChange={handleInputChange}
                                required
                                maxLength={6}
                                autoFocus
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-[#7bc74d] text-black placeholder-gray-400 text-center text-2xl tracking-[0.5em] font-semibold"
                                placeholder="000000"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            <button
                              type="submit"
                              disabled={isLoading || !formData.otp || formData.otp.length !== 6}
                              className="w-full bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow-lg"
                            >
                              {isLoading ? "Verifying..." : pendingAuthData?.isLogin ? "Sign In" : "Verify & Create Account"}
                            </button>

                            <button
                              type="button"
                              onClick={handleBackToForm}
                              disabled={isLoading}
                              className="w-full text-gray-600 hover:text-gray-900 font-semibold py-2 transition-colors"
                            >
                              ← Back
                            </button>
                          </div>

                          <div className="text-center">
                            <button
                              type="button"
                              onClick={async () => {
                                if (!pendingAuthData) return;
                                
                                setError(null);
                                setIsLoading(true);
                                
                                try {
                                  // Resend OTP by calling the initial endpoint again
                                  if (pendingAuthData.isLogin) {
                                    await authApi.loginWithPhone({
                                      phone_number: pendingAuthData.phone,
                                    });
                                  } else {
                                    if (!pendingAuthData.email || !pendingAuthData.role) {
                                      setError("Missing registration data. Please start over.");
                                      setIsLoading(false);
                                      return;
                                    }
                                    await authApi.registerUserWithPhone({
                                      email: pendingAuthData.email,
                                      phone_number: pendingAuthData.phone,
                                      role: pendingAuthData.role,
                                    });
                                  }
                                  setFormData({ ...formData, otp: "" });
                                  // Show success message briefly
                                  setError(null);
                                } catch (err) {
                                  if (err instanceof ApiClientError) {
                                    setError(err.message || "Failed to resend OTP. Please try again.");
                                  } else {
                                    setError("Failed to resend OTP. Please try again.");
                                  }
                                } finally {
                                  setIsLoading(false);
                                }
                              }}
                              disabled={isLoading}
                              className="text-sm text-[#7bc74d] hover:text-[#6ab63d] font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              {isLoading ? "Sending..." : "Didn&apos;t receive code? Resend"}
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      /* Main Form */
                      <form onSubmit={handleInitialSubmit} className="space-y-4 lg:space-y-5">
                        {/* Login: Phone Number */}
                        {isLogin && (
                          <div>
                            <label htmlFor="loginPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <style dangerouslySetInnerHTML={{__html: PHONE_INPUT_STYLES}} />
                            <div className="phone-input-wrapper">
                              <PhoneInput
                                placeholder="Enter phone number"
                                value={loginPhoneValue}
                                onChange={setLoginPhoneValue}
                                defaultCountry="MY"
                                international
                                className="w-full"
                                style={{
                                  '--PhoneInput-color--focus': '#7bc74d',
                                  '--PhoneInputCountryFlag-borderColor': 'transparent',
                                  '--PhoneInputCountrySelectArrow-color': '#9ca3af',
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Registration: Phone Number, Email, Role */}
                        {!isLogin && (
                          <>
                            <div>
                              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number *
                              </label>
                              <style dangerouslySetInnerHTML={{__html: PHONE_INPUT_STYLES}} />
                              <div className="phone-input-wrapper">
                                <PhoneInput
                                  placeholder="Enter phone number"
                                  value={phoneValue}
                                  onChange={setPhoneValue}
                                  defaultCountry="MY"
                                  international
                                  className="w-full"
                                  style={{
                                    '--PhoneInput-color--focus': '#7bc74d',
                                    '--PhoneInputCountryFlag-borderColor': 'transparent',
                                    '--PhoneInputCountrySelectArrow-color': '#9ca3af',
                                  }}
                                />
                              </div>
                            </div>

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

                            <div>
                              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                                Role *
                              </label>
                              <div className="relative">
                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                                <select
                                  id="role"
                                  name="role"
                                  value={formData.role}
                                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                  required
                                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black bg-white"
                                >
                                  <option value="CUSTOMER">Customer</option>
                                  <option value="USER">User</option>
                                </select>
                              </div>
                            </div>
                          </>
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

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={
                            isLoading ||
                            (isLogin ? !loginPhoneValue : !phoneValue || !formData.email)
                          }
                          className="w-full bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow-lg"
                        >
                          {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                        </button>
                      </form>
                    )}

                    {/* Divider */}
                    {/* <div className="my-5 flex items-center">
                      <div className="flex-1 border-t border-gray-200"></div>
                      <span className="px-4 text-sm text-gray-500">or</span>
                      <div className="flex-1 border-t border-gray-200"></div>
                    </div> */}

                    {/* Social Login */}
                    {/* <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-5">
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
                    </button> */}

                    {/* Switch Mode */}
                    {!showOTPScreen && (
                      <div className="text-center space-y-2 mt-4">
                          <p className="text-gray-600 text-sm">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                          <button
                            type="button"
                            onClick={() => {
                              setIsLogin(!isLogin);
                              setError(null);
                              setFormData({
                                email: "",
                                otp: "",
                                role: "CUSTOMER",
                              });
                              setPhoneValue(undefined);
                              setLoginPhoneValue(undefined);
                            }}
                            className="text-[#7bc74d] hover:text-[#6ab63d] font-semibold"
                          >
                            {isLogin ? "Register now" : "Login"}
                          </button>
                        </p>
                      </div>
                    )}
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

