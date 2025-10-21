"use client";

import React, { useState } from "react";
import { Star, MapPin, ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import { LightRays } from "@/components/ui/light-rays";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import Navbar from "@/components/Navbar";

interface RestaurantProfileProps {
  restaurantName: string;
}

export default function RestaurantProfile({ restaurantName }: RestaurantProfileProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock restaurant data
  const restaurant = {
    name: "Green Forest Restaurant",
    rating: 4.8,
    reviewCount: 96,
    location: "South West, London",
    cuisine: "Contemporary British",
    priceRange: "£££",
    userPoints: 1250,
    images: [
      "/api/placeholder/800/400",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    description: "Green Forest Restaurant serves innovative contemporary British cuisine and boasts breathtaking views from its restaurant, private dining rooms and spectacular three-storey high atrium bar.",
    popularDishes: [
      { name: "Forest Mushroom Risotto", price: "£18", image: "🍄" },
      { name: "Herb-Crusted Salmon", price: "£24", image: "🐟" },
      { name: "Wild Berry Cheesecake", price: "£12", image: "🍰" }
    ],
    menu: [
      { category: "Starters", items: ["Forest Soup", "Wild Mushroom Bruschetta", "Herb Salad"] },
      { category: "Mains", items: ["Forest Risotto", "Herb Salmon", "Wild Game Pie"] },
      { category: "Desserts", items: ["Berry Cheesecake", "Forest Trifle", "Wild Honey Ice Cream"] }
    ],
    reviews: [
      { name: "Sarah M.", rating: 5, comment: "Absolutely amazing food and atmosphere!", date: "2 days ago" },
      { name: "James L.", rating: 4, comment: "Great service and delicious food.", date: "1 week ago" },
      { name: "Emma K.", rating: 5, comment: "Perfect for a special occasion.", date: "2 weeks ago" }
    ]
  };

  const tabs = [
    { id: "description", label: "DESCRIPTION" },
    { id: "popular-dishes", label: "POPULAR DISHES" },
    { id: "menu", label: "MENU" },
    { id: "reviews", label: "REVIEWS" }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % restaurant.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + restaurant.images.length) % restaurant.images.length);
  };

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
      
      <div className="relative z-10">
        {/* Navigation */}
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Content */}
          <div>
              {/* Image Gallery */}
              <div className="relative mb-8">
                <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                  <LightRays
                    count={6}
                    color="rgba(123, 199, 77, 0.3)"
                    blur={30}
                    speed={10}
                    length="80%"
                    className="absolute inset-0"
                  />
                  
                  {/* Main Image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl">🌲</div>
                  </div>
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  {/* View All Photos Button */}
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                    VIEW ALL 8 PHOTOS
                  </div>
                </div>
                
                {/* Thumbnail Images */}
                <div className="flex space-x-2 mt-4">
                  {restaurant.images.slice(1).map((_, index) => (
                    <div
                      key={index}
                      className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {index === 0 ? "🏢" : index === 1 ? "🍽️" : "🌿"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restaurant Information */}
              <div className="mb-8">
                <h1 className="text-4xl font-gilroy-black text-black mb-4">{restaurant.name}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-black">{restaurant.reviewCount} reviews</span>
                  </div>
                </div>
                
                <div className="flex items-center text-black mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="mr-4">{restaurant.location}</span>
                  <span className="mr-4">{restaurant.cuisine}</span>
                  <span className="font-semibold">{restaurant.priceRange}</span>
                </div>

                {/* User Points */}
                <div className="bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] text-white p-6 rounded-xl mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-gilroy-extrabold mb-2">Your Points</h3>
                      <p className="text-lg opacity-90">Earn points with every order at this restaurant</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-gilroy-black">{restaurant.userPoints.toLocaleString()}</div>
                      <div className="text-lg opacity-90">points</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-8">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-red-500 text-red-500'
                            : 'border-transparent text-black hover:text-black'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-8">
                  {activeTab === "description" && (
                    <div>
                      <h3 className="text-xl font-gilroy-extrabold mb-4">Description</h3>
                      <p className="text-black leading-relaxed">{restaurant.description}</p>
                    </div>
                  )}

                  {activeTab === "popular-dishes" && (
                    <div>
                      <h3 className="text-xl font-gilroy-extrabold mb-6">Popular Dishes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {restaurant.popularDishes.map((dish, index) => (
                          <div key={index} className="flex items-center p-4 bg-white rounded-xl shadow-sm">
                            <div className="text-4xl mr-4">{dish.image}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-black">{dish.name}</h4>
                              <p className="text-black">{dish.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "menu" && (
                    <div>
                      <h3 className="text-xl font-gilroy-extrabold mb-6">Menu</h3>
                      {restaurant.menu.map((section, index) => (
                        <div key={index} className="mb-8">
                          <h4 className="text-lg font-semibold text-black mb-4">{section.category}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                <span className="text-black">{item}</span>
                                <span className="text-black">£12-£28</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div>
                      <h3 className="text-xl font-gilroy-extrabold mb-6">Reviews</h3>
                      <div className="space-y-6">
                        {restaurant.reviews.map((review, index) => (
                          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-sm font-semibold">{review.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <div className="font-semibold">{review.name}</div>
                                  <div className="flex items-center">
                                    {[...Array(review.rating)].map((_, i) => (
                                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-black text-sm">{review.date}</span>
                            </div>
                            <p className="text-black">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
