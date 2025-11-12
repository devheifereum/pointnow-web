import RestaurantLayout from "@/components/restaurant/RestaurantLayout";
import StaffScreen from "@/views/restaurants/StaffScreen";

interface RestaurantStaffPageProps {
  params: Promise<{
    "restaurant-name": string;
  }>;
}

export default async function RestaurantStaffPage({ params }: RestaurantStaffPageProps) {
  await params; // Resolve params for Next.js
  
  return (
    <RestaurantLayout>
      <StaffScreen />
    </RestaurantLayout>
  );
}

