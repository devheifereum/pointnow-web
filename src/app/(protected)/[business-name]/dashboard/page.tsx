import RestaurantDashboard from "@/views/restaurants/RestaurantDashboard";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";

interface BusinessDashboardPageProps {
  params: Promise<{
    "business-name": string;
  }>;
}

export default async function BusinessDashboardPage({ params }: BusinessDashboardPageProps) {
  const resolvedParams = await params;
  const businessName = decodeURIComponent(resolvedParams["business-name"]);
  
  return (
    <RestaurantLayout>
      <RestaurantDashboard restaurantName={businessName} />
    </RestaurantLayout>
  );
}

