"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Clock,
  Check,
} from "lucide-react";
import { businessApi } from "@/lib/api/business";
import { subscriptionApi } from "@/lib/api/subscription";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { BusinessDetail } from "@/lib/types/business";
import type { SubscriptionProduct } from "@/lib/types/subscription";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface RestaurantSettingsProps {
  restaurantName?: string;
}

export default function RestaurantSettings({ restaurantName }: RestaurantSettingsProps) {
  // restaurantName is available but not currently used
  void restaurantName;
  const { user } = useAuthStore();
  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionProducts, setSubscriptionProducts] = useState<SubscriptionProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const businessId = user?.businessId || "";

  // Easy to manipulate - set to true for dev/sandbox, false for production
  const IS_TRIAL = process.env.NEXT_PUBLIC_IS_TRIAL === "true";

  useEffect(() => {
    if (!businessId) {
      setError("Business ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    fetchBusiness();
    fetchSubscriptionProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const fetchBusiness = async () => {
    if (!businessId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await businessApi.getById(businessId);
      setBusiness(response.data.business);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "Failed to load business information");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscriptionProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await subscriptionApi.getProducts({
        page: 1,
        limit: 10,
        is_trial: IS_TRIAL,
      });
      setSubscriptionProducts(response.data.subscription_products || []);
    } catch (err) {
      console.error("Failed to load subscription products:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleUpgrade = (link: string) => {
    const url = new URL(link);
    url.searchParams.set("client_reference_id", businessId);
    window.open(url.toString(), "_blank");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price); // Price is already in base currency
  };

  const monthlyProduct = subscriptionProducts.find(p => p.duration === "MONTHLY");
  const yearlyProduct = subscriptionProducts.find(p => p.duration === "YEARLY");
  
  // Get the selected product based on toggle
  const selectedProduct = isYearly ? yearlyProduct : monthlyProduct;

  return (
    <>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-gilroy-black text-black mb-2">Settings</h1>
        <p className="text-xs sm:text-sm text-gray-600">View your business information</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#7bc74d]" />
          <span className="ml-3 text-gray-600">Loading business information...</span>
        </div>
      ) : business ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Business Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-gilroy-black text-black">Business Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={business.name || ""}
                    readOnly
                    disabled
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Registration Number
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={business.registration_number || "N/A"}
                    readOnly
                    disabled
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={business.description || "No description provided"}
                  readOnly
                  disabled
                  rows={3}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed resize-none"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={business.address || "Not provided"}
                    readOnly
                    disabled
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  {business.status === "PENDING" ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-semibold">
                      <Clock className="w-3 h-3" />
                      PENDING
                    </div>
                  ) : business.is_active ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-xs font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      ACTIVE
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-800 rounded-lg text-xs font-semibold">
                      <XCircle className="w-3 h-3" />
                      INACTIVE
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Created At
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formatDate(business.created_at)}
                    readOnly
                    disabled
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Last Updated
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formatDate(business.updated_at)}
                    readOnly
                    disabled
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-gilroy-black text-black">Subscription</h2>
              
              {/* Toggle Switch */}
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${!isYearly ? 'text-black' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <Switch
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                  className="data-[state=checked]:bg-[#7bc74d]"
                />
                <span className={`text-sm font-medium ${isYearly ? 'text-black' : 'text-gray-500'}`}>
                  Annual
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
              {/* Basic Plan - Static */}
              <div className="relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-gray-200 flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-gilroy-black text-black mb-2">Basic</h3>
                  <p className="text-sm text-gray-600">A basic plan for startups and individual users.</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-gilroy-black text-black">$0</span>
                    <span className="text-sm text-gray-600">/month</span>
                  </div>
                </div>

                <Button
                  disabled
                  variant="default"
                  size="lg"
                  className="w-full mb-6 bg-black hover:bg-gray-800 text-white"
                >
                  Subscribe
                </Button>

                <ul className="space-y-3 flex-1">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">Unlimited customers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">Basic analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">Point management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">Customer leaderboard</span>
                  </li>
                </ul>
              </div>

              {/* Premium Plan - From API */}
              <div className="relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-black flex flex-col h-full">
                {isLoadingProducts ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                    <span className="ml-3 text-gray-600">Loading plans...</span>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-xl sm:text-2xl font-gilroy-black text-black mb-2">Premium</h3>
                      <p className="text-sm text-gray-600">A premium plan for growing businesses.</p>
                    </div>

                    <div className="mb-6">
                      {selectedProduct ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl font-gilroy-black text-black">
                            {formatPrice(selectedProduct.price)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {isYearly ? "/year" : "/month"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl font-gilroy-black text-black">-</span>
                          <span className="text-sm text-gray-600">{isYearly ? "/year" : "/month"}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => selectedProduct && handleUpgrade(selectedProduct.link)}
                      disabled={!selectedProduct}
                      variant="default"
                      size="lg"
                      className="w-full mb-6 bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-500"
                    >
                      Subscribe
                    </Button>

                    <ul className="space-y-3 flex-1">
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">Everything in Basic</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">Advanced analytics & insights</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">Priority support</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">Custom branding</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">API access</span>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

