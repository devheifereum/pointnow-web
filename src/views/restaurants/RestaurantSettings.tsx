"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Trash2,
  AlertTriangle,
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
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { BusinessDetail } from "@/lib/types/business";

interface RestaurantSettingsProps {
  restaurantName?: string;
}

export default function RestaurantSettings({ restaurantName }: RestaurantSettingsProps) {
  // restaurantName is available but not currently used
  void restaurantName;
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [businessDescription, setBusinessDescription] = useState<string>("");
  const [isSavingBusinessInfo, setIsSavingBusinessInfo] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const businessId = user?.businessId || "";

  useEffect(() => {
    if (!businessId) {
      setError("Business ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    fetchBusiness();
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

  const handleDeleteAccount = async () => {
    if (!businessId || deleteConfirmText !== "DELETE") return;

    setIsDeletingAccount(true);
    setError(null);

    try {
      await businessApi.delete(businessId);

      toast.success("Account deleted successfully", {
        description: "Your business account has been permanently deleted",
        duration: 3000,
      });

      // Clear auth state
      clearAuth();

      // Prevent going back by replacing history
      router.replace("/");
      
      // Add a small delay to ensure navigation completes
      setTimeout(() => {
        // Clear browser history to prevent back navigation
        if (typeof window !== "undefined") {
          window.history.pushState(null, "", "/");
          window.addEventListener("popstate", () => {
            window.history.pushState(null, "", "/");
          });
        }
      }, 100);
    } catch (err) {
      if (err instanceof ApiClientError) {
        const errorMessage = err.message || "Failed to delete account";
        setError(errorMessage);
        toast.error("Failed to delete account", {
          description: errorMessage,
        });
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error("Failed to delete account", {
          description: err.message,
        });
      } else {
        const errorMessage = "An unexpected error occurred";
        setError(errorMessage);
        toast.error("Failed to delete account", {
          description: errorMessage,
        });
      }
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const businessImages = business?.business_images || [];

  // Check if there are changes to business name or description
  const hasChanges = business && (
    businessName.trim() !== (business.name || "").trim() ||
    businessDescription.trim() !== (business.description || "").trim()
  );

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

          {/* Delete Account Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 border-2 border-red-200 overflow-hidden">
            <div className="flex items-center gap-3 sm:gap-4 mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-gilroy-black text-black">Danger Zone</h2>
                <p className="text-sm text-gray-600 mt-1">Permanently delete your business account</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-gilroy-extrabold text-red-900 mb-2">Delete Business Account</h3>
              <p className="text-sm text-red-700 mb-4">
                Once you delete your business account, there is no going back. This action will permanently delete:
              </p>
              <ul className="text-sm text-red-700 space-y-1 mb-6 list-disc list-inside">
                <li>All business information and settings</li>
                <li>All customer data and loyalty points</li>
                <li>All transaction history</li>
                <li>All staff accounts associated with this business</li>
                <li>All analytics and reports</li>
              </ul>
              <button
                onClick={() => setShowDeleteAccountDialog(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
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

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteAccountDialog} onOpenChange={(open: boolean) => {
        if (!open) {
          setShowDeleteAccountDialog(false);
          setDeleteConfirmText("");
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-gilroy-black text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Delete Business Account
            </DialogTitle>
            <DialogDescription className="text-base">
              This action is permanent and cannot be undone. All your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-semibold mb-2">
                This will permanently delete:
              </p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>Business profile: <span className="font-semibold">{business?.name}</span></li>
                <li>All customer data and loyalty points</li>
                <li>All transaction history</li>
                <li>All staff accounts</li>
                <li>All analytics and reports</li>
              </ul>
            </div>

            <div>
              <label htmlFor="delete-confirm" className="block text-sm font-semibold text-gray-700 mb-2">
                Type <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-red-600">DELETE</span> to confirm:
              </label>
              <input
                id="delete-confirm"
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black placeholder-gray-400"
                disabled={isDeletingAccount}
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                setShowDeleteAccountDialog(false);
                setDeleteConfirmText("");
              }}
              disabled={isDeletingAccount}
              className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount || deleteConfirmText !== "DELETE"}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account Permanently</span>
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

