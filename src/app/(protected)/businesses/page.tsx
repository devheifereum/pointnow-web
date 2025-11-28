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
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllRestaurants />
    </Suspense>
  );
}
 