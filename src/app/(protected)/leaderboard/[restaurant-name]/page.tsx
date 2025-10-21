import RestaurantProfile from "@/components/RestaurantProfile";

interface RestaurantProfilePageProps {
  params: Promise<{
    "restaurant-name": string;
  }>;
}

export default async function RestaurantProfilePage({ params }: RestaurantProfilePageProps) {
  const resolvedParams = await params;
  const restaurantName = decodeURIComponent(resolvedParams["restaurant-name"]);
  
  return <RestaurantProfile restaurantName={restaurantName} />;
}
