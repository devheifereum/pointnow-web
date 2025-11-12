"use client";

import React, { useState, useMemo, useEffect } from "react";
import { User, Phone, X, Plus, Search, Mail, Loader2 } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { customersApi } from "@/lib/api/customers";
import { transactionsApi } from "@/lib/api/transactions";
import { branchesApi } from "@/lib/api/branches";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { Customer } from "@/lib/types/customers";
import type { Branch } from "@/lib/types/branches";
import { Building2, ChevronDown } from "lucide-react";

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

  // Fetch branches on mount
  useEffect(() => {
    if (businessId) {
      fetchBranches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  // Fetch customers when search is opened
  useEffect(() => {
    if (showCustomerSearch && businessId) {
      fetchCustomers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCustomerSearch, businessId]);

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
    if (!businessId) return;

    setIsLoadingCustomers(true);
    setError(null);

    try {
      const response = await customersApi.getAll({
        business_id: businessId,
        limit: 100, // Get more customers for search
      });
      setCustomers(response.data.customers || []);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "Failed to load customers");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.phone_number?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

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
        phone_number: phoneValue || "",
        is_active: true,
        metadata: {},
        business: {
          business_id: businessId,
          branch_id: selectedBranchId,
          staff_id: staffId,
          metadata: {},
          is_active: true,
          total_points: 0,
        },
      });

      const newCustomer = response.data.customer;
      setCustomers((prev) => [...prev, newCustomer]);
      setCurrentCustomer(newCustomer);
      setShowNewCustomerForm(false);
      setShowCustomerSearch(false);
      setNewCustomerName("");
      setNewCustomerEmail("");
      setPhoneValue(undefined);
      setSearchQuery("");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "Failed to create customer");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setShowCustomerSearch(false);
    setSearchQuery("");
    setPointsInput("");
    setError(null);
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
      await transactionsApi.create({
        business_id: businessId,
        customer_id: currentCustomer.id,
        branch_id: selectedBranchId,
        amount: amount,
        is_active: true,
        metadata: {},
        type: type,
        employee_id: staffId,
      });

      // Refresh customer data to get updated points
      const customersResponse = await customersApi.getAll({
        business_id: businessId,
        limit: 100,
      });
      const updatedCustomers = customersResponse.data.customers || [];
      setCustomers(updatedCustomers);
      const updatedCustomer = updatedCustomers.find((c) => c.id === currentCustomer.id) || currentCustomer;
      setCurrentCustomer(updatedCustomer);
      setPointsInput("");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "Failed to process transaction");
      } else {
        setError("An unexpected error occurred");
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

      {error && (
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
                    {currentCustomer.points || 0}
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
            ) : showCustomerSearch ? (
              /* Customer Search */
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-gilroy-black text-black">Select Customer</h2>
                  <button
                    onClick={() => {
                      setShowCustomerSearch(false);
                      setSearchQuery("");
                    }}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-4 sm:mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or phone..."
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                    autoFocus
                  />
                </div>

                {/* Customer List */}
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
                        className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left border border-gray-200 hover:border-[#7bc74d]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-black">{customer.name}</p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {customer.phone_number || "-"}
                              </p>
                              {customer.email && (
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {customer.email}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-gilroy-extrabold text-[#7bc74d]">{customer.points || 0}</p>
                            <p className="text-xs text-gray-500">points</p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No customers found</p>
                      {searchQuery && (
                        <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* New Customer Form */
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-100">
                {showNewCustomerForm ? (
                  <div>
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-gilroy-black text-black">New Customer</h2>
                      <button
                        onClick={() => {
                          setShowNewCustomerForm(false);
                          setNewCustomerName("");
                          setPhoneValue(undefined);
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
                          <PhoneInput
                            placeholder="Enter phone number"
                            value={phoneValue}
                            onChange={setPhoneValue}
                            defaultCountry="MY"
                            className="w-full"
                            style={{
                              '--PhoneInput-color--focus': '#7bc74d',
                              '--PhoneInputCountryFlag-borderColor': 'transparent',
                              '--PhoneInputCountrySelectArrow-color': '#9ca3af',
                            }}
                            inputComponent={({ value, onChange, ...props }) => (
                              <input
                                {...props}
                                value={value}
                                onChange={onChange}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                              />
                            )}
                          />
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
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-gilroy-extrabold text-black mb-2">No Customer Selected</h3>
                    <p className="text-gray-600 mb-6">Select an existing customer or add a new one</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => {
                        setShowCustomerSearch(true);
                        setShowNewCustomerForm(false);
                      }}
                      disabled={!selectedBranchId}
                      className="bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg flex items-center gap-2 justify-center"
                    >
                      <Search className="w-5 h-5" />
                      Select Customer
                    </button>
                    <button
                      onClick={() => {
                        setShowNewCustomerForm(true);
                        setShowCustomerSearch(false);
                      }}
                      disabled={!selectedBranchId}
                      className="bg-white border-2 border-[#7bc74d] text-[#7bc74d] hover:bg-[#7bc74d] hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-400 font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg flex items-center gap-2 justify-center"
                    >
                      <Plus className="w-5 h-5" />
                      Add New Customer
                    </button>
                    </div>
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

