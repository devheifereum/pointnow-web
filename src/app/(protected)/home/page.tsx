import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Restaurants from "@/components/Customers";
import DecorativeShapes from "@/components/DecorativeShapes";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Free Loyalty Points Management System for Businesses",
  description: "PointNow helps businesses create and manage loyalty programs in minutes. Free forever for unlimited customers. Customers can check points, businesses reward loyalty.",
  canonical: "https://www.pointnow.io/home",
});

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PointNow",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Free loyalty points management system for businesses and retail stores. Customers check points, merchants reward loyalty.",
    featureList: [
      "Loyalty Points Management",
      "Customer Rewards System",
      "Points Leaderboard",
      "Business Analytics",
      "Transaction Tracking",
      "Staff Management",
      "Free Forever",
      "Unlimited Customers",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Full page animated grid background */}
        <AnimatedGridPattern
          className="opacity-20"
          width={60}
          height={60}
          numSquares={50}
          maxOpacity={0.05}
          duration={4}
        />
        <Navbar />
        <div className="relative">
          <DecorativeShapes />
          <Hero />
        </div>
        <Restaurants />
      </div>
    </>
  );
}
