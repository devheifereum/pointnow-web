import { Suspense } from "react";
import AllRestaurants from "@/views/restaurants/AllRestaurants";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Find Businesses & Check Loyalty Points",
  description: "Discover businesses offering loyalty points and rewards. Check your points, view leaderboards, and find partner merchants near you.",
  canonical: "https://www.pointnow.io/businesses",
});

export default function BusinessesPage() {
  // Server-rendered content for SEO - Google can see this immediately
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Business Directory - PointNow",
            description: "Find businesses offering loyalty points and rewards. Check your points, view leaderboards, and find partner merchants.",
            url: "https://www.pointnow.io/businesses",
            mainEntity: {
              "@type": "ItemList",
              name: "Partner Businesses",
            },
          }),
        }}
      />
      {/* Initial content visible to Googlebot */}
      <div className="sr-only">
        <h1>Find Businesses & Check Loyalty Points</h1>
        <p>
          Discover businesses offering loyalty points and rewards. Check your points, view leaderboards, and find partner merchants near you.
        </p>
        <p>
          Browse our directory of partner merchants who offer loyalty point programs. Search for businesses, check your loyalty points, and view leaderboards.
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <AllRestaurants />
      </Suspense>
    </>
  );
}
 