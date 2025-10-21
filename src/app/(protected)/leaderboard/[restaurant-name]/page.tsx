import RestaurantProfile from "@/components/RestaurantProfile";

interface RestaurantProfilePageProps {
  params: {
    "restaurant-name": string;
  };
}

export default function RestaurantProfilePage({ params }: RestaurantProfilePageProps) {
  const restaurantName = decodeURIComponent(params["restaurant-name"]);
  
  return <RestaurantProfile restaurantName={restaurantName} />;
}
