"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Loader2,
  MessageSquare,
  Wallet,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Mail,
  Phone,
  User,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Code,
  Eye,
  Plus,
} from "lucide-react";
import { customersApi } from "@/lib/api/customers";
import { walletApi } from "@/lib/api/wallet";
import { configTypesApi } from "@/lib/api/config-types";
import { blastApi } from "@/lib/api/blast";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import { toast } from "sonner";
import type { Customer } from "@/lib/types/customers";
import type { UsageCache } from "@/lib/types/wallet";
import type { ConfigType } from "@/lib/types/config-types";
import type { BlastVariable } from "@/lib/types/blast";

interface MessageBlastingProps {
  restaurantName?: string;
}

export default function MessageBlasting({ restaurantName: _restaurantName }: MessageBlastingProps) {
  const { user } = useAuthStore();
  const businessId = user?.businessId || "";

  // State for customers
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  // Store selected customers with their full data (including phone numbers) to handle pagination
  const [selectedCustomersData, setSelectedCustomersData] = useState<Map<string, Customer>>(new Map());
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });

  // State for wallet balance
  const [usageCaches, setUsageCaches] = useState<UsageCache[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // State for config types (rates)
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [selectedConfigType, setSelectedConfigType] = useState<ConfigType | null>(null);

  // State for message
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // State for variables
  const [variables, setVariables] = useState<BlastVariable[]>([]);
  const [isLoadingVariables, setIsLoadingVariables] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  
  // Step state
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Fetch customers with pagination
  const fetchCustomers = useCallback(async (page: number, query: string) => {
    if (!businessId) return;

    setIsLoadingCustomers(true);
    try {
      let response;
      
      // Use search API if there's a search query, otherwise use getByBusiness
      if (query.trim()) {
        response = await customersApi.search({
          query: query.trim(),
          business_id: businessId,
          page: page,
          limit: pagination.limit,
        });
      } else {
        response = await customersApi.getByBusiness(businessId, {
          page: page,
          limit: pagination.limit,
        });
      }

      setCustomers(response.data?.customers || []);
      const metadata = response.data?.metadata || {};
      const total = metadata.total || 0;
      
      setPagination((prev) => {
        const limit = metadata.limit || prev.limit;
        // Calculate total_pages if not provided by API
        const calculatedTotalPages = metadata.total_pages || (total > 0 ? Math.ceil(total / limit) : 0);
        
        return {
          ...prev,
          page: metadata.page || page,
          limit: limit,
          total: total,
          total_pages: calculatedTotalPages,
          has_next: metadata.has_next !== undefined ? metadata.has_next : (page * limit < total),
          has_previous: metadata.has_previous !== undefined ? metadata.has_previous : (page > 1),
        };
      });
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setIsLoadingCustomers(false);
    }
  }, [businessId, pagination.limit]);

  // Fetch wallet balance
  const fetchUsageCaches = useCallback(async () => {
    if (!businessId) return;

    setIsLoadingBalance(true);
    try {
      const response = await walletApi.getUsageCaches({
        business_id: businessId,
        page: 1,
        limit: 10,
        with_business: true,
        with_config_type: true,
      });
      setUsageCaches(response.data?.usage_caches || []);
    } catch (err) {
      console.error("Failed to load wallet balance:", err);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [businessId]);

  // Fetch config types (rates)
  const fetchConfigTypes = useCallback(async () => {
    setIsLoadingRates(true);
    try {
      const response = await configTypesApi.getAll({
        name: "SMS",
        page: 1,
        limit: 10,
      });
      const types = response.data?.config_types || [];
      if (types.length > 0) {
        setSelectedConfigType(types[0]);
      }
    } catch (err) {
      console.error("Failed to load config types:", err);
    } finally {
      setIsLoadingRates(false);
    }
  }, []);

  // Fetch available variables
  const fetchVariables = useCallback(async () => {
    setIsLoadingVariables(true);
    try {
      const response = await blastApi.getVariables();
      setVariables(response.data?.variables || []);
    } catch (err) {
      console.error("Failed to load variables:", err);
      toast.error("Failed to load variables", {
        description: "Some features may not be available",
      });
    } finally {
      setIsLoadingVariables(false);
    }
  }, []);

  useEffect(() => {
    if (businessId) {
      fetchUsageCaches();
      fetchConfigTypes();
      fetchVariables();
    }
  }, [businessId, fetchUsageCaches, fetchConfigTypes, fetchVariables]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [searchQuery]);

  // Fetch customers when page changes or search query changes (debounced)
  useEffect(() => {
    if (!businessId) return;

    const timeoutId = setTimeout(() => {
      fetchCustomers(pagination.page, searchQuery);
    }, searchQuery.trim() ? 300 : 0); // Debounce search by 300ms

    return () => clearTimeout(timeoutId);
  }, [businessId, pagination.page, searchQuery, fetchCustomers]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    // Scroll to top of customer list when page changes
    const customerListElement = document.querySelector('[data-customer-list]');
    if (customerListElement) {
      customerListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Use customers directly (already filtered by API if searching)
  const filteredCustomers = customers;

  // Helper function to get customer points
  const getCustomerPoints = (customer: Customer): number => {
    // First check if customer_businesses exists and find the matching business
    if (customer.customer_businesses && customer.customer_businesses.length > 0) {
      const customerBusiness = customer.customer_businesses.find(
        (cb) => cb.business?.id === businessId
      );
      if (customerBusiness) {
        return customerBusiness.total_points || 0;
      }
    }
    // Fallback to total_points if available
    return customer.total_points || customer.points || 0;
  };

  // Toggle customer selection
  const toggleCustomerSelection = (customer: Customer) => {
    const customerId = customer.id;
    setSelectedCustomers((prev) => {
      if (prev.includes(customerId)) {
        // Remove from selection
        setSelectedCustomersData((prevData) => {
          const newData = new Map(prevData);
          newData.delete(customerId);
          return newData;
        });
        return prev.filter((id) => id !== customerId);
      } else {
        // Add to selection - store full customer data
        setSelectedCustomersData((prevData) => {
          const newData = new Map(prevData);
          newData.set(customerId, customer);
          return newData;
        });
        return [...prev, customerId];
      }
    });
  };

  // Select all customers
  const selectAllCustomers = () => {
    // Check if all current page customers are selected
    const allCurrentPageSelected = filteredCustomers.every((c) =>
      selectedCustomers.includes(c.id)
    );

    if (allCurrentPageSelected && filteredCustomers.length > 0) {
      // Deselect all current page customers - remove only current page customers from the map and array
      setSelectedCustomersData((prevData) => {
        const newData = new Map(prevData);
        filteredCustomers.forEach((c) => newData.delete(c.id));
        return newData;
      });
      setSelectedCustomers((prev) =>
        prev.filter((id) => !filteredCustomers.some((c) => c.id === id))
      );
    } else {
      // Select all current page customers - add current page customers to the map
      setSelectedCustomersData((prevData) => {
        const newData = new Map(prevData);
        filteredCustomers.forEach((c) => {
          newData.set(c.id, c);
        });
        return newData;
      });
      setSelectedCustomers((prev) => {
        const currentPageIds = filteredCustomers.map((c) => c.id);
        // Add current page IDs that aren't already selected
        const newIds = currentPageIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      });
    }
  };


  // Get current balance
  const currentBalance = usageCaches.length > 0 ? usageCaches[0].balance : 0;

  // Calculate customers with phone numbers from stored data
  const selectedCustomersWithPhone = Array.from(selectedCustomersData.values()).filter(
    (c) => c.phone_number && c.phone_number.trim() !== ""
  );

  // Check if balance is sufficient - calculate total cost (number of messages × cost per message)
  const totalCost = selectedConfigType 
    ? selectedCustomersWithPhone.length * selectedConfigType.charge
    : 0;
  const hasSufficientBalance = selectedConfigType 
    ? currentBalance >= totalCost
    : false;

  // Handle send message
  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    if (selectedCustomers.length === 0) {
      setError("Please select at least one customer");
      return;
    }

    if (!hasSufficientBalance) {
      setError("Insufficient balance. Please top up your wallet.");
      return;
    }

    // Get phone numbers from selected customers using the stored data map
    // This ensures we get all selected customers regardless of pagination
    const phoneNumbers = Array.from(selectedCustomersData.values())
      .map((c) => c.phone_number)
      .filter((phone): phone is string => !!phone && phone.trim() !== "");

    if (phoneNumbers.length === 0) {
      setError("Selected customers don't have phone numbers. Please select customers with phone numbers.");
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await blastApi.sendOTP({
        message: message.trim(),
        phone_numbers: phoneNumbers,
        business_id: businessId,
      });

      // Success - Show toast notification
      toast.success("Message sent successfully!", {
        description: `Your message has been sent to ${phoneNumbers.length} customer${phoneNumbers.length !== 1 ? 's' : ''}.`,
        duration: 5000,
      });

      // Clear form
      setMessage("");
      setSelectedCustomers([]);
      setSelectedCustomersData(new Map());
      setError(null);
      setSuccessMessage(null);
      
      // Refresh balance after sending
      await fetchUsageCaches();
    } catch (err) {
      console.error("Failed to send message:", err);
      
      // Show error toast notification
      let errorMessage = "Failed to send message. Please try again.";
      if (err instanceof ApiClientError) {
        errorMessage = err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error("Failed to send message", {
        description: errorMessage,
        duration: 5000,
      });

      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  // Handle step navigation
  const handleNextStep = () => {
    if (selectedCustomers.length === 0) {
      setError("Please select at least one customer");
      return;
    }
    
    // Check if selected customers have phone numbers
    const selectedCustomerData = customers.filter((c) =>
      selectedCustomers.includes(c.id)
    );
    const withPhone = selectedCustomerData.filter(
      (c) => c.phone_number && c.phone_number.trim() !== ""
    ).length;
    
    if (withPhone === 0) {
      setError("Selected customers don't have phone numbers. Please select customers with phone numbers.");
      return;
    }
    
    setError(null);
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
    setError(null);
  };

  // Insert variable at cursor position
  const insertVariable = (variable: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentMessage = message;
    
    const newMessage = 
      currentMessage.substring(0, start) + 
      variable + 
      currentMessage.substring(end);
    
    setMessage(newMessage);
    
    // Set cursor position after inserted variable
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = start + variable.length;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Highlight variables in message preview
  const renderMessagePreview = (text: string) => {
    if (!text) return null;
    
    const parts: Array<{ text: string; isVariable: boolean }> = [];
    let lastIndex = 0;
    const variablePattern = /\{(\w+)\}/g;
    let match;
    
    while ((match = variablePattern.exec(text)) !== null) {
      // Add text before variable
      if (match.index > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, match.index),
          isVariable: false,
        });
      }
      
      // Add variable
      parts.push({
        text: match[0],
        isVariable: true,
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        isVariable: false,
      });
    }
    
    return parts.map((part, index) => {
      if (part.isVariable) {
        const variable = variables.find(v => v.variable === part.text);
        return (
          <span
            key={index}
            className="inline-block px-2 py-1 mx-0.5 rounded-md bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-semibold text-sm border border-blue-200"
            title={variable?.description || "Variable"}
          >
            {part.text}
          </span>
        );
      }
      return <span key={index}>{part.text}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7bc74d] to-[#5da336] flex items-center justify-center shadow-lg shadow-[#7bc74d]/20">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-gilroy-black text-gray-900">
                Message Blasting
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Send personalized messages to your customers
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-[#7bc74d]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= 1 
                  ? 'bg-[#7bc74d] text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-sm font-medium">Select Customers</span>
            </div>
            <div className={`flex-1 h-0.5 ${currentStep >= 2 ? 'bg-[#7bc74d]' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-[#7bc74d]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= 2 
                  ? 'bg-[#7bc74d] text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Send Message</span>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              ×
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-900">Success</p>
              <p className="text-sm text-green-700 mt-1">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-500 hover:text-green-700 p-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Always Show Balance and Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-[#7bc74d] to-[#5da336] rounded-2xl p-6 text-white shadow-xl shadow-[#7bc74d]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-white/90">Available Balance</p>
              </div>
              {isLoadingBalance ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <p className="text-3xl font-gilroy-black mb-1">
                  {(currentBalance * 10).toLocaleString()}
                </p>
              )}
              <p className="text-sm text-white/80">credits available</p>
            </div>
          </div>

          {/* Rate Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Rate per Message</p>
            </div>
            {isLoadingRates ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            ) : selectedConfigType ? (
              <>
                <p className="text-3xl font-gilroy-black text-gray-900 mb-1">
                  RM {(selectedConfigType.charge * 10).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">per SMS</p>
              </>
            ) : (
              <p className="text-lg text-gray-500">No rate available</p>
            )}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">

          {/* Step 1: Select Customers */}
          {currentStep === 1 && (
            <>
              {/* Selection Summary */}
              {selectedCustomers.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {selectedCustomers.length} customer{selectedCustomers.length !== 1 ? 's' : ''} selected
                        </p>
                        <p className="text-xs text-gray-600">
                          {(() => {
                            const withPhone = Array.from(selectedCustomersData.values()).filter(
                              (c) => c.phone_number && c.phone_number.trim() !== ""
                            ).length;
                            return `${withPhone} with phone number${withPhone !== 1 ? 's' : ''}`;
                          })()}
                        </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Messages to send: <span className="font-semibold text-gray-900">
                          {Array.from(selectedCustomersData.values()).filter(
                            (c) => c.phone_number && c.phone_number.trim() !== ""
                          ).length}
                        </span>
                      </p>
                      </div>
                    </div>
                    {!hasSufficientBalance && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-700">Insufficient balance</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Selection Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h2 className="text-lg font-gilroy-black text-gray-900">Select Customers</h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {pagination.total > 0 ? `${pagination.total} total customers` : 'Loading...'}
                      </p>
                    </div>
                  </div>
                  {filteredCustomers.length > 0 && (
                    <button
                      onClick={selectAllCustomers}
                      className="px-4 py-2 text-sm font-medium text-[#7bc74d] hover:text-[#6ab63d] hover:bg-green-50 rounded-lg transition-colors"
                    >
                      {filteredCustomers.every((c) => selectedCustomers.includes(c.id))
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  )}
                </div>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#7bc74d] focus:ring-2 focus:ring-[#7bc74d]/20 transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50"
                  />
                </div>
              </div>

              {/* Top Pagination Controls */}
              {!isLoadingCustomers && (() => {
                const shouldShowPagination = 
                  pagination.total_pages > 1 || 
                  pagination.has_next || 
                  pagination.has_previous || 
                  (pagination.total > pagination.limit && filteredCustomers.length === pagination.limit);
                
                if (!shouldShowPagination) return null;
                
                const totalPages = pagination.total_pages || Math.max(1, Math.ceil(pagination.total / pagination.limit));
                
                return (
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm sm:text-base text-gray-600 text-center sm:text-left">
                        Showing page <span className="font-semibold text-gray-900">{pagination.page}</span> of{" "}
                        <span className="font-semibold text-gray-900">{totalPages}</span> (
                        <span className="font-semibold text-gray-900">{pagination.total || filteredCustomers.length}</span> total customers)
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={!pagination.has_previous}
                          className="flex items-center justify-center p-2 sm:p-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-[#7bc74d] hover:border-[#7bc74d] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-all duration-200"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <div className="flex items-center gap-1 sm:gap-2">
                          {/* Show page numbers */}
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                              pageNum = i + 1;
                            } else if (pagination.page >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = pagination.page - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 ${
                                  pagination.page === pageNum
                                    ? "bg-[#7bc74d] text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={!pagination.has_next}
                          className="flex items-center justify-center p-2 sm:p-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-[#7bc74d] hover:border-[#7bc74d] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-all duration-200"
                          aria-label="Next page"
                        >
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Customer List */}
              <div className="p-6">
                <div className="max-h-[500px] overflow-y-auto space-y-2 -mx-2 px-2" data-customer-list>
                  {isLoadingCustomers ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-[#7bc74d] mb-3" />
                      <p className="text-sm text-gray-500">Loading customers...</p>
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {searchQuery.trim() ? "No customers found" : "No customers available"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {searchQuery.trim() ? "Try a different search term" : "Customers will appear here once added"}
                      </p>
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => {
                      const isSelected = selectedCustomers.includes(customer.id);
                      return (
                        <div
                          key={customer.id}
                          onClick={() => toggleCustomerSelection(customer)}
                          className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-[#7bc74d] bg-gradient-to-r from-green-50 to-emerald-50 shadow-md shadow-green-100/50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected
                                  ? "border-[#7bc74d] bg-[#7bc74d] shadow-sm"
                                  : "border-gray-300 group-hover:border-gray-400"
                              }`}
                            >
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <p className="font-semibold text-gray-900 truncate">
                                  {customer.name || "Unknown"}
                                </p>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
                                {customer.email && (
                                  <div className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[150px]">{customer.email}</span>
                                  </div>
                                )}
                                {customer.phone_number && (
                                  <div className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>{customer.phone_number}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-[#7bc74d]">
                                    {getCustomerPoints(customer).toLocaleString()} pts
                                  </span>
                                </div>
                                {!customer.email && !customer.phone_number && (
                                  <span className="text-gray-400">No contact info</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Pagination Controls */}
                {!isLoadingCustomers && (() => {
                  const shouldShowPagination = 
                    pagination.total_pages > 1 || 
                    pagination.has_next || 
                    pagination.has_previous || 
                    (pagination.total > pagination.limit && filteredCustomers.length === pagination.limit);
                  
                  if (!shouldShowPagination) return null;
                  
                  const totalPages = pagination.total_pages || Math.max(1, Math.ceil(pagination.total / pagination.limit));
                  
                  return (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm sm:text-base text-gray-600 text-center sm:text-left">
                          Showing page <span className="font-semibold text-gray-900">{pagination.page}</span> of{" "}
                          <span className="font-semibold text-gray-900">{totalPages}</span> (
                          <span className="font-semibold text-gray-900">{pagination.total || filteredCustomers.length}</span> total customers)
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={!pagination.has_previous}
                            className="flex items-center justify-center p-2 sm:p-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-[#7bc74d] hover:border-[#7bc74d] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-all duration-200"
                            aria-label="Previous page"
                          >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                          </button>
                          <div className="flex items-center gap-1 sm:gap-2">
                            {/* Show page numbers */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum: number;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (pagination.page <= 3) {
                                pageNum = i + 1;
                              } else if (pagination.page >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = pagination.page - 2 + i;
                              }
                              
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 ${
                                    pagination.page === pageNum
                                      ? "bg-[#7bc74d] text-white shadow-md"
                                      : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.has_next}
                            className="flex items-center justify-center p-2 sm:p-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-[#7bc74d] hover:border-[#7bc74d] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-all duration-200"
                            aria-label="Next page"
                          >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

              {/* Next Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStep}
                  disabled={selectedCustomers.length === 0}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] hover:from-[#6ab63d] hover:to-[#5da336] text-white shadow-lg shadow-[#7bc74d]/30 hover:shadow-xl hover:shadow-[#7bc74d]/40 disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Continue to Message</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}

          {/* Step 2: Send Message */}
          {currentStep === 2 && (
            <>
              {/* Selected Customers Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {selectedCustomers.length} customer{selectedCustomers.length !== 1 ? 's' : ''} selected
                      </p>
                      <p className="text-xs text-gray-600">
                        {(() => {
                          const withPhone = Array.from(selectedCustomersData.values()).filter(
                            (c) => c.phone_number && c.phone_number.trim() !== ""
                          ).length;
                          return `${withPhone} with phone number${withPhone !== 1 ? 's' : ''}`;
                        })()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handlePreviousStep}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Change Selection</span>
                  </button>
                </div>
              </div>

              {/* Message Composition Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-gilroy-black text-gray-900">Compose Message</h2>
                        <p className="text-xs text-gray-500">Customize your message with variables</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{showPreview ? "Hide" : "Show"} Preview</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Variables Panel */}
                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100 sticky top-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Code className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-sm font-semibold text-gray-900">Available Variables</h3>
                      </div>
                      {isLoadingVariables ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                        </div>
                      ) : variables.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center py-4">No variables available</p>
                      ) : (
                        <div className="space-y-2">
                          {variables.map((variable, index) => (
                            <button
                              key={index}
                              onClick={() => insertVariable(variable.variable)}
                              className="w-full text-left p-3 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <code className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded">
                                  {variable.variable}
                                </code>
                                <Plus className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{variable.description}</p>
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t border-indigo-200">
                        <p className="text-xs text-gray-600">
                          💡 Click any variable to insert it into your message at the cursor position
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message Editor */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Message Textarea */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message
                      </label>
                      <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here...&#10;&#10;Click variables on the left to insert them.&#10;&#10;Example: Hello {name}, you have {total_points} points!"
                        rows={12}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#7bc74d] focus:ring-2 focus:ring-[#7bc74d]/20 resize-none text-gray-900 placeholder:text-gray-400 bg-gray-50 transition-all text-base font-mono"
                      />
                    </div>

                    {/* Message Preview */}
                    {showPreview && (
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Eye className="w-4 h-4 text-gray-600" />
                          <h3 className="text-sm font-semibold text-gray-900">Message Preview</h3>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 min-h-[100px] text-sm text-gray-700 whitespace-pre-wrap">
                          {message.trim() ? (
                            renderMessagePreview(message)
                          ) : (
                            <span className="text-gray-400 italic">Your message preview will appear here...</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Variables will be replaced with actual customer data when sent
                        </p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Characters</span>
                        <span className="font-semibold text-gray-900">{message.length}</span>
                      </div>
                      {selectedCustomers.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Messages to send</span>
                          <span className="font-semibold text-[#7bc74d]">
                            {Array.from(selectedCustomersData.values()).filter(
                              (c) => c.phone_number && c.phone_number.trim() !== ""
                            ).length}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={
                    isSending ||
                    !message.trim() ||
                    selectedCustomers.length === 0 ||
                    !hasSufficientBalance
                  }
                  className="w-full px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] hover:from-[#6ab63d] hover:to-[#5da336] text-white shadow-lg shadow-[#7bc74d]/30 hover:shadow-xl hover:shadow-[#7bc74d]/40 disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] text-lg"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>
                        Send to {selectedCustomers.length} Customer{selectedCustomers.length !== 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                </button>

                {(() => {
                  const withPhone = selectedCustomersWithPhone.length;
                  const hasPhoneWarning = message.trim() && selectedCustomers.length > 0 && hasSufficientBalance && withPhone < selectedCustomers.length;
                  
                  if (!message.trim() || selectedCustomers.length === 0 || !hasSufficientBalance || hasPhoneWarning) {
                    return (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-amber-800">
                            {!message.trim() && "Please enter a message"}
                            {message.trim() && selectedCustomers.length === 0 && "Please select at least one customer"}
                            {message.trim() && selectedCustomers.length > 0 && !hasSufficientBalance && "Insufficient balance. Please top up your wallet."}
                            {hasPhoneWarning && withPhone === 0 && "Selected customers don't have phone numbers. Please select customers with phone numbers."}
                            {hasPhoneWarning && withPhone > 0 && `${selectedCustomers.length - withPhone} selected customer(s) don't have phone numbers and will be skipped.`}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
