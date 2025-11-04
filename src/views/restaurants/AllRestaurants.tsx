"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Clock, MapPin, Heart, Search, Filter, Grid, List } from "lucide-react";
import { LightRays } from "@/components/ui/light-rays";
import { StripedPattern } from "@/components/magicui/striped-pattern";
import Navbar from "@/components/Navbar";

export default function AllRestaurants() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");

  const restaurants = [
    {
      id: 1,
      name: "Bella Vista",
      cuisine: "Italian",
      rating: 4.8,
      deliveryTime: "25-35 min",
      distance: "2.1 km",
      image: "🍝",
      priceRange: "$$",
      isFavorite: false,
      tags: ["Pizza", "Pasta", "Wine"],
      rayColor: "rgba(123, 199, 77, 0.4)",
      slug: "bella-vista",
      description: "Authentic Italian cuisine with fresh ingredients and traditional recipes."
    },
    {
      id: 2,
      name: "Sakura Sushi",
      cuisine: "Japanese",
      rating: 4.9,
      deliveryTime: "20-30 min",
      distance: "1.8 km",
      image: "🍣",
      priceRange: "$$$",
      isFavorite: true,
      tags: ["Sushi", "Ramen", "Fresh"],
      rayColor: "rgba(59, 130, 246, 0.4)",
      slug: "sakura-sushi",
      description: "Fresh sushi and traditional Japanese dishes made with premium ingredients."
    },
    {
      id: 3,
      name: "Spice Garden",
      cuisine: "Indian",
      rating: 4.7,
      deliveryTime: "30-40 min",
      distance: "3.2 km",
      image: "🍛",
      priceRange: "$$",
      isFavorite: false,
      tags: ["Curry", "Biryani", "Vegetarian"],
      rayColor: "rgba(245, 158, 11, 0.4)",
      slug: "spice-garden",
      description: "Authentic Indian spices and flavors in every dish, from mild to extra spicy."
    },
    {
      id: 4,
      name: "Burger Palace",
      cuisine: "American",
      rating: 4.6,
      deliveryTime: "15-25 min",
      distance: "1.5 km",
      image: "🍔",
      priceRange: "$",
      isFavorite: true,
      tags: ["Burgers", "Fries", "Fast Food"],
      rayColor: "rgba(239, 68, 68, 0.4)",
      slug: "burger-palace",
      description: "Gourmet burgers made with premium beef and fresh ingredients."
    },
    {
      id: 5,
      name: "Le Petit Café",
      cuisine: "French",
      rating: 4.9,
      deliveryTime: "35-45 min",
      distance: "4.1 km",
      image: "🥐",
      priceRange: "$$$",
      isFavorite: false,
      tags: ["Pastries", "Coffee", "Brunch"],
      rayColor: "rgba(168, 85, 247, 0.4)",
      slug: "le-petit-cafe",
      description: "French café serving authentic pastries, coffee, and light meals."
    },
    {
      id: 6,
      name: "Taco Fiesta",
      cuisine: "Mexican",
      rating: 4.5,
      deliveryTime: "20-30 min",
      distance: "2.8 km",
      image: "🌮",
      priceRange: "$$",
      isFavorite: true,
      tags: ["Tacos", "Burritos", "Spicy"],
      rayColor: "rgba(34, 197, 94, 0.4)",
      slug: "taco-fiesta",
      description: "Authentic Mexican street food with bold flavors and fresh ingredients."
    },
    {
      id: 7,
      name: "Golden Dragon",
      cuisine: "Chinese",
      rating: 4.4,
      deliveryTime: "25-35 min",
      distance: "2.5 km",
      image: "🥢",
      priceRange: "$$",
      isFavorite: false,
      tags: ["Dumplings", "Noodles", "Wok"],
      rayColor: "rgba(220, 38, 127, 0.4)",
      slug: "golden-dragon",
      description: "Traditional Chinese cuisine with modern presentation and authentic flavors."
    },
    {
      id: 8,
      name: "Mediterranean Breeze",
      cuisine: "Mediterranean",
      rating: 4.7,
      deliveryTime: "30-40 min",
      distance: "3.5 km",
      image: "🫒",
      priceRange: "$$$",
      isFavorite: true,
      tags: ["Olive Oil", "Seafood", "Healthy"],
      rayColor: "rgba(34, 197, 94, 0.4)",
      slug: "mediterranean-breeze",
      description: "Fresh Mediterranean dishes with olive oil, seafood, and healthy ingredients."
    },
    {
      id: 9,
      name: "Steakhouse Prime",
      cuisine: "Steakhouse",
      rating: 4.8,
      deliveryTime: "40-50 min",
      distance: "4.2 km",
      image: "🥩",
      priceRange: "$$$$",
      isFavorite: false,
      tags: ["Steak", "Wine", "Premium"],
      rayColor: "rgba(139, 69, 19, 0.4)",
      slug: "steakhouse-prime",
      description: "Premium steaks and fine dining experience with exceptional service."
    },
    {
      id: 10,
      name: "Thai Garden",
      cuisine: "Thai",
      rating: 4.6,
      deliveryTime: "25-35 min",
      distance: "2.8 km",
      image: "🍜",
      priceRange: "$$",
      isFavorite: true,
      tags: ["Curry", "Noodles", "Spicy"],
      rayColor: "rgba(251, 146, 60, 0.4)",
      slug: "thai-garden",
      description: "Authentic Thai cuisine with bold flavors and fresh ingredients."
    },
    {
      id: 11,
      name: "Pizza Corner",
      cuisine: "Italian",
      rating: 4.5,
      deliveryTime: "20-30 min",
      distance: "1.9 km",
      image: "🍕",
      priceRange: "$$",
      isFavorite: false,
      tags: ["Pizza", "Italian", "Fast"],
      rayColor: "rgba(34, 197, 94, 0.4)",
      slug: "pizza-corner",
      description: "Wood-fired pizzas with fresh toppings and authentic Italian recipes."
    },
    {
      id: 12,
      name: "Sushi Master",
      cuisine: "Japanese",
      rating: 4.9,
      deliveryTime: "30-40 min",
      distance: "3.1 km",
      image: "🍱",
      priceRange: "$$$",
      isFavorite: true,
      tags: ["Sushi", "Sashimi", "Premium"],
      rayColor: "rgba(59, 130, 246, 0.4)",
      slug: "sushi-master",
      description: "Master-crafted sushi and sashimi with the freshest fish available."
    }
  ];

  const cuisines = ["all", "Italian", "Japanese", "Indian", "American", "French", "Mexican", "Chinese", "Mediterranean", "Steakhouse", "Thai"];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCuisine = selectedCuisine === "all" || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Striped Pattern Background */}
      <StripedPattern
        width={60}
        height={60}
        direction="left"
        className="opacity-5 text-[#7bc74d]"
      />
      
      {/* Navigation */}
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-gilroy-black text-black mb-4">All Restaurants</h1>
          <p className="text-lg text-black">Discover amazing restaurants near you</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-500"
              />
            </div>

            {/* Cuisine Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent appearance-none bg-white text-black"
              >
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine === "all" ? "All Cuisines" : cuisine}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-sm text-black" : "text-black"
                }`}
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-white shadow-sm text-black" : "text-black"
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-black">
            Showing {filteredRestaurants.length} of {restaurants.length} restaurants
          </div>
        </div>

        {/* Restaurants Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/leaderboard/${restaurant.slug}`}
                className="block"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-white/20">
                  {/* Restaurant Image with Light Rays */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                    <LightRays
                      count={4}
                      color={restaurant.rayColor}
                      blur={20}
                      speed={6}
                      length="70%"
                      className="absolute inset-0"
                    />
                    
                    <div className="text-6xl relative z-10">{restaurant.image}</div>
                    
                    <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-20">
                      <Heart 
                        className={`w-5 h-5 ${
                          restaurant.isFavorite 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`} 
                      />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full z-20">
                      <span className="text-sm font-semibold text-black">{restaurant.priceRange}</span>
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-gilroy-extrabold text-black mb-1">
                          {restaurant.name}
                        </h3>
                        <p className="text-black text-sm">{restaurant.cuisine}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-black">{restaurant.rating}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {restaurant.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-black text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Delivery Info */}
                    <div className="flex items-center justify-between text-sm text-black mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{restaurant.distance}</span>
                      </div>
                    </div>

                    {/* Order Button */}
                    <button className="w-full bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold py-3 rounded-xl transition-colors">
                      Point Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/leaderboard/${restaurant.slug}`}
                className="block"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center space-x-6 group cursor-pointer border border-white/20">
                  {/* Restaurant Image */}
                  <div className="relative w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    <LightRays
                      count={3}
                      color={restaurant.rayColor}
                      blur={15}
                      speed={8}
                      length="80%"
                      className="absolute inset-0"
                    />
                    <div className="text-3xl relative z-10">{restaurant.image}</div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-gilroy-extrabold text-black mb-1">
                          {restaurant.name}
                        </h3>
                        <p className="text-black text-sm">{restaurant.cuisine}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-black">{restaurant.rating}</span>
                      </div>
                    </div>

                    <p className="text-black text-sm mb-3 line-clamp-2">{restaurant.description}</p>

                    <div className="flex items-center justify-between text-sm text-black">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{restaurant.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{restaurant.distance}</span>
                        </div>
                        <span className="font-semibold">{restaurant.priceRange}</span>
                      </div>
                      <button className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                        Point Now
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}


        {/* No Results */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-gilroy-extrabold text-black mb-2">No restaurants found</h3>
            <p className="text-black mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCuisine("all");
              }}
              className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
