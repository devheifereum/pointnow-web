"use client";

import React, { useState } from "react";
import { Search, Filter, Download, Plus, Minus, Calendar } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  type: "add" | "subtract";
  points: number;
  staffMember: string;
  notes?: string;
}

interface RestaurantTransactionsProps {
  restaurantName?: string;
}

export default function RestaurantTransactions({ restaurantName }: RestaurantTransactionsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "add" | "subtract">("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Mock transactions data
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2024-01-15",
      time: "14:30",
      customerName: "John Doe",
      customerPhone: "+1 234-567-8900",
      type: "add",
      points: 50,
      staffMember: "Sarah Manager",
      notes: "Purchase: $25.00",
    },
    {
      id: "2",
      date: "2024-01-15",
      time: "13:15",
      customerName: "Jane Smith",
      customerPhone: "+1 234-567-8901",
      type: "subtract",
      points: 100,
      staffMember: "Mike Cashier",
      notes: "Reward redemption",
    },
    {
      id: "3",
      date: "2024-01-15",
      time: "12:00",
      customerName: "Mike Johnson",
      customerPhone: "+1 234-567-8902",
      type: "add",
      points: 25,
      staffMember: "Sarah Manager",
      notes: "Purchase: $12.50",
    },
    {
      id: "4",
      date: "2024-01-14",
      time: "18:45",
      customerName: "Sarah Williams",
      customerPhone: "+1 234-567-8903",
      type: "add",
      points: 75,
      staffMember: "Mike Cashier",
      notes: "Purchase: $37.50",
    },
    {
      id: "5",
      date: "2024-01-14",
      time: "17:20",
      customerName: "David Brown",
      customerPhone: "+1 234-567-8904",
      type: "subtract",
      points: 200,
      staffMember: "Sarah Manager",
      notes: "Reward redemption",
    },
    {
      id: "6",
      date: "2024-01-14",
      time: "16:10",
      customerName: "John Doe",
      customerPhone: "+1 234-567-8900",
      type: "add",
      points: 30,
      staffMember: "Mike Cashier",
      notes: "Purchase: $15.00",
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customerPhone.includes(searchQuery) ||
      transaction.staffMember.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || transaction.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-gilroy-black text-black mb-2">Transaction History</h1>
        <p className="text-gray-600">View all point transactions</p>
      </div>

      {/* Filters and Transactions Table Combined */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Filters Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, phone, or staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as "all" | "add" | "subtract")}
                className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent appearance-none bg-white text-black"
              >
                <option value="all">All Types</option>
                <option value="add">Points Added</option>
                <option value="subtract">Points Subtracted</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent appearance-none bg-white text-black"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{transaction.date}</div>
                      <div className="text-xs text-gray-500">{transaction.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-black">{transaction.customerName}</div>
                      <div className="text-xs text-gray-500">{transaction.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-lg font-gilroy-extrabold ${
                          transaction.type === "add" ? "text-[#7bc74d]" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "add" ? "+" : "-"}
                        {transaction.points}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.staffMember}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.notes || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Total Transactions</p>
          <p className="text-2xl font-gilroy-black text-black">{filteredTransactions.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Points Added</p>
          <p className="text-2xl font-gilroy-black text-[#7bc74d]">
            +{filteredTransactions.filter((t) => t.type === "add").reduce((sum, t) => sum + t.points, 0)}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Points Subtracted</p>
          <p className="text-2xl font-gilroy-black text-red-600">
            -{filteredTransactions.filter((t) => t.type === "subtract").reduce((sum, t) => sum + t.points, 0)}
          </p>
        </div>
      </div>
    </>
  );
}

