import RestaurantLayout from "@/components/restaurant/RestaurantLayout";
import BranchesScreen from "@/views/restaurants/BranchesScreen";

interface BusinessBranchesPageProps {
  params: Promise<{
    "business-name": string;
  }>;
}

export default async function BusinessBranchesPage({ params }: BusinessBranchesPageProps) {
  await params; // Resolve params for Next.js
  
  return (
    <RestaurantLayout>
      <BranchesScreen />
    </RestaurantLayout>
  );
}

