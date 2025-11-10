"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Download, Plus, Minus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { transactionsApi } from "@/lib/api/transactions";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { PointTransaction, TransactionMetadata } from "@/lib/types/transactions";

interface RestaurantTransactionsProps {
  restaurantName?: string;
}

export default function RestaurantTransactions({ restaurantName }: RestaurantTransactionsProps) {
  // restaurantName is available but not currently used
  void restaurantName;
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "add" | "subtract">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [metadata, setMetadata] = useState<TransactionMetadata | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });

  // Date range state - default to last 30 days
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const businessId = user?.businessId || "";

  useEffect(() => {
    if (!businessId) {
      setError("Business ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    fetchMetadata();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, pagination.page, startDate, endDate]);

  const fetchMetadata = async () => {
    if (!businessId) return;

    try {
      const response = await transactionsApi.getMetadata(businessId);
      setMetadata(response.data.metadata);
    } catch (err) {
      console.error("Failed to fetch metadata:", err);
    }
  };

  const fetchTransactions = async () => {
    if (!businessId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await transactionsApi.getAll({
        business_id: businessId,
        page: pagination.page,
        limit: pagination.limit,
        start_date: startDate,
        end_date: endDate,
      });

      const transactionsData = response.data.point_transactions || [];
      setTransactions(transactionsData);
      setPagination({
        page: response.data.metadata.page,
        limit: response.data.metadata.limit,
        total: response.data.metadata.total,
        total_pages: response.data.metadata.total_pages,
        has_next: response.data.metadata.has_next,
        has_previous: response.data.metadata.has_previous,
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "Failed to load transactions");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Format transaction for display
  const formatTransaction = (transaction: PointTransaction) => {
    // Use transaction_at for the transaction time, fallback to created_at
    const date = new Date(transaction.transaction_at || transaction.created_at);
    // Amount: positive = earned/added, negative = redeemed/subtracted
    const isAdd = transaction.amount > 0;
    // Use the sign of amount to determine type, regardless of the type field
    // Positive amount = add/earn, Negative amount = subtract/redeem
    
    // Extract customer name from nested customer_business object or fallback to legacy fields
    const customerName = 
      transaction.customer_business?.customer?.name || 
      transaction.customer_name || 
      "Unknown Customer";
    
    // Extract customer phone from nested customer_business object or fallback to legacy fields
    const customerPhone = 
      transaction.customer_business?.customer?.phone_number || 
      transaction.customer_phone || 
      "-";
    
    // Extract customer email from nested customer_business object
    const customerEmail = 
      transaction.customer_business?.customer?.email || 
      "-";
    
    // Extract staff name from nested staff object or fallback to legacy fields
    const staffMember = 
      transaction.staff?.user?.name || 
      transaction.staff_member || 
      "System";
    
    return {
      id: transaction.id,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      customerName,
      customerPhone,
      customerEmail,
      type: isAdd ? "add" : "subtract",
      points: Math.abs(transaction.amount), // Always show absolute value for display
      staffMember,
      notes: transaction.notes || transaction.metadata?.notes || "-",
    };
  };

  // Format all transactions first
  const formattedTransactions = transactions.map(formatTransaction);

  // Apply filters only if needed
  const filteredTransactions = formattedTransactions.filter((transaction) => {
    // Search filter: if empty, show all; otherwise match name, phone, or staff
    const hasSearchQuery = searchQuery.trim().length > 0;
    const matchesSearch = !hasSearchQuery || 
      transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customerPhone.includes(searchQuery) ||
      transaction.staffMember.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter: if "all", show all; otherwise match type
    const matchesType = selectedType === "all" || transaction.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-gilroy-black text-black mb-2">Transaction History</h1>
            <p className="text-xs sm:text-sm text-gray-600">View all point transactions</p>
          </div>
          
          {/* Date Range Picker */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] text-black"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bc74d] text-black"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Filters and Transactions Table Combined */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Filters Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, phone, or staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as "all" | "add" | "subtract")}
                className="w-full pl-9 sm:pl-10 pr-8 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent appearance-none bg-white text-black"
              >
                <option value="all">All Types</option>
                <option value="add">Points Added</option>
                <option value="subtract">Points Subtracted</option>
              </select>
            </div>

          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg sm:rounded-xl transition-colors text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-[#7bc74d]" />
              <span className="ml-3 text-sm sm:text-base text-gray-600">Loading transactions...</span>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Staff
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <div className="text-sm text-black">{transaction.date}</div>
                            <div className="text-xs text-gray-500">{transaction.time}</div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="text-sm font-semibold text-black">{transaction.customerName}</div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{transaction.customerPhone}</div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700 truncate max-w-[150px]">{transaction.customerEmail}</div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${
                                transaction.type === "add"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {transaction.type === "add" ? (
                                <Plus className="w-3 h-3" />
                              ) : (
                                <Minus className="w-3 h-3" />
                              )}
                              {transaction.type === "add" ? "Added" : "Subtracted"}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <span
                              className={`text-base lg:text-lg font-gilroy-extrabold ${
                                transaction.type === "add" ? "text-[#7bc74d]" : "text-red-600"
                              }`}
                            >
                              {transaction.type === "add" ? "+" : "-"}
                              {transaction.points}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-700">
                            {transaction.staffMember}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3 p-4">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-black truncate mb-1">{transaction.customerName}</h3>
                          <p className="text-xs text-gray-600">{transaction.date} • {transaction.time}</p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${
                            transaction.type === "add"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.type === "add" ? (
                            <Plus className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                          {transaction.type === "add" ? "Added" : "Subtracted"}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Phone:</span>
                          <span className="text-sm text-gray-900">{transaction.customerPhone}</span>
                        </div>
                        {transaction.customerEmail !== "-" && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Email:</span>
                            <span className="text-sm text-gray-900 truncate ml-2">{transaction.customerEmail}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Points:</span>
                          <span
                            className={`text-lg font-gilroy-extrabold ${
                              transaction.type === "add" ? "text-[#7bc74d]" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "add" ? "+" : "-"}
                            {transaction.points}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Staff:</span>
                          <span className="text-sm text-gray-900">{transaction.staffMember}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No transactions found
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                  <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                    Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} total)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.has_previous}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <span className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-black">
                      Page {pagination.page}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.has_next}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Total Transactions</p>
          <p className="text-xl sm:text-2xl font-gilroy-black text-black">
            {metadata?.total_transactions?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Points Added</p>
          <p className="text-xl sm:text-2xl font-gilroy-black text-[#7bc74d]">
            +{metadata?.total_points_added?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Points Subtracted</p>
          <p className="text-xl sm:text-2xl font-gilroy-black text-red-600">
            -{metadata?.total_points_subtracted?.toLocaleString() || "0"}
          </p>
        </div>
      </div>
    </>
  );
}

