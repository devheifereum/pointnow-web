import RestaurantSettings from "@/views/restaurants/RestaurantSettings";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";

interface BusinessSettingsPageProps {
  params: Promise<{
    "business-name": string;
  }>;
}

export default async function BusinessSettingsPage({ params }: BusinessSettingsPageProps) {
  const resolvedParams = await params;
  const businessName = decodeURIComponent(resolvedParams["business-name"]);
  
  return (
    <RestaurantLayout>
      <RestaurantSettings restaurantName={businessName} />
    </RestaurantLayout>
  );
}

