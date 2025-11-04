import RestaurantSettings from "@/views/restaurants/RestaurantSettings";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";

interface RestaurantSettingsPageProps {
  params: Promise<{
    "restaurant-name": string;
  }>;
}

export default async function RestaurantSettingsPage({ params }: RestaurantSettingsPageProps) {
  const resolvedParams = await params;
  const restaurantName = decodeURIComponent(resolvedParams["restaurant-name"]);
  
  return (
    <RestaurantLayout>
      <RestaurantSettings restaurantName={restaurantName} />
    </RestaurantLayout>
  );
}

