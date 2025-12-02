"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
  TrendingUp,
  Crown,
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
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { businessApi } from "@/lib/api/business";
import { fileApi } from "@/lib/api/file";
import { subscriptionApi } from "@/lib/api/subscription";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { BusinessDetail } from "@/lib/types/business";
import type { SubscriptionProduct } from "@/lib/types/subscription";

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
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [businessDescription, setBusinessDescription] = useState<string>("");
  const [isSavingBusinessInfo, setIsSavingBusinessInfo] = useState(false);
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
      const businessData = response.data.business;
      setBusiness(businessData);
      setBusinessName(businessData.name || "");
      setBusinessDescription(businessData.description || "");
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
    // Return just the number without currency symbol
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const convertToUSD = (myrPrice: number) => {
    // Using approximate conversion rate (1 USD ≈ 4.11 MYR)
    // Rounding to nearest integer for cleaner display
    return Math.round(myrPrice / 4.11);
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

  const handleSaveBusinessInfo = async () => {
    if (!businessId || !business) return;

    setIsSavingBusinessInfo(true);
    setError(null);

    try {
      // Build payload with only changed fields
      const payload: { name?: string; description?: string } = {};
      
      const trimmedName = businessName.trim();
      const trimmedDescription = businessDescription.trim();
      const originalName = (business.name || "").trim();
      const originalDescription = (business.description || "").trim();

      // Only include fields that have changed
      if (trimmedName !== originalName) {
        payload.name = trimmedName;
      }
      
      if (trimmedDescription !== originalDescription) {
        payload.description = trimmedDescription;
      }

      // Only make the API call if there are actual changes
      if (Object.keys(payload).length === 0) {
        setIsSavingBusinessInfo(false);
        return;
      }

      await businessApi.update(businessId, payload);

      const changedFields = Object.keys(payload);
      const fieldNames = changedFields.map(field => 
        field === 'name' ? 'name' : 'description'
      ).join(' and ');

      toast.success("Business information updated successfully!", {
        description: `Your business ${fieldNames} ${changedFields.length > 1 ? 'have' : 'has'} been updated`,
        duration: 4000,
      });

      // Refresh business data
      await fetchBusiness();
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Use the server's error message directly
        const errorMessage = err.message || "Failed to update business information";
        setError(errorMessage);
        toast.error("Failed to update business information", {
          description: errorMessage,
        });
      } else if (err instanceof Error) {
        // Use the error message directly
        setError(err.message);
        toast.error("Failed to update business information", {
          description: err.message,
        });
      } else {
        const errorMessage = "An unexpected error occurred";
        setError(errorMessage);
        toast.error("Failed to update business information", {
          description: errorMessage,
        });
      }
    } finally {
      setIsSavingBusinessInfo(false);
    }
  };

  const businessImages = business?.business_images || [];

  // Check if there are changes to business name or description
  const hasChanges = business && (
    businessName.trim() !== (business.name || "").trim() ||
    businessDescription.trim() !== (business.description || "").trim()
  );

  // Get monthly product for subscription (price is in MYR)
  const monthlyProduct = subscriptionProducts.find(p => p.duration === "MONTHLY");
  
  // Display price from API (in MYR)
  const displayPriceMYR = monthlyProduct?.price || null;

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-gilroy-black text-black mb-4">Settings</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">Manage your business information and subscription</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl max-w-4xl mx-auto">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#7bc74d]" />
            <span className="ml-3 text-gray-600">Loading business information...</span>
          </div>
        ) : business ? (
        <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        {/* Business Information */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 border-2 border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-gilroy-black text-black">Business Information</h2>
              <p className="text-sm text-gray-600 mt-1">Update your business details</p>
            </div>
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
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                    placeholder="Enter business name"
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
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black resize-none"
                  placeholder="Enter business description"
                />
              </div>

              {hasChanges && (
                <div className="md:col-span-2 flex justify-end">
                  <button
                    onClick={handleSaveBusinessInfo}
                    disabled={isSavingBusinessInfo || !businessName.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg sm:rounded-xl transition-colors"
                  >
                    {isSavingBusinessInfo ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
            </div>
              )}

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
                        <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#7bc74d] max-w-xs">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
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
                          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                            <Image
                              src={img.image_url}
                              alt={`Business image ${index + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <button
                            onClick={() => setDeleteConfirm(img.image_url)}
                            disabled={isUploading}
                            className="absolute top-2 right-2 p-2 sm:p-1.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity disabled:opacity-50 shadow-lg sm:shadow-none"
                            title="Remove image"
                            aria-label="Remove image"
                          >
                            <X className="w-5 h-5 sm:w-4 sm:h-4" />
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
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 border-2 border-gray-200 overflow-hidden">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-gilroy-black text-black">Subscription</h2>
              <p className="text-sm text-gray-600 mt-1">Choose your plan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
              {/* Professional Plan - From API */}
              <div className={`relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 border-4 border-[#7bc74d] transform md:scale-105 z-10`}>
                {/* Badge */}
                <div className="absolute top-0 right-0 bg-[#7bc74d] text-white text-xs font-semibold px-4 py-2 rounded-bl-xl">
                  Most Popular
                </div>
                
                <div className="p-8">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4">
                    <TrendingUp className="w-7 h-7 text-[#7bc74d]" />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-gilroy-black text-black mb-2">Professional</h3>
                  <p className="text-gray-600 text-sm mb-6">For growing businesses ready to scale their loyalty programs</p>

                  {/* Price */}
                  <div className="mb-6">
                    {isLoadingProducts ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-black" />
                      </div>
                    ) : displayPriceMYR !== null ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-gilroy-black text-black">
                            ${formatPrice(convertToUSD(displayPriceMYR))}
                          </span>
                          <span className="text-gray-600">
                            /month
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-2xl font-gilroy-black text-gray-700">
                            RM{formatPrice(displayPriceMYR)}
                          </span>
                          <span className="text-gray-500 text-sm">
                            /month
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-gilroy-black text-black">-</span>
                        <span className="text-gray-600">/month</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => monthlyProduct && handleUpgrade(monthlyProduct.link)}
                    disabled={!monthlyProduct || isLoadingProducts}
                    className={`w-full py-3 rounded-xl font-semibold transition-colors mb-6 ${
                      monthlyProduct && !isLoadingProducts
                        ? "bg-[#7bc74d] hover:bg-[#6ab63d] text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Subscribe
                  </button>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Unlimited customers</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Basic points system</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Customer leaderboard</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Mobile-friendly dashboard</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Email support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Basic analytics</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">QR code generation</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Advanced analytics & insights</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Custom branding & logo</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Multiple store locations</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">SMS notifications</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Referral program tools</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Export customer data</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Priority email support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Custom point rules</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enterprise Plan - Static */}
              <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 border-2 border-gray-200 hover:border-[#7bc74d]">
                {/* Badge */}
                <div className="absolute top-0 right-0 bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-bl-xl">
                  Premium
                </div>

                <div className="p-8">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4">
                    <Crown className="w-7 h-7 text-purple-500" />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-gilroy-black text-black mb-2">Enterprise</h3>
                  <p className="text-gray-600 text-sm mb-6">For large businesses with advanced needs and multiple locations</p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-gilroy-black text-black">
                      Contact Us
                    </span>
                    <p className="text-gray-600 text-sm mt-2">
                      Custom pricing for your business needs
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    className="w-full py-3 rounded-xl font-semibold transition-colors mb-6 bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    Contact Us
                  </button>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Everything in Professional</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Full API access</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Dedicated account manager</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Custom integrations</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">White-label solution</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Advanced security features</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">24/7 phone support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Custom point tiers</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Multi-language support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Onboarding & training</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">SLA guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      </div>

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
    </div>
  );
}

