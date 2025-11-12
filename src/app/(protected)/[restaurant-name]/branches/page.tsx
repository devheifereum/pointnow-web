import RestaurantLayout from "@/components/restaurant/RestaurantLayout";
import BranchesScreen from "@/views/restaurants/BranchesScreen";

interface RestaurantBranchesPageProps {
  params: Promise<{
    "restaurant-name": string;
  }>;
}

export default async function RestaurantBranchesPage({ params }: RestaurantBranchesPageProps) {
  await params; // Resolve params for Next.js
  
  return (
    <RestaurantLayout>
      <BranchesScreen />
    </RestaurantLayout>
  );
}

