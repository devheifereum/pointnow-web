import RestaurantAnalytics from "@/views/restaurants/RestaurantAnalytics";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";

interface RestaurantAnalyticsPageProps {
  params: Promise<{
    "restaurant-name": string;
  }>;
}

export default async function RestaurantAnalyticsPage({ params }: RestaurantAnalyticsPageProps) {
  const resolvedParams = await params;
  const restaurantName = decodeURIComponent(resolvedParams["restaurant-name"]);
  
  return (
    <RestaurantLayout>
      <RestaurantAnalytics restaurantName={restaurantName} />
    </RestaurantLayout>
  );
}

