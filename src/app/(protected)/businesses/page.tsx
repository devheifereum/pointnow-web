import { Suspense } from "react";
import AllRestaurants from "@/views/restaurants/AllRestaurants";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";
import type { Business } from "@/lib/types/business";

export const metadata: Metadata = constructMetadata({
  title: "Find Businesses & Check Loyalty Points",
  description: "Discover businesses offering loyalty points and rewards. Check your points, view leaderboards, and find partner merchants near you.",
  canonical: "https://www.pointnow.io/businesses",
});

async function getInitialBusinesses() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.pointnow.io";
    const baseUrl = API_URL.endsWith('/api/v1') ? API_URL : `${API_URL}/api/v1`;
    const response = await fetch(`${baseUrl}/business?page=1&limit=100`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "PointNow-Server/1.0",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.data?.businesses || [];
  } catch {
    return null;
  }
}

export default async function BusinessesPage() {
  const initialBusinesses = await getInitialBusinesses();

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
              numberOfItems: initialBusinesses?.length || 0,
              itemListElement: initialBusinesses?.slice(0, 10).map((business: Business, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "LocalBusiness",
                  name: business.name,
                  description: business.description,
                  url: `https://www.pointnow.io/leaderboard/${business.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
                },
              })) || [],
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
        {/* Server-rendered business list for SEO */}
        {initialBusinesses && initialBusinesses.length > 0 && (
          <ul>
            {initialBusinesses.slice(0, 10).map((business: Business) => (
              <li key={business.id}>
                <h2>{business.name}</h2>
                {business.description && <p>{business.description}</p>}
                {business.address && <p>Location: {business.address}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <AllRestaurants />
      </Suspense>
    </>
  );
}
 