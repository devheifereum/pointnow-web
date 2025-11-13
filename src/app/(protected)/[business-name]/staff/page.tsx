import RestaurantLayout from "@/components/restaurant/RestaurantLayout";
import StaffScreen from "@/views/restaurants/StaffScreen";

interface BusinessStaffPageProps {
  params: Promise<{
    "business-name": string;
  }>;
}

export default async function BusinessStaffPage({ params }: BusinessStaffPageProps) {
  await params; // Resolve params for Next.js
  
  return (
    <RestaurantLayout>
      <StaffScreen />
    </RestaurantLayout>
  );
}

