"use client";

import React, { useState } from "react";
import {
  Building2,
  Phone,
  MapPin,
  Mail,
  DollarSign,
  Award,
  Clock,
  Save,
} from "lucide-react";

interface RestaurantSettingsProps {
  restaurantName?: string;
}

export default function RestaurantSettings({ restaurantName: _restaurantName }: RestaurantSettingsProps) {
  const [businessInfo, setBusinessInfo] = useState({
    name: "Green Forest Restaurant",
    phone: "+1 234-567-8900",
    email: "info@greenforest.com",
    address: "123 Main Street, London, UK",
  });

  const [pointRules, setPointRules] = useState({
    pointsPerDollar: 1,
    minimumPurchase: 0,
    expirationDays: 365,
    bonusMultiplier: 1,
  });

  const [rewardRules, setRewardRules] = useState({
    pointsForDiscount: 100,
    discountAmount: 5,
    minimumRedemption: 50,
  });

  const handleBusinessInfoChange = (field: string, value: string) => {
    setBusinessInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePointRulesChange = (field: string, value: number) => {
    setPointRules((prev) => ({ ...prev, [field]: value }));
  };

  const handleRewardRulesChange = (field: string, value: number) => {
    setRewardRules((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save settings logic here
    alert("Settings saved successfully!");
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-gilroy-black text-black mb-2">Settings</h1>
        <p className="text-gray-600">Configure your restaurant and loyalty program settings</p>
      </div>

      <div className="space-y-6">
        {/* Business Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-gilroy-black text-black">Business Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Restaurant Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={businessInfo.name}
                  onChange={(e) => handleBusinessInfoChange("name", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={businessInfo.phone}
                  onChange={(e) => handleBusinessInfoChange("phone", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => handleBusinessInfoChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={businessInfo.address}
                  onChange={(e) => handleBusinessInfoChange("address", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Point Rules */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-gilroy-black text-black">Point Rules</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Points per Dollar Spent
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={pointRules.pointsPerDollar}
                  onChange={(e) => handlePointRulesChange("pointsPerDollar", parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Customers earn this many points for each dollar spent</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Purchase for Points ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pointRules.minimumPurchase}
                  onChange={(e) => handlePointRulesChange("minimumPurchase", parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum purchase amount required to earn points</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Point Expiration (Days)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  value={pointRules.expirationDays}
                  onChange={(e) => handlePointRulesChange("expirationDays", parseInt(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Number of days before points expire (0 = never expire)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bonus Multiplier
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={pointRules.bonusMultiplier}
                  onChange={(e) => handlePointRulesChange("bonusMultiplier", parseFloat(e.target.value) || 1)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Multiplier for bonus point campaigns (e.g., 2x = double points)</p>
            </div>
          </div>
        </div>

        {/* Reward Rules */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-gilroy-black text-black">Reward Rules</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Points Required for Discount
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  value={rewardRules.pointsForDiscount}
                  onChange={(e) => handleRewardRulesChange("pointsForDiscount", parseInt(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Points needed to redeem a discount</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={rewardRules.discountAmount}
                  onChange={(e) => handleRewardRulesChange("discountAmount", parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Discount value when points are redeemed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Redemption Points
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  value={rewardRules.minimumRedemption}
                  onChange={(e) => handleRewardRulesChange("minimumRedemption", parseInt(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum points required to make a redemption</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
}

