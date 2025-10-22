import React from "react";
import Link from "next/link";
import { Star, Clock, MapPin, Heart } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { LightRays } from "@/components/ui/light-rays";

export default function Restaurants() {
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
      slug: "bella-vista"
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
      slug: "sakura-sushi"
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
      slug: "spice-garden"
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
      slug: "burger-palace"
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
      slug: "le-petit-cafe"
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
      slug: "taco-fiesta"
    }
  ];

  return (
    <section className="relative py-20 bg-gray-50 overflow-hidden">
      {/* Flickering Grid Background */}
      <FlickeringGrid
        className="absolute inset-0 opacity-20"
        squareSize={8}
        gridGap={12}
        flickerChance={0.1}
        color="#7bc74d"
        maxOpacity={0.3}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-gilroy-black text-black mb-4 drop-shadow-sm">
            Our Partner Merchants
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto drop-shadow-sm">
            Trusted by 1000+ businesses and loved by millions of customers. Check your loyalty points and earn rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/leaderboard/${restaurant.slug}`}
              className="block"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-white/20">
              {/* Restaurant Image with Light Rays */}
              <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                {/* Light Rays Effect */}
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
                  <span className="text-sm font-semibold text-gray-700">{restaurant.priceRange}</span>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-gilroy-extrabold text-black mb-1">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{restaurant.cuisine}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">{restaurant.rating}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Delivery Info */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.distance}</span>
                  </div>
                </div>

                {/* Check Points Button */}
                <button className="w-full mt-4 bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold py-3 rounded-xl transition-colors">
                  Check Points
                </button>
              </div>
            </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/restaurants">
            <button className="bg-white border-2 border-[#7bc74d] text-[#7bc74d] hover:bg-[#7bc74d] hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              View All Partner Merchants
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
