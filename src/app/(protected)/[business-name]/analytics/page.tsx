import RestaurantAnalytics from "@/views/restaurants/RestaurantAnalytics";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";

interface BusinessAnalyticsPageProps {
  params: Promise<{
    "business-name": string;
  }>;
}

export default async function BusinessAnalyticsPage({ params }: BusinessAnalyticsPageProps) {
  const resolvedParams = await params;
  const businessName = decodeURIComponent(resolvedParams["business-name"]);
  
  return (
    <RestaurantLayout>
      <RestaurantAnalytics restaurantName={businessName} />
    </RestaurantLayout>
  );
}

