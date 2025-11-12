import { Suspense } from "react";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";
import BranchesScreen from "@/views/restaurants/BranchesScreen";

interface RestaurantBranchesPageProps {
  params: Promise<{
    "restaurant-name": string;
  }>;
}

export default async function RestaurantBranchesPage({ params }: RestaurantBranchesPageProps) {
  const resolvedParams = await params;
  const restaurantName = decodeURIComponent(resolvedParams["restaurant-name"]);
  
  return (
    <RestaurantLayout>
      <BranchesScreen />
    </RestaurantLayout>
  );
}

