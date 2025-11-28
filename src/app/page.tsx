import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Restaurants from "@/components/Customers";
import DecorativeShapes from "@/components/DecorativeShapes";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PointNow - Free Loyalty Points Management System",
  description:
    "Free loyalty points management for businesses and retail stores. Customers check points, merchants reward loyalty. Go live in 2 minutes. Free forever for unlimited customers.",
  keywords: [
    "loyalty points",
    "loyalty program",
    "customer rewards",
    "points management",
    "retail loyalty",
    "business loyalty",
    "customer retention",
    "loyalty system",
    "rewards program",
    "points tracking",
    "free loyalty software",
    "loyalty points app",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.pointnow.io",
    siteName: "PointNow",
    title: "PointNow - Free Loyalty Points Management System",
    description:
      "Free loyalty points management for businesses and retail stores. Customers check points, merchants reward loyalty. Go live in 2 minutes. Free forever for unlimited customers.",
    images: [
      {
        url: "https://www.pointnow.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "PointNow - Loyalty Points Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PointNow - Free Loyalty Points Management System",
    description:
      "Free loyalty points management for businesses. Go live in 2 minutes. Free forever for unlimited customers.",
    images: ["https://www.pointnow.io/og-image.png"],
    creator: "@pointnow",
  },
  alternates: {
    canonical: "https://www.pointnow.io",
  },
};

export default function RootPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PointNow",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://www.pointnow.io",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free loyalty points management system for businesses and retail stores. Customers check points, merchants reward loyalty.",
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
