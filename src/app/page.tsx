import Navbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PointNow - Loyalty Reimagined | Transform Customers Into Brand Ambassadors",
  description:
    "PointNow is a smart loyalty point system with a competitive twist. Gamified leaderboards, phone-based loyalty, and monthly SMS drive repeat purchases and customer retention. Go live in 2 minutes.",
  keywords: [
    "loyalty points",
    "loyalty program",
    "customer rewards",
    "gamified loyalty",
    "leaderboard rewards",
    "customer retention",
    "loyalty system",
    "rewards program",
    "points tracking",
    "viral marketing",
    "brand ambassadors",
    "customer engagement",
    "F&B loyalty",
    "retail loyalty",
    "SMS marketing",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.pointnow.io",
    siteName: "PointNow",
    title: "PointNow - Loyalty Reimagined | Transform Customers Into Brand Ambassadors",
    description:
      "PointNow is a smart loyalty point system with a competitive twist. Gamified leaderboards drive repeat purchases. Go live in 2 minutes.",
    images: [
      {
        url: "https://www.pointnow.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "PointNow - Loyalty Reimagined",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PointNow - Loyalty Reimagined",
    description:
      "Transform customers into brand ambassadors with gamified loyalty. Leaderboards, points, rewards. Go live in 2 minutes.",
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
      description: "Free tier available, Professional plan from $73/month",
    },
    description:
      "Smart loyalty point system with gamified leaderboards. Transform customers into brand ambassadors through competitive loyalty programs.",
    featureList: [
      "Phone-Based Loyalty System",
      "Gamified Leaderboards",
      "Monthly SMS Notifications",
      "Customer Rewards & Milestones",
      "Business Analytics",
      "Transaction Tracking",
      "Unlimited Customers",
      "No App Required",
      "Go Live in 2 Minutes",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "200",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <LandingPage />
    </>
  );
}
