"use client";

import React, { useState, useMemo, useEffect } from "react";
import { User, Phone, X, Plus, Search, Mail, Loader2, Gift, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from "sonner";
import { customersApi } from "@/lib/api/customers";
import { transactionsApi } from "@/lib/api/transactions";
import { branchesApi } from "@/lib/api/branches";
import { rewardsApi, redemptionsApi } from "@/lib/api/rewards";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { Customer } from "@/lib/types/customers";
import type { Branch } from "@/lib/types/branches";
import type { PointReward } from "@/lib/types/rewards";
import { Building2, ChevronDown } from "lucide-react";
import { convertPhoneNumber } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RestaurantDashboardProps {
  restaurantName?: string;
}

export default function RestaurantDashboard({ restaurantName }: RestaurantDashboardProps) {
  // restaurantName is available but not currently used
  void restaurantName;

  const { user } = useAuthStore();
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [pointsInput, setPointsInput] = useState("");
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [phoneValue, setPhoneValue] = useState<string | undefined>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);

  const businessId = user?.businessId || "";
  // staff_id is the user's ID when they are staff/admin
  const staffId = user?.user?.id || "";

  // Mode state: "points" for add/subtract points, "rewards" for redeem rewards
  const [mode, setMode] = useState<"points" | "rewards">("points");

  // Rewards state
  const [rewards, setRewards] = useState<PointReward[]>([]);
  const [rewardSearchQuery, setRewardSearchQuery] = useState("");
  const [isLoadingRewards, setIsLoadingRewards] = useState(false);
  const [selectedReward, setSelectedReward] = useState<PointReward | null>(null);
  const [showRedeemConfirmDialog, setShowRedeemConfirmDialog] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

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

  // Fetch branches on mount
  useEffect(() => {
    if (businessId) {
      fetchBranches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  // Fetch rewards when switching to rewards mode or when search query changes
  useEffect(() => {
    if (mode === "rewards" && currentCustomer && businessId) {
      const timeoutId = setTimeout(() => {
        fetchRewards(rewardSearchQuery.trim() || undefined);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, rewardSearchQuery, businessId, currentCustomer]);

  // Fetch customers when search query changes (debounced)
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        fetchCustomers();
      }, 300); // Debounce search by 300ms

      return () => clearTimeout(timeoutId);
    } else if (searchQuery.trim().length === 0) {
      setCustomers([]);
      setShowCustomerSearch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchBranches = async () => {
    if (!businessId) return;

    setIsLoadingBranches(true);
    setError(null);

    try {
      const response = await branchesApi.getAll({
        business_id: businessId,
        limit: 100,
      });
      const branchesList = response.data.branches || [];
      setBranches(branchesList);
      // Auto-select first branch if available
      if (branchesList.length > 0 && !selectedBranchId) {
        setSelectedBranchId(branchesList[0].id);
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "Failed to load branches");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const fetchRewards = async (query?: string) => {
    if (!businessId) return;

    setIsLoadingRewards(true);

    try {
      const response = await rewardsApi.getByBusiness(businessId, {
        is_active: "true",
        limit: 100,
        query: query || undefined,
      });
      const rewardsList = response.data.point_rewards || [];
      setRewards(rewardsList);
    } catch (err) {
      if (err instanceof ApiClientError) {
        toast.error("Failed to load rewards", {
          description: err.message || "Could not fetch rewards",
        });
      } else {
        toast.error("Failed to load rewards", {
          description: "An unexpected error occurred",
        });
      }
    } finally {
      setIsLoadingRewards(false);
    }
  };

  const handleRedeemReward = async () => {
    if (!selectedReward || !currentCustomer || !staffId || !selectedBranchId) {
      setError("Please select a branch first");
      return;
    }

    setIsRedeeming(true);

    try {
      await redemptionsApi.createWithCustomerId({
        customer_id: currentCustomer.id,
        point_reward_id: selectedReward.id,
        employee_id: staffId,
        branch_id: selectedBranchId,
      });

      // Calculate new points after redemption
      const currentPoints = currentCustomer.total_points ?? currentCustomer.points ?? 0;
      const newPoints = currentPoints - selectedReward.points_cost;

      toast.success(`Successfully redeemed "${selectedReward.name}"!`, {
        description: `${selectedReward.points_cost} points deducted. Customer now has ${newPoints} points.`,
        duration: 5000,
      });

      // Reset states
      setShowRedeemConfirmDialog(false);
      setSelectedReward(null);
      setCurrentCustomer(null);
      setMode("points");
      setRewardSearchQuery("");
      setSearchQuery("");
      setShowCustomerSearch(false);
    } catch (err) {
      if (err instanceof ApiClientError) {
        toast.error("Failed to redeem reward", {
          description: err.message || "Could not complete redemption",
        });
      } else {
        toast.error("Failed to redeem reward", {
          description: "An unexpected error occurred",
        });
      }
    } finally {
      setIsRedeeming(false);
    }
  };

  const fetchCustomers = async () => {
    if (!searchQuery.trim()) return;

    setIsLoadingCustomers(true);
    setError(null);

    try {
      const response = await customersApi.search({
        query: searchQuery.trim(),
        limit: 100,
      });
      const customersList = response.data.customers || [];
      setCustomers(customersList);
      setShowCustomerSearch(customersList.length > 0 || searchQuery.trim().length > 0);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "Failed to load customers");
      } else {
        setError("An unexpected error occurred");
      }
      setShowCustomerSearch(true);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Customers are already filtered by the API search endpoint
  const filteredCustomers = customers;

  const handleNumberClick = (num: string) => {
    if (pointsInput.length < 10) {
      setPointsInput((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setPointsInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPointsInput("");
  };

  const handleAddCustomer = async () => {
    if (!newCustomerName.trim() || !newCustomerEmail.trim() || !phoneValue?.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!businessId || !staffId || !selectedBranchId) {
      setError("Please select a branch first");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await customersApi.createWithUser({
        name: newCustomerName.trim(),
        email: newCustomerEmail.trim(),
        phone_number: convertPhoneNumber(phoneValue?.trim() || ""),
        is_active: true,
        metadata: {},
        business: {
          business_id: businessId,
          branch_id: selectedBranchId,
          employee_id: staffId,
          metadata: {},
          is_active: true,
          total_points: 0,
        },
      });

      const newCustomer = response.data.customer;
      setCurrentCustomer(newCustomer);
      setShowNewCustomerForm(false);
      setShowCustomerSearch(false);
      setNewCustomerName("");
      setNewCustomerEmail("");
      setPhoneValue(undefined);
      setSearchQuery("");
      setPointsInput("");

      toast.success("Customer created successfully!", {
        description: `${newCustomer.name} has been added`,
        duration: 4000,
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Use the server's error message directly
        const errorMessage = err.message || "Failed to create customer";
        setError(errorMessage);
        toast.error("Failed to create customer", {
          description: errorMessage,
        });
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        toast.error("Failed to create customer", {
          description: errorMessage,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectCustomer = async (customer: Customer) => {
    if (!businessId || !staffId || !selectedBranchId) {
      setError("Please select a branch first");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Check if customer already has a customer_business entry for this business
      const existingCustomerBusiness = customer.customer_businesses?.find(
        (cb) => cb.business.id === businessId
      );

      if (existingCustomerBusiness) {
        // Customer already registered with this business - use existing data
        const customerWithPoints: Customer = {
          ...customer,
          total_points: existingCustomerBusiness.total_points,
          points: existingCustomerBusiness.total_points,
        };
        setCurrentCustomer(customerWithPoints);
        setShowCustomerSearch(false);
        setSearchQuery("");
        setPointsInput("");
        setError(null);

        toast.success("Customer selected!", {
          description: `${customer.name} is already registered with your business`,
          duration: 4000,
        });
      } else {
        // Customer not registered with this business - register them
        const response = await customersApi.createWithUser({
          name: customer.name,
          email: customer.email || "",
          phone_number: customer.phone_number || "",
          is_active: true,
          metadata: {},
          business: {
            business_id: businessId,
            branch_id: selectedBranchId,
            employee_id: staffId,
            metadata: {},
            is_active: true,
            total_points: 0,
          },
        });

        const registeredCustomer = response.data.customer;
        setCurrentCustomer(registeredCustomer);
        setShowCustomerSearch(false);
        setSearchQuery("");
        setPointsInput("");
        setError(null);

        toast.success("Customer registered successfully!", {
          description: `${customer.name} has been registered to your business`,
          duration: 4000,
        });
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Use the server's error message directly
        const errorMessage = err.message || "Failed to register customer";
        setError(errorMessage);
        toast.error("Failed to register customer", {
          description: errorMessage,
        });
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        toast.error("Failed to register customer", {
          description: errorMessage,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCustomer = () => {
    setCurrentCustomer(null);
    setPointsInput("");
    setShowCustomerSearch(false);
    setShowNewCustomerForm(false);
    setSearchQuery("");
  };

  const handlePrevious = () => {
    // Clear customer selection and go back to Step 1
    handleClearCustomer();
    setSelectedReward(null);
    setRewardSearchQuery("");
  };

  const createTransaction = async (amount: number, type: "EARN" | "REDEEM") => {
    if (!currentCustomer || !businessId || !staffId || !selectedBranchId) {
      setError("Please select a branch first");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create the transaction
      await transactionsApi.create({
        business_id: businessId,
        customer_id: currentCustomer.id,
        branch_id: selectedBranchId,
        amount: amount,
        employee_id: staffId,
      });

      // Calculate the new points (current points + transaction amount)
      const currentPoints = currentCustomer.total_points ?? currentCustomer.points ?? 0;
      const finalPoints = currentPoints + amount;

      // Show success toast IMMEDIATELY after transaction succeeds (most important)
      if (type === "EARN") {
        toast.success(`Successfully added ${Math.abs(amount)} points!`, {
          description: `Customer now has ${finalPoints} points`,
          duration: 4000,
        });
      } else {
        toast.success(`Successfully subtracted ${Math.abs(amount)} points!`, {
          description: `Customer now has ${finalPoints} points`,
          duration: 4000,
        });
      }

      // Reset customer selection and input after showing toast
      setCurrentCustomer(null);
      setPointsInput("");
      setSearchQuery("");
      setShowCustomerSearch(false); // Close the customer search dropdown

      // Refetch customers to refresh the list (use getAll since query is reset)
      try {
        const customersResponse = await customersApi.getAll({
          business_id: businessId,
          limit: 100,
        });
        const updatedCustomers = customersResponse.data.customers || [];
        setCustomers(updatedCustomers);
      } catch {
        // Silently fail refresh - transaction already succeeded
        console.log("Failed to refresh customer list, but transaction succeeded");
      }
    } catch (err) {
      // Only show error if the transaction itself failed
      if (err instanceof ApiClientError) {
        // Use the server's error message directly
        const errorMessage = err.message || "Failed to process transaction";
        setError(errorMessage);
        toast.error("Transaction failed", {
          description: errorMessage,
        });
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        toast.error("Transaction failed", {
          description: errorMessage,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddPoints = () => {
    if (currentCustomer && pointsInput) {
      const pointsToAdd = parseInt(pointsInput);
      if (pointsToAdd > 0) {
        createTransaction(pointsToAdd, "EARN");
      }
    }
  };

  const handleSubtractPoints = () => {
    if (currentCustomer && pointsInput) {
      const pointsToSubtract = parseInt(pointsInput);
      if (pointsToSubtract > 0) {
        createTransaction(-pointsToSubtract, "REDEEM");
      }
    }
  };

  return (
    <div>
      {/* Page Header with Timeline */}
      <div className="mb-4 sm:mb-6 pt-2 sm:pt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-gilroy-black text-black mb-1">Dashboard</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">Manage customer points</p>
        </div>
        
        {/* Compact Timeline */}
        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 shadow-sm border border-gray-100">
          {/* Step 1 */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <div className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentCustomer 
                ? "bg-[#7bc74d] shadow-sm" 
                : "bg-[#7bc74d] ring-2 ring-[#7bc74d]/30"
            }`}>
              {currentCustomer ? (
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
              ) : (
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-white">1</span>
              )}
            </div>
            <span className={`hidden sm:inline text-[9px] sm:text-[10px] md:text-xs font-medium transition-colors ${
              currentCustomer ? "text-[#7bc74d] font-semibold" : "text-gray-600"
            }`}>Customer</span>
          </div>
          
          {/* Connector 1 */}
          <div className={`w-2 sm:w-3 md:w-4 h-0.5 rounded-full transition-all duration-300 ${
            currentCustomer ? "bg-[#7bc74d]" : "bg-gray-200"
          }`} />
          
          {/* Step 2 */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <div className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentCustomer && (pointsInput || selectedReward)
                ? "bg-[#7bc74d] shadow-sm"
                : currentCustomer
                ? "bg-[#7bc74d]/80 ring-2 ring-[#7bc74d]/30"
                : "bg-gray-200"
            }`}>
              {currentCustomer && (pointsInput || selectedReward) ? (
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
              ) : currentCustomer ? (
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-white">2</span>
              ) : (
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-400">2</span>
              )}
            </div>
            <span className={`hidden sm:inline text-[9px] sm:text-[10px] md:text-xs font-medium transition-colors ${
              currentCustomer && (pointsInput || selectedReward) 
                ? "text-[#7bc74d] font-semibold" 
                : currentCustomer 
                ? "text-[#7bc74d]/80" 
                : "text-gray-400"
            }`}>Points</span>
          </div>
          
          {/* Connector 2 */}
          <div className={`w-2 sm:w-3 md:w-4 h-0.5 rounded-full transition-all duration-300 ${
            currentCustomer && (pointsInput || selectedReward) ? "bg-[#7bc74d]" : "bg-gray-200"
          }`} />
          
          {/* Step 3 */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-all duration-300 bg-gray-200">
              <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-400">3</span>
            </div>
            <span className="hidden sm:inline text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-400">Done</span>
          </div>
        </div>
      </div>

      {/* Branch Selection with Next Button */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
          Select Branch *
        </label>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Branch Dropdown */}
          <div className="relative flex-1 min-w-0 max-w-xs sm:max-w-sm md:max-w-md">
            <Building2 className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 z-10" />
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              disabled={isLoadingBranches || branches.length === 0}
              className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black bg-white appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed truncate"
            >
              {isLoadingBranches ? (
                <option>Loading...</option>
              ) : branches.length === 0 ? (
                <option>No branches</option>
              ) : (
                <>
                  <option value="">Select branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </>
              )}
            </select>
            <ChevronDown className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Spacer to push buttons to right */}
          <div className="flex-1" />
          
          {/* Previous Button - Only show on Step 2+ (when customer is selected) */}
          {currentCustomer && (
            <button
              onClick={handlePrevious}
              className="flex-shrink-0 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm md:text-base"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span>Previous</span>
            </button>
          )}
          
          {/* Next Button */}
          <button
            disabled={!selectedBranchId || !currentCustomer}
            className="flex-shrink-0 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-200 disabled:cursor-not-allowed text-white disabled:text-gray-400 font-semibold px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm md:text-base"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
        </div>
        {branches.length === 0 && !isLoadingBranches && (
          <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-amber-600">
            No branches found. Please create a branch first.
          </p>
        )}
      </div>

      {/* Error Message - Show non-query errors outside cards */}
      {error && !error.toLowerCase().includes("query") && !error.toLowerCase().includes("search") && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className={`grid grid-cols-1 ${currentCustomer ? 'lg:grid-cols-2' : ''} gap-4 sm:gap-6 lg:gap-8 transition-all duration-300`}>
        {/* Left Column - Customer Info */}
        <div className="space-y-4 sm:space-y-6">
          {/* Customer Display */}
          {currentCustomer ? (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-100">
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-gilroy-black text-black truncate">{currentCustomer.name}</h2>
                      <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1 truncate">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{currentCustomer.phone_number || "-"}</span>
                      </p>
                      {currentCustomer.email && (
                        <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{currentCustomer.email}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClearCustomer}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </button>
              </div>

              {/* Points Display */}
              <div className="bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl p-4 sm:p-5 md:p-6 text-center mb-4 sm:mb-6">
                <p className="text-white text-xs sm:text-sm mb-2 font-medium">Current Points</p>
                <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-gilroy-black text-white">
                  {currentCustomer.total_points ?? currentCustomer.points ?? 0}
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2 mb-4 sm:mb-6">
                <button
                  onClick={() => {
                    setMode("points");
                    setSelectedReward(null);
                    setRewardSearchQuery("");
                  }}
                  className={`flex-1 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-colors ${mode === "points"
                    ? "bg-[#7bc74d] text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Add/Subtract Points
                </button>
                <button
                  onClick={() => {
                    setMode("rewards");
                    setPointsInput("");
                  }}
                  className={`flex-1 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 ${mode === "rewards"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <Gift className="w-4 h-4" />
                  Redeem Reward
                </button>
              </div>

              {/* Points Mode */}
              {mode === "points" && (
                <>
                  {/* Points Input Display */}
                  {pointsInput && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Entered Points</p>
                      <div className="bg-gray-50 rounded-xl p-4 border-2 border-[#7bc74d]">
                        <p className="text-3xl font-gilroy-extrabold text-black text-center">
                          {pointsInput}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {pointsInput && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <button
                        onClick={handleAddPoints}
                        disabled={isProcessing || !selectedBranchId}
                        className="bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="hidden sm:inline">Processing...</span>
                          </>
                        ) : (
                          "Add Points"
                        )}
                      </button>
                      <button
                        onClick={handleSubtractPoints}
                        disabled={isProcessing || !selectedBranchId}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="hidden sm:inline">Processing...</span>
                          </>
                        ) : (
                          "Subtract"
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Rewards Mode */}
              {mode === "rewards" && (
                <div className="space-y-4">
                  {/* Reward Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      type="text"
                      value={rewardSearchQuery}
                      onChange={(e) => setRewardSearchQuery(e.target.value)}
                      placeholder="Search rewards..."
                      className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder-gray-400"
                    />
                  </div>

                  {/* Rewards List */}
                  <div className="space-y-2 max-h-64 sm:max-h-80 overflow-y-auto">
                    {isLoadingRewards ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                        <span className="ml-3 text-gray-600">Loading rewards...</span>
                      </div>
                    ) : rewards.length > 0 ? (
                      rewards.map((reward) => {
                        const customerPoints = currentCustomer.total_points ?? currentCustomer.points ?? 0;
                        const canRedeem = customerPoints >= reward.points_cost;

                        return (
                          <button
                            key={reward.id}
                            onClick={() => {
                              if (canRedeem) {
                                setSelectedReward(reward);
                                setShowRedeemConfirmDialog(true);
                              }
                            }}
                            disabled={!canRedeem}
                            className={`w-full p-4 rounded-xl transition-colors text-left border ${canRedeem
                              ? "bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-400"
                              : "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${canRedeem
                                ? "bg-gradient-to-br from-purple-500 to-purple-700"
                                : "bg-gray-300"
                                }`}>
                                <Gift className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-semibold truncate ${canRedeem ? "text-black" : "text-gray-500"}`}>
                                  {reward.name}
                                </p>
                                {reward.description && (
                                  <p className="text-sm text-gray-500 truncate">{reward.description}</p>
                                )}
                                <p className={`text-sm font-medium ${canRedeem ? "text-purple-600" : "text-red-500"
                                  }`}>
                                  {reward.points_cost} points
                                  {!canRedeem && (
                                    <span className="ml-2 text-xs text-red-400">
                                      (Need {reward.points_cost - customerPoints} more)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No rewards available</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {rewardSearchQuery ? "Try a different search term" : "Check back later for new rewards"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Back to Points Button */}
                  <button
                    onClick={() => {
                      setMode("points");
                      setRewardSearchQuery("");
                    }}
                    className="w-full py-2.5 rounded-xl font-medium text-sm text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Points
                  </button>
                </div>
              )}
            </div>
          ) : showNewCustomerForm ? (
            /* New Customer Form */
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-gilroy-black text-black">New Customer</h2>
                <button
                  onClick={() => {
                    setShowNewCustomerForm(false);
                    setNewCustomerName("");
                    setNewCustomerEmail("");
                    setPhoneValue(undefined);
                    setSearchQuery("");
                  }}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={newCustomerEmail}
                      onChange={(e) => setNewCustomerEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <style dangerouslySetInnerHTML={{
                      __html: `
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
                </div>

                <button
                  onClick={handleAddCustomer}
                  disabled={!newCustomerName.trim() || !newCustomerEmail.trim() || !phoneValue?.trim() || !selectedBranchId || isProcessing}
                  className="w-full bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Add Customer"
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Customer Search - Always visible */
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-gilroy-black text-black">Search Customer</h2>
              </div>

              {/* Error Message - Query related errors inside the card */}
              {error && (error.toLowerCase().includes("query") || error.toLowerCase().includes("search")) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Search Input with Add Button */}
              <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.trim().length > 0) {
                        setShowCustomerSearch(true);
                      }
                    }}
                    placeholder="Search by name, email, or phone..."
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => {
                    // Auto-fill phone number if search query looks like a phone number
                    if (searchQuery.trim() && /^\d+$/.test(searchQuery.trim())) {
                      // Convert to E.164 format for PhoneInput
                      const phoneNum = searchQuery.trim();
                      if (phoneNum.startsWith('0')) {
                        setPhoneValue(`+60${phoneNum.substring(1)}`);
                      } else if (phoneNum.startsWith('60')) {
                        setPhoneValue(`+${phoneNum}`);
                      } else {
                        setPhoneValue(`+60${phoneNum}`);
                      }
                    }
                    setShowNewCustomerForm(true);
                    setShowCustomerSearch(false);
                  }}
                  disabled={!selectedBranchId}
                  className="bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-colors shadow-lg flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                  title={!selectedBranchId ? "Please select a branch first" : "Add new customer"}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>

              {/* Numpad */}
              <div className="mb-4 sm:mb-6">
                <div className="space-y-2 sm:space-y-3">
                  {/* Number Row 1 */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setSearchQuery((prev) => {
                            const newQuery = prev + num.toString();
                            if (prev.length === 0) {
                              setShowCustomerSearch(true);
                            }
                            return newQuery;
                          });
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-black font-gilroy-extrabold text-xl sm:text-2xl py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl transition-colors shadow-sm active:scale-95"
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Number Row 2 */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setSearchQuery((prev) => {
                            const newQuery = prev + num.toString();
                            if (prev.length === 0) {
                              setShowCustomerSearch(true);
                            }
                            return newQuery;
                          });
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-black font-gilroy-extrabold text-xl sm:text-2xl py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl transition-colors shadow-sm active:scale-95"
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Number Row 3 */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[7, 8, 9].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setSearchQuery((prev) => {
                            const newQuery = prev + num.toString();
                            if (prev.length === 0) {
                              setShowCustomerSearch(true);
                            }
                            return newQuery;
                          });
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-black font-gilroy-extrabold text-xl sm:text-2xl py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl transition-colors shadow-sm active:scale-95"
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Bottom Row: Clear, 0, Backspace */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setShowCustomerSearch(false);
                      }}
                      className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold text-base sm:text-lg py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl transition-colors shadow-sm active:scale-95"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery((prev) => {
                          const newQuery = prev + "0";
                          if (prev.length === 0) {
                            setShowCustomerSearch(true);
                          }
                          return newQuery;
                        });
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-black font-gilroy-extrabold text-xl sm:text-2xl py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl transition-colors shadow-sm active:scale-95"
                    >
                      0
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery((prev) => {
                          const newQuery = prev.slice(0, -1);
                          if (newQuery.length === 0) {
                            setShowCustomerSearch(false);
                          }
                          return newQuery;
                        });
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-black font-semibold text-base sm:text-lg py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl transition-colors shadow-sm active:scale-95"
                    >
                      ⌫
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer List or Add New Button */}
              {showCustomerSearch && (
                <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
                  {isLoadingCustomers ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-[#7bc74d]" />
                      <span className="ml-3 text-gray-600">Loading customers...</span>
                    </div>
                  ) : filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        onClick={() => handleSelectCustomer(customer)}
                        disabled={isProcessing || !selectedBranchId}
                        className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left border border-gray-200 hover:border-[#7bc74d] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-black truncate">{customer.name}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1 truncate">
                              <Phone className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{customer.phone_number || "-"}</span>
                            </p>
                            {customer.email && (
                              <p className="text-sm text-gray-600 flex items-center gap-1 truncate">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{customer.email}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : searchQuery.trim().length > 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No customers found</p>
                      <button
                        onClick={() => {
                          // Auto-fill phone number if search query looks like a phone number
                          if (searchQuery.trim() && /^\d+$/.test(searchQuery.trim())) {
                            // Convert to E.164 format for PhoneInput
                            const phoneNum = searchQuery.trim();
                            if (phoneNum.startsWith('0')) {
                              setPhoneValue(`+60${phoneNum.substring(1)}`);
                            } else if (phoneNum.startsWith('60')) {
                              setPhoneValue(`+${phoneNum}`);
                            } else {
                              setPhoneValue(`+60${phoneNum}`);
                            }
                          }
                          setShowNewCustomerForm(true);
                          setShowCustomerSearch(false);
                        }}
                        disabled={!selectedBranchId}
                        className="bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg flex items-center gap-2 justify-center mx-auto"
                      >
                        <Plus className="w-5 h-5" />
                        Add New Customer
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Keypad - Only show when customer is selected */}
        {currentCustomer && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-100">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-gilroy-black text-black mb-4 sm:mb-6 text-center">
              {mode === "rewards"
                ? "Select a Reward"
                : "Enter Points"}
            </h2>

          {/* Points Display - Show in points mode */}
          {mode === "points" && (
            <>
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 border-2 border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-2 text-center">Points</p>
                <p className="text-3xl sm:text-4xl md:text-5xl font-gilroy-black text-black text-center">
                  {pointsInput || "0"}
                </p>
              </div>

              {/* Keypad */}
              <div className="space-y-2 sm:space-y-3">
                {/* Number Row 1 */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {["1", "2", "3"].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleNumberClick(num)}
                      disabled={!currentCustomer}
                      className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 text-black font-gilroy-extrabold text-xl sm:text-2xl py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl transition-colors shadow-sm active:scale-95"
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Number Row 2 */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {["4", "5", "6"].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleNumberClick(num)}
                      disabled={!currentCustomer}
                      className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 text-black font-gilroy-extrabold text-xl sm:text-2xl py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl transition-colors shadow-sm active:scale-95"
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Number Row 3 */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {["7", "8", "9"].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleNumberClick(num)}
                      disabled={!currentCustomer}
                      className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 text-black font-gilroy-extrabold text-xl sm:text-2xl py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl transition-colors shadow-sm active:scale-95"
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    onClick={handleClear}
                    disabled={!currentCustomer || !pointsInput}
                    className="bg-red-100 hover:bg-red-200 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 text-red-600 font-semibold text-base sm:text-lg py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl transition-colors shadow-sm active:scale-95"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => handleNumberClick("0")}
                    disabled={!currentCustomer}
                    className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 text-black font-gilroy-extrabold text-xl sm:text-2xl py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl transition-colors shadow-sm active:scale-95"
                  >
                    0
                  </button>
                  <button
                    onClick={handleBackspace}
                    disabled={!currentCustomer || !pointsInput}
                    className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 text-black font-semibold text-base sm:text-lg py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg sm:rounded-xl transition-colors shadow-sm active:scale-95"
                  >
                    ⌫
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Rewards Mode Info */}
          {mode === "rewards" && currentCustomer && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-10 h-10 text-purple-600" />
              </div>
              <p className="text-gray-600 mb-2">
                Browse available rewards on the left panel
              </p>
              <p className="text-sm text-gray-400">
                Select a reward to redeem for {currentCustomer.name}
              </p>
            </div>
          )}
          </div>
        )}
      </div>

      {/* Redeem Confirmation Dialog */}
      <Dialog open={showRedeemConfirmDialog} onOpenChange={setShowRedeemConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-gilroy-black">Confirm Redemption</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this reward?
            </DialogDescription>
          </DialogHeader>

          {selectedReward && currentCustomer && (
            <div className="py-4 space-y-4">
              {/* Customer Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-black">{currentCustomer.name}</p>
                  <p className="text-sm text-gray-600">
                    Current Points: {currentCustomer.total_points ?? currentCustomer.points ?? 0}
                  </p>
                </div>
              </div>

              {/* Reward Info */}
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-black">{selectedReward.name}</p>
                  {selectedReward.description && (
                    <p className="text-sm text-gray-600">{selectedReward.description}</p>
                  )}
                  <p className="text-sm font-medium text-purple-600">
                    -{selectedReward.points_cost} points
                  </p>
                </div>
              </div>

              {/* Points After Redemption */}
              <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-gray-600">Points after redemption:</p>
                <p className="text-2xl font-gilroy-black text-green-600">
                  {(currentCustomer.total_points ?? currentCustomer.points ?? 0) - selectedReward.points_cost}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => {
                setShowRedeemConfirmDialog(false);
                setSelectedReward(null);
              }}
              disabled={isRedeeming}
              className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRedeemReward}
              disabled={isRedeeming}
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRedeeming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redeeming...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  Confirm Redemption
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

