"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { businessApi } from "@/lib/api/business";
import { fileApi } from "@/lib/api/file";
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
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        // Use the server's error message directly
        setError(err.message || "Failed to load business information");
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Invalid file type", {
        description: "Please upload an image file",
      });
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (e.g., 5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 5MB",
      });
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Set selected file and create preview
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCancelPreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Step 1: Upload file
      const uploadResponse = await fileApi.upload(selectedFile);
      const imageUrl = uploadResponse.data.image_url;

      // Step 2: Update business with the image URL
      // Get existing images from business or create new array
      const existingImages = business?.business_images || [];
      
      await businessApi.update(businessId, {
        business_images: [
          ...existingImages.map((img) => ({ image_url: img.image_url })),
          { image_url: imageUrl }
        ],
      });

      toast.success("Image uploaded successfully!", {
        description: "Business image has been updated",
        duration: 4000,
      });

      // Clear preview and reset
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh business data
      await fetchBusiness();
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Use the server's error message directly
        const errorMessage = err.message || "Failed to upload image";
        setError(errorMessage);
        toast.error("Failed to upload image", {
          description: errorMessage,
        });
      } else if (err instanceof Error) {
        // Use the error message directly
        setError(err.message);
        toast.error("Failed to upload image", {
          description: err.message,
        });
      } else {
        const errorMessage = "An unexpected error occurred";
        setError(errorMessage);
        toast.error("Failed to upload image", {
          description: errorMessage,
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    if (!business) return;

    setIsUploading(true);
    setError(null);

    try {
      const existingImages = business.business_images || [];
      const updatedImages = existingImages.filter((img) => img.image_url !== imageUrl);

      await businessApi.update(businessId, {
        business_images: updatedImages.map((img) => ({ image_url: img.image_url })),
      });

      toast.success("Image removed successfully!", {
        description: "Business image has been removed",
        duration: 4000,
      });

      setDeleteConfirm(null);
      // Refresh business data
      await fetchBusiness();
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Use the server's error message directly
        const errorMessage = err.message || "Failed to remove image";
        setError(errorMessage);
        toast.error("Failed to remove image", {
          description: errorMessage,
        });
      } else if (err instanceof Error) {
        // Use the error message directly
        setError(err.message);
        toast.error("Failed to remove image", {
          description: err.message,
        });
      } else {
        const errorMessage = "An unexpected error occurred";
        setError(errorMessage);
        toast.error("Failed to remove image", {
          description: errorMessage,
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const businessImages = business?.business_images || [];

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

              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Business Images
                </label>
                <div className="space-y-4">
                  {/* Upload Button */}
                  {!previewUrl && (
                    <div className="flex items-center gap-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex items-center gap-2 px-4 py-2.5 bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold rounded-lg sm:rounded-xl transition-colors cursor-pointer ${
                          isUploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </label>
                      <p className="text-xs text-gray-500">Max 5MB, JPG/PNG</p>
                    </div>
                  )}

                  {/* Preview Section */}
                  {previewUrl && (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-[#7bc74d] max-w-xs">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={handleCancelPreview}
                          disabled={isUploading}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-opacity disabled:opacity-50"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleConfirmUpload}
                          disabled={isUploading}
                          className="flex items-center gap-2 px-4 py-2.5 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg sm:rounded-xl transition-colors"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Confirm Upload</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancelPreview}
                          disabled={isUploading}
                          className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-lg sm:rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Display Images */}
                  {businessImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {businessImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                            <img
                              src={img.image_url}
                              alt={`Business image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => setDeleteConfirm(img.image_url)}
                            disabled={isUploading}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                            title="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {businessImages.length === 0 && (
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No images uploaded yet</p>
                      </div>
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

      {/* Delete Image Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open: boolean) => {
        if (!open) {
          setDeleteConfirm(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-gilroy-black text-black">Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <button
              onClick={() => setDeleteConfirm(null)}
              disabled={isUploading}
              className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirm && handleRemoveImage(deleteConfirm)}
              disabled={isUploading || !deleteConfirm}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete</span>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

