"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Building2, Phone, MapPin, Eye, EyeOff, Store, Globe, ChevronDown } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Navbar from "@/components/Navbar";
import { authApi } from "@/lib/api/auth";
import { regionsApi } from "@/lib/api/regions";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import { convertPhoneNumber } from "@/lib/utils";
import type { RegionCountryCode } from "@/lib/types/regions";

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
    businessEmail: "",
    businessPhone: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    description: "",
    registrationNumber: "",
  });
  const [phoneValue, setPhoneValue] = useState<string | undefined>();
  const [businessPhoneValue, setBusinessPhoneValue] = useState<string | undefined>();
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [businessEmailValid, setBusinessEmailValid] = useState<boolean | null>(null);
  const [countries, setCountries] = useState<RegionCountryCode[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoadingCountries(true);
        const response = await regionsApi.getCountryCodes();
        // Sort countries alphabetically by name
        const sortedCountries = [...response.data.regions].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setCountries(sortedCountries);
        // Set default to Malaysia if available
        const malaysia = sortedCountries.find(c => c.country_code === "MY");
        if (malaysia) {
          setSelectedCountryCode(malaysia.country_code);
        }
      } catch (err) {
        console.error("Failed to fetch countries:", err);
        setError("Failed to load countries. Please refresh the page.");
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Memoize the phone input component to prevent re-renders that cause focus loss
  const PhoneInputComponent = useMemo(() => {
    const Component = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
      (props, ref) => (
        <input
          {...props}
          ref={ref}
          className="w-full text-black placeholder-gray-400"
        />
      )
    );
    Component.displayName = "PhoneInputComponent";
    return Component;
  }, []);

  const validateEmail = (email: string): boolean => {
    // More robust email validation regex
    // Validates: local-part@domain.tld format
    // - Local part: alphanumeric, dots, hyphens, underscores, plus signs
    // - Domain: alphanumeric, dots, hyphens
    // - TLD: at least 2 characters, letters only
    const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    
    // Additional checks
    if (!email || email.trim() === "") {
      return false;
    }
    
    // Check for consecutive dots
    if (email.includes("..")) {
      return false;
    }
    
    // Check that @ appears only once
    const atCount = (email.match(/@/g) || []).length;
    if (atCount !== 1) {
      return false;
    }
    
    // Check that email doesn't start or end with dot, @, or hyphen
    const trimmed = email.trim();
    if (/^[.@-]|[.@-]$/.test(trimmed)) {
      return false;
    }
    
    return emailRegex.test(trimmed);
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("At least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("One number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("One special character");
    }
    
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const updatedFormData = {
      ...formData,
      [e.target.name]: newValue,
    };
    setFormData(updatedFormData);
    setError(null);
    
    // Validate password in real-time
    if (e.target.name === "password") {
      validatePassword(newValue);
    }
    
    // Validate email in real-time
    if (e.target.name === "email") {
      if (newValue.trim() === "") {
        setEmailValid(null);
      } else {
        setEmailValid(validateEmail(newValue));
      }
    }
    
    // Validate business email in real-time
    if (e.target.name === "businessEmail") {
      if (newValue.trim() === "") {
        setBusinessEmailValid(null);
      } else {
        setBusinessEmailValid(validateEmail(newValue));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const trimmedEmail = formData.email.trim();
        if (!trimmedEmail) {
          setError("Please provide a valid email address");
          setIsLoading(false);
          return;
        }

        if (!formData.password) {
          setError("Please enter your password");
          setIsLoading(false);
          return;
        }

        const response = await authApi.login({
          email: trimmedEmail,
          password: formData.password,
        });

        // Validate response structure
        if (!response.data || !response.data.user || !response.data.backend_tokens) {
          throw new Error("Invalid response from server");
        }

        const { user, backend_tokens } = response.data;
        
        // Validate required fields
        if (!user.id || !backend_tokens.access_token || !backend_tokens.refresh_token) {
          throw new Error("Invalid response from server - missing required fields");
        }

        setAuth(user, backend_tokens);

        // Check if user is admin or staff
        const isAdminOrStaff = user.admin || user.staff;

        if (isAdminOrStaff) {
          // Redirect to restaurant dashboard
          router.push("/my-restaurant/dashboard");
        } else {
          // If user logs in but is not admin/staff, redirect to home
          router.push("/home");
        }
      } else {
        // Register Business - Validate all required fields
        
        // Business Information Validation
        const trimmedBusinessName = formData.businessName.trim();
        if (!trimmedBusinessName) {
          setError("Please provide a business name");
          setIsLoading(false);
          return;
        }

        const trimmedRegistrationNumber = formData.registrationNumber.trim();
        if (!trimmedRegistrationNumber) {
          setError("Please provide a registration number");
          setIsLoading(false);
          return;
        }

        const trimmedBusinessEmail = formData.businessEmail.trim();
        if (!trimmedBusinessEmail) {
          setError("Please provide a business email address");
          setIsLoading(false);
          return;
        }
        // Validate business email format
        if (!validateEmail(trimmedBusinessEmail)) {
          setError("Please provide a valid business email address (e.g., business@example.com)");
          setIsLoading(false);
          return;
        }

        if (!businessPhoneValue || businessPhoneValue.trim() === "") {
          setError("Please provide a business phone number");
          setIsLoading(false);
          return;
        }

        const trimmedAddress = formData.address.trim();
        if (!trimmedAddress) {
          setError("Please provide a business address");
          setIsLoading(false);
          return;
        }

        const trimmedDescription = formData.description.trim();
        if (!trimmedDescription) {
          setError("Please provide a business description");
          setIsLoading(false);
          return;
        }

        if (!selectedCountryCode) {
          setError("Please select a country");
          setIsLoading(false);
          return;
        }

        // Account Information Validation
        if (!phoneValue || phoneValue.trim() === "") {
          setError("Please provide a valid phone number");
          setIsLoading(false);
          return;
        }

        const trimmedEmail = formData.email.trim();
        if (!trimmedEmail) {
          setError("Please provide a valid email address");
          setIsLoading(false);
          return;
        }
        // Validate email format
        if (!validateEmail(trimmedEmail)) {
          setError("Please provide a valid email address format (e.g., user@example.com)");
          setIsLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        if (!validatePassword(formData.password)) {
          setError("Password does not meet requirements");
          setIsLoading(false);
          return;
        }

        const response = await authApi.registerBusiness({
          email: trimmedEmail,
          password: formData.password,
          phone_number: convertPhoneNumber(phoneValue.trim()),
          role: "ADMIN",
          is_active: true,
          metadata: {},
          business: {
            name: trimmedBusinessName,
            email: trimmedBusinessEmail,
            phone_number: convertPhoneNumber(businessPhoneValue.trim()),
            description: trimmedDescription,
            address: trimmedAddress,
            registration_number: trimmedRegistrationNumber,
            country_code: selectedCountryCode,
            metadata: {},
            is_active: true,
          },
        });

        // Validate response structure
        if (!response.data || !response.data.user || !response.data.backend_tokens) {
          throw new Error("Invalid response from server");
        }

        const { user, backend_tokens } = response.data;
        
        // Validate required fields
        if (!user.id || !backend_tokens.access_token || !backend_tokens.refresh_token) {
          throw new Error("Invalid response from server - missing required fields");
        }

        setAuth(user, backend_tokens);
        
        // Redirect to restaurant dashboard
        router.push("/my-restaurant/dashboard");
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Use the server's error message directly
        setError(err.message || "An error occurred. Please try again.");
      } else {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage || "An unexpected error occurred. Please try again.");
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

        <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8 pt-24 pb-6">
          <div className="flex items-center justify-center min-h-[calc(100vh-240px)] py-8">
            <div className="w-full max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] px-2 sm:px-4 lg:px-6">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Left Side - Branding */}
                  <div className="relative bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] p-8 lg:p-12 xl:p-16 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="mb-6 flex justify-center">
                        <Store className="w-24 h-24 text-white/90" />
                      </div>
                      <h2 className="text-4xl font-gilroy-black mb-4">
                        {isLogin ? "Welcome Back!" : "Join PointNow"}
                      </h2>
                      <p className="hidden lg:block text-xl opacity-90 mb-8">
                        {isLogin
                          ? "Sign in to manage your loyalty program and reward your customers."
                          : "Start rewarding your customers and grow your business with our powerful loyalty platform."}
                      </p>
                      
                      <div className="hidden lg:block space-y-4">
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
                        <Link
                          href="/auth?mode=user"
                          className="px-5 py-2 rounded-lg font-semibold transition-all text-sm cursor-pointer text-gray-600 hover:text-gray-900"
                        >
                          User
                        </Link>
                        <Link
                          href="/auth?mode=business"
                          className="px-5 py-2 rounded-lg font-semibold transition-all text-sm cursor-pointer bg-[#7bc74d] text-white shadow-sm"
                        >
                          Business
                        </Link>
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
                    {/* Business Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-gilroy-extrabold text-black border-b border-gray-200 pb-2">
                        Business Information
                      </h3>
                      
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
                            placeholder="e.g., Heifereum Business"
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
                        <label htmlFor="businessEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                          Business Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            id="businessEmail"
                            name="businessEmail"
                            value={formData.businessEmail}
                            onChange={handleInputChange}
                            required={!isLogin}
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400 ${
                              businessEmailValid === false
                                ? "border-red-300 focus:ring-red-500"
                                : businessEmailValid === true
                                ? "border-green-300"
                                : "border-gray-200"
                            }`}
                            placeholder="e.g., business@example.com"
                          />
                        </div>
                        {businessEmailValid === false && formData.businessEmail.trim() && (
                          <p className="mt-1 text-xs text-red-600">
                            Please enter a valid email address (e.g., business@example.com)
                          </p>
                        )}
                        {businessEmailValid === true && (
                          <p className="mt-1 text-xs text-green-600">✓ Valid email address</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="businessPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                          Business Phone Number *
                        </label>
                        <div className="relative">
                          <style dangerouslySetInnerHTML={{__html: `
                            .business-phone-input-wrapper .PhoneInput {
                              display: flex !important;
                              align-items: center !important;
                              width: 100% !important;
                              border: 1px solid #e5e7eb !important;
                              border-radius: 0.75rem !important;
                              padding: 0.625rem !important;
                              transition: all 0.2s !important;
                            }
                            .business-phone-input-wrapper .PhoneInput:focus-within {
                              outline: none !important;
                              ring: 2px !important;
                              ring-color: #7bc74d !important;
                              border-color: transparent !important;
                            }
                            .business-phone-input-wrapper .PhoneInputCountry {
                              margin-right: 0 !important;
                              padding-right: 0 !important;
                              padding-left: 0.5rem !important;
                            }
                            .business-phone-input-wrapper .PhoneInputCountryIcon {
                              width: 1.5em;
                              height: 1.5em;
                            }
                            .business-phone-input-wrapper .PhoneInputCountrySelectArrow {
                              margin-left: 0.25rem !important;
                              margin-right: 0.25rem !important;
                            }
                            .business-phone-input-wrapper .PhoneInputInput {
                              flex: 1 !important;
                              margin-left: 0 !important;
                              padding-left: 0.5rem !important;
                              border: none !important;
                              outline: none !important;
                              background: transparent !important;
                            }
                          `}} />
                          <div className="business-phone-input-wrapper">
                          <PhoneInput
                              placeholder="Enter business phone number"
                              value={businessPhoneValue}
                              onChange={setBusinessPhoneValue}
                            defaultCountry="MY"
                              international
                            className="w-full"
                            style={{
                              '--PhoneInput-color--focus': '#7bc74d',
                              '--PhoneInputCountryFlag-borderColor': 'transparent',
                              '--PhoneInputCountrySelectArrow-color': '#9ca3af',
                            }}
                              inputComponent={PhoneInputComponent}
                          />
                          </div>
                        </div>
                        {businessPhoneValue && (
                          <p className="mt-1 text-xs text-gray-500">Format: {businessPhoneValue}</p>
                        )}
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
                            placeholder="e.g., Jalan Taman Melati 8"
                          />
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
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400 resize-none"
                          placeholder="Tell us about your business, cuisine type, specialties, and what makes it unique..."
                      />
                        <p className="mt-1 text-xs text-gray-500">This helps customers discover your business</p>
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                          Country *
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                          <select
                            id="country"
                            name="country"
                            value={selectedCountryCode}
                            onChange={(e) => setSelectedCountryCode(e.target.value)}
                            required={!isLogin}
                            disabled={isLoadingCountries}
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black bg-white appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            {isLoadingCountries ? (
                              <option value="">Loading countries...</option>
                            ) : (
                              <>
                                <option value="">Select a country</option>
                                {countries.map((country) => (
                                  <option key={country.country_code} value={country.country_code}>
                                    {country.name}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                        {selectedCountryCode && (
                          <p className="mt-1 text-xs text-gray-500">
                            Selected: {countries.find(c => c.country_code === selectedCountryCode)?.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Account Information Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-gilroy-extrabold text-black border-b border-gray-200 pb-2">
                        Account Information
                      </h3>

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
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400 ${
                          !isLogin && emailValid === false
                            ? "border-red-300 focus:ring-red-500"
                            : !isLogin && emailValid === true
                            ? "border-green-300"
                            : "border-gray-200"
                        }`}
                            placeholder="admin@yourrestaurant.com"
                          />
                        </div>
                        {!isLogin && emailValid === false && formData.email.trim() && (
                          <p className="mt-1 text-xs text-red-600">
                            Please enter a valid email address (e.g., user@example.com)
                          </p>
                        )}
                        {!isLogin && emailValid === true && (
                          <p className="mt-1 text-xs text-green-600">✓ Valid email address</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <style dangerouslySetInnerHTML={{__html: `
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
                              margin-right: 0 !important;
                              padding-right: 0 !important;
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
                            }
                          `}} />
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
                              inputComponent={PhoneInputComponent}
                      />
                    </div>
                  </div>
                        {phoneValue && (
                          <p className="mt-1 text-xs text-gray-500">Format: {phoneValue}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Password Section */}
                {!isLogin && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-gilroy-extrabold text-black border-b border-gray-200 pb-2">
                      Security
                    </h3>

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
                          placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                      {formData.password && passwordErrors.length > 0 && (
                        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs font-semibold text-amber-800 mb-1">Password must contain:</p>
                          <ul className="text-xs text-amber-700 space-y-1">
                            {passwordErrors.map((error, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="text-amber-500">✗</span> {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {formData.password && passwordErrors.length === 0 && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-xs text-green-700 flex items-center gap-2">
                            <span className="text-green-500">✓</span> Password meets all requirements
                          </p>
                        </div>
                      )}
                </div>

                    <div>
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
                          className={`w-full pl-10 pr-12 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400 ${
                            formData.confirmPassword && formData.password !== formData.confirmPassword
                              ? "border-red-300"
                              : formData.confirmPassword && formData.password === formData.confirmPassword
                              ? "border-green-300"
                              : "border-gray-200"
                          }`}
                          placeholder="Re-enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                      )}
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="mt-1 text-xs text-green-600">✓ Passwords match</p>
                      )}
                    </div>
                  </div>
                )}

                {isLogin && (
                  <>
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
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400 ${
                            isLogin && emailValid === false && formData.email.trim()
                              ? "border-red-300 focus:ring-red-500"
                              : isLogin && emailValid === true
                              ? "border-green-300"
                              : "border-gray-200"
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {isLogin && emailValid === false && formData.email.trim() && (
                        <p className="mt-1 text-xs text-red-600">
                          Please enter a valid email address (e.g., user@example.com)
                        </p>
                      )}
                      {isLogin && emailValid === true && (
                        <p className="mt-1 text-xs text-green-600">✓ Valid email address</p>
                      )}
                    </div>

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
                  </>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-[#7bc74d] focus:ring-[#7bc74d]" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-[#7bc74d] hover:text-[#6ab63d] font-semibold">
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
                    <div className="text-center space-y-2 mt-4">
                      <p className="text-gray-600 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                          type="button"
                          onClick={() => setIsLogin(!isLogin)}
                          className="text-[#7bc74d] hover:text-[#6ab63d] font-semibold"
                        >
                          {isLogin ? "Register now" : "Login"}
                        </button>
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