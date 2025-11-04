import RestaurantDashboard from "@/views/restaurants/RestaurantDashboard";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";

interface RestaurantDashboardPageProps {
  params: Promise<{
    "restaurant-name": string;
  }>;
}

export default async function RestaurantDashboardPage({ params }: RestaurantDashboardPageProps) {
  const resolvedParams = await params;
  const restaurantName = decodeURIComponent(resolvedParams["restaurant-name"]);
  
  return (
    <RestaurantLayout>
      <RestaurantDashboard restaurantName={restaurantName} />
    </RestaurantLayout>
  );
}

