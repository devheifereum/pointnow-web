import { api } from "./client";
import type {
    PointRewardsResponse,
    PointRewardResponse,
    CreatePointRewardDto,
    UpdatePointRewardDto,
    QueryPointRewardDto,
    PointRewardRedemptionsResponse,
    PointRewardRedemptionResponse,
    CreatePointRewardRedemptionDto,
    UpdatePointRewardRedemptionDto,
    QueryPointRewardRedemptionDto,
    CreatePointRewardRedemptionWithCustomerIdDto,
} from "../types/rewards";

export const rewardsApi = {
    getAll: async (params?: QueryPointRewardDto): Promise<PointRewardsResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.business_id) {
            queryParams.append("business_id", params.business_id);
        }

        if (params?.type) {
            queryParams.append("type", params.type);
        }
        if (params?.is_active) {
            queryParams.append("is_active", params.is_active);
        }
        if (params?.page) {
            queryParams.append("page", params.page.toString());
        }
        if (params?.limit) {
            queryParams.append("limit", params.limit.toString());
        }
        if (params?.query) {
            queryParams.append("name", params.query);
        }

        const queryString = queryParams.toString();
        return api.get<PointRewardsResponse>(`/point_rewards${queryString ? `?${queryString}` : ""}`);
    },

    getByBusiness: async (businessId: string, params?: Omit<QueryPointRewardDto, 'business_id'>): Promise<PointRewardsResponse> => {
        const queryParams = new URLSearchParams();


        if (params?.type) {
            queryParams.append("type", params.type);
        }
        if (params?.is_active) {
            queryParams.append("is_active", params.is_active);
        }
        if (params?.page) {
            queryParams.append("page", params.page.toString());
        }
        if (params?.limit) {
            queryParams.append("limit", params.limit.toString());
        }
        if (params?.query) {
            queryParams.append("name", params.query);
        }

        const queryString = queryParams.toString();
        return api.get<PointRewardsResponse>(`/point_rewards/business/${businessId}${queryString ? `?${queryString}` : ""}`);
    },

    getById: async (id: string): Promise<PointRewardResponse> => {
        return api.get<PointRewardResponse>(`/point_rewards/${id}`);
    },

    create: async (payload: CreatePointRewardDto): Promise<PointRewardResponse> => {
        return api.post<PointRewardResponse>("/point_rewards", payload);
    },

    update: async (id: string, payload: UpdatePointRewardDto): Promise<PointRewardResponse> => {
        return api.patch<PointRewardResponse>(`/point_rewards/${id}`, payload);
    },

    delete: async (id: string): Promise<PointRewardResponse> => {
        return api.delete<PointRewardResponse>(`/point_rewards/${id}`);
    },
};

// ============ Point Reward Redemption API ============

export const redemptionsApi = {
    getAll: async (params?: QueryPointRewardRedemptionDto): Promise<PointRewardRedemptionsResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.point_reward_id) {
            queryParams.append("point_reward_id", params.point_reward_id);
        }
        if (params?.customer_business_id) {
            queryParams.append("customer_business_id", params.customer_business_id);
        }
        if (params?.business_id) {
            queryParams.append("business_id", params.business_id);
        }
        if (params?.customer_id) {
            queryParams.append("customer_id", params.customer_id);
        }
        if (params?.status) {
            queryParams.append("status", params.status);
        }
        if (params?.is_active) {
            queryParams.append("is_active", params.is_active);
        }
        if (params?.page) {
            queryParams.append("page", params.page.toString());
        }
        if (params?.limit) {
            queryParams.append("limit", params.limit.toString());
        }
        if (params?.start_date) {
            queryParams.append("start_date", params.start_date);
        }
        if (params?.end_date) {
            queryParams.append("end_date", params.end_date);
        }
        if (params?.with_customer_detail) {
            queryParams.append("with_customer_detail", params.with_customer_detail);
        }
        if (params?.with_business_detail) {
            queryParams.append("with_business_detail", params.with_business_detail);
        }
        if (params?.with_reward_detail) {
            queryParams.append("with_reward_detail", params.with_reward_detail);
        }

        const queryString = queryParams.toString();
        return api.get<PointRewardRedemptionsResponse>(`/point_reward_redemptions${queryString ? `?${queryString}` : ""}`);
    },

    getByBusiness: async (businessId: string, params?: Omit<QueryPointRewardRedemptionDto, 'business_id'>): Promise<PointRewardRedemptionsResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.point_reward_id) {
            queryParams.append("point_reward_id", params.point_reward_id);
        }
        if (params?.customer_business_id) {
            queryParams.append("customer_business_id", params.customer_business_id);
        }
        if (params?.customer_id) {
            queryParams.append("customer_id", params.customer_id);
        }
        if (params?.status) {
            queryParams.append("status", params.status);
        }
        if (params?.is_active) {
            queryParams.append("is_active", params.is_active);
        }
        if (params?.page) {
            queryParams.append("page", params.page.toString());
        }
        if (params?.limit) {
            queryParams.append("limit", params.limit.toString());
        }
        if (params?.start_date) {
            queryParams.append("start_date", params.start_date);
        }
        if (params?.end_date) {
            queryParams.append("end_date", params.end_date);
        }
        if (params?.with_customer_detail) {
            queryParams.append("with_customer_detail", params.with_customer_detail);
        }
        if (params?.with_business_detail) {
            queryParams.append("with_business_detail", params.with_business_detail);
        }
        if (params?.with_reward_detail) {
            queryParams.append("with_reward_detail", params.with_reward_detail);
        }

        const queryString = queryParams.toString();
        return api.get<PointRewardRedemptionsResponse>(`/point_reward_redemptions/business/${businessId}${queryString ? `?${queryString}` : ""}`);
    },

    getByPointReward: async (pointRewardId: string, params?: Omit<QueryPointRewardRedemptionDto, 'point_reward_id'>): Promise<PointRewardRedemptionsResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.customer_business_id) {
            queryParams.append("customer_business_id", params.customer_business_id);
        }
        if (params?.business_id) {
            queryParams.append("business_id", params.business_id);
        }
        if (params?.customer_id) {
            queryParams.append("customer_id", params.customer_id);
        }
        if (params?.status) {
            queryParams.append("status", params.status);
        }
        if (params?.is_active) {
            queryParams.append("is_active", params.is_active);
        }
        if (params?.page) {
            queryParams.append("page", params.page.toString());
        }
        if (params?.limit) {
            queryParams.append("limit", params.limit.toString());
        }
        if (params?.start_date) {
            queryParams.append("start_date", params.start_date);
        }
        if (params?.end_date) {
            queryParams.append("end_date", params.end_date);
        }
        if (params?.with_customer_detail) {
            queryParams.append("with_customer_detail", params.with_customer_detail);
        }
        if (params?.with_business_detail) {
            queryParams.append("with_business_detail", params.with_business_detail);
        }
        if (params?.with_reward_detail) {
            queryParams.append("with_reward_detail", params.with_reward_detail);
        }

        queryParams.append("point_reward_id", pointRewardId);

        const queryString = queryParams.toString();
        return api.get<PointRewardRedemptionsResponse>(`/point_reward_redemptions?${queryString}`);
    },

    getByCustomer: async (customerId: string, params?: Omit<QueryPointRewardRedemptionDto, 'customer_id'>): Promise<PointRewardRedemptionsResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.point_reward_id) {
            queryParams.append("point_reward_id", params.point_reward_id);
        }
        if (params?.customer_business_id) {
            queryParams.append("customer_business_id", params.customer_business_id);
        }
        if (params?.business_id) {
            queryParams.append("business_id", params.business_id);
        }
        if (params?.status) {
            queryParams.append("status", params.status);
        }
        if (params?.is_active) {
            queryParams.append("is_active", params.is_active);
        }
        if (params?.page) {
            queryParams.append("page", params.page.toString());
        }
        if (params?.limit) {
            queryParams.append("limit", params.limit.toString());
        }
        if (params?.start_date) {
            queryParams.append("start_date", params.start_date);
        }
        if (params?.end_date) {
            queryParams.append("end_date", params.end_date);
        }
        if (params?.with_customer_detail) {
            queryParams.append("with_customer_detail", params.with_customer_detail);
        }
        if (params?.with_business_detail) {
            queryParams.append("with_business_detail", params.with_business_detail);
        }
        if (params?.with_reward_detail) {
            queryParams.append("with_reward_detail", params.with_reward_detail);
        }

        const queryString = queryParams.toString();
        return api.get<PointRewardRedemptionsResponse>(`/point_reward_redemptions/customer/${customerId}${queryString ? `?${queryString}` : ""}`);
    },

    getById: async (id: string): Promise<PointRewardRedemptionResponse> => {
        return api.get<PointRewardRedemptionResponse>(`/point_reward_redemptions/${id}`);
    },

    create: async (payload: CreatePointRewardRedemptionDto): Promise<PointRewardRedemptionResponse> => {
        return api.post<PointRewardRedemptionResponse>("/point_reward_redemptions", payload);
    },

    createWithCustomerId: async (payload: CreatePointRewardRedemptionWithCustomerIdDto): Promise<PointRewardRedemptionResponse> => {
        return api.post<PointRewardRedemptionResponse>("/point_reward_redemptions/customer", payload);
    },

    update: async (id: string, payload: UpdatePointRewardRedemptionDto): Promise<PointRewardRedemptionResponse> => {
        return api.patch<PointRewardRedemptionResponse>(`/point_reward_redemptions/${id}`, payload);
    },

    delete: async (id: string): Promise<PointRewardRedemptionResponse> => {
        return api.delete<PointRewardRedemptionResponse>(`/point_reward_redemptions/${id}`);
    },
};
