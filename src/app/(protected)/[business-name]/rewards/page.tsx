import { Suspense } from "react";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";
import RewardScreen from "@/views/restaurants/RewardScreen";

interface BusinessRewardsPageProps {
    params: Promise<{
        "business-name": string;
    }>;
}

export default async function BusinessRewardsPage({ params }: BusinessRewardsPageProps) {
    const resolvedParams = await params;
    const businessName = decodeURIComponent(resolvedParams["business-name"]);

    return (
        <RestaurantLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <RewardScreen restaurantName={businessName} />
            </Suspense>
        </RestaurantLayout>
    );
}
