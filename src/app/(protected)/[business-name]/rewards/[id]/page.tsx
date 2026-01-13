import { Suspense } from "react";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";
import RewardDetailScreen from "@/views/restaurants/RewardDetailScreen";

interface BusinessRewardDetailPageProps {
    params: Promise<{
        "business-name": string;
        id: string;
    }>;
}

export default async function BusinessRewardDetailPage({ params }: BusinessRewardDetailPageProps) {
    const resolvedParams = await params;
    const businessName = decodeURIComponent(resolvedParams["business-name"]);
    const reward_id = resolvedParams["id"];
    return (
        <RestaurantLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <RewardDetailScreen restaurantName={businessName} reward_id={reward_id} />
            </Suspense>
        </RestaurantLayout>
    );
}
