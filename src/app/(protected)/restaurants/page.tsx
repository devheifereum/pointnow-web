import { Suspense } from "react";
import AllRestaurants from "@/views/restaurants/AllRestaurants";

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllRestaurants />
    </Suspense>
  );
}
 