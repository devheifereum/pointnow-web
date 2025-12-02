"use client";

import React, { useState, useMemo, useEffect } from "react";
import { User, Phone, X, Plus, Search, Mail, Loader2 } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from "sonner";
import { customersApi } from "@/lib/api/customers";
import { transactionsApi } from "@/lib/api/transactions";
import { branchesApi } from "@/lib/api/branches";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { Customer } from "@/lib/types/customers";
import type { Branch } from "@/lib/types/branches";
import { Building2, ChevronDown } from "lucide-react";
import { convertPhoneNumber } from "@/lib/utils";

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
      {/* Page Header */}
      <div className="mb-4 sm:mb-6 pt-2 sm:pt-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-gilroy-black text-black mb-2">Dashboard</h1>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600">Manage customer points</p>
      </div>

      {/* Branch Selection */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Branch *
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            disabled={isLoadingBranches || branches.length === 0}
            className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black bg-white appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {isLoadingBranches ? (
              <option>Loading branches...</option>
            ) : branches.length === 0 ? (
              <option>No branches available</option>
            ) : (
              <>
                <option value="">-- Select a branch --</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </>
            )}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        {branches.length === 0 && !isLoadingBranches && (
          <p className="mt-1 text-xs text-amber-600">
            No branches found. Please create a branch first in the admin section.
          </p>
        )}
      </div>

      {/* Error Message - Show non-query errors outside cards */}
      {error && !error.toLowerCase().includes("query") && !error.toLowerCase().includes("search") && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
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
                  <p className="text-gray-700 text-xs sm:text-sm mb-2 font-medium">Current Points</p>
                  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-gilroy-black text-white">
                    {currentCustomer.total_points ?? currentCustomer.points ?? 0}
                  </p>
                </div>

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

          {/* Right Column - Keypad */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-100">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-gilroy-black text-black mb-4 sm:mb-6 text-center">
              {currentCustomer ? "Enter Points" : "Select Customer First"}
            </h2>

            {/* Points Display */}
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
          </div>
        </div>
      </div>
  );
}

