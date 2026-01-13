import { PAGINATION_LIMIT, PAGINATION_PAGE } from "../utils/constant";
import { PaginationMetadata } from "./analytics";

export enum POINT_REWARD_TYPE {
    VOUCHER = 'VOUCHER',
    CASHBACK = 'CASHBACK',
    POINT_EXPIRY = 'POINT_EXPIRY',
    BONUS = 'BONUS',
}

export enum POINT_REWARD_REDEMPTION_STATUS {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export interface PointReward {
    id: string;
    business_id: string;
    name: string;
    description?: string;
    points_cost: number;
    type: POINT_REWARD_TYPE;
    is_active: boolean;
    metadata?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface PointRewardsResponse {
    message: string;
    status_code: number;
    data: {
        point_rewards: PointReward[];
        metadata: PaginationMetadata;
    };
}

export interface PointRewardResponse {
    message: string;
    status_code: number;
    data: {
        point_reward: PointReward;
    };
}

export class QueryPointRewardDto {
    business_id?: string;
    name?: string;
    type?: POINT_REWARD_TYPE;
    is_active?: 'true' | 'false';
    page?: number = PAGINATION_PAGE;
    limit?: number = PAGINATION_LIMIT;
    query?: string;
}

export interface CreatePointRewardDto {
    business_id: string;
    name: string;
    description?: string;
    points_cost: number;
    type?: POINT_REWARD_TYPE;
    is_active?: boolean;
    metadata?: Record<string, unknown>;
}

export interface UpdatePointRewardDto {
    name?: string;
    description?: string;
    points_cost?: number;
    type?: POINT_REWARD_TYPE;
    is_active?: boolean;
    metadata?: Record<string, unknown>;
}

// ============ Point Reward Redemption Types ============

export interface RedemptionCustomer {
    id: string;
    name: string;
    email?: string;
    phone_number?: string;
}

export interface RedemptionBusiness {
    id: string;
    name: string;
    registration_number?: string;
}

export interface RedemptionPointReward {
    id: string;
    name: string;
    description?: string;
    points_cost: number;
    type: POINT_REWARD_TYPE;
    business?: RedemptionBusiness;
}

export interface RedemptionCustomerBusiness {
    id: string;
    total_points: number;
    customer: RedemptionCustomer;
    business: RedemptionBusiness;
}

export interface PointRewardRedemption {
    id: string;
    point_reward_id: string;
    customer_business_id: string;
    points_deducted: number;
    status: POINT_REWARD_REDEMPTION_STATUS;
    redeemed_at: string;
    is_active: boolean;
    metadata?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    // Optional nested details (when with_*_detail query params are used)
    customer?: RedemptionCustomer;
    customer_total_points?: number;
    business?: RedemptionBusiness;
    point_reward?: RedemptionPointReward;
    customer_business?: RedemptionCustomerBusiness;
}

export interface PointRewardRedemptionsResponse {
    message: string;
    status_code: number;
    data: {
        point_reward_redemptions: PointRewardRedemption[];
        metadata: PaginationMetadata;
    };
}

export interface PointRewardRedemptionResponse {
    message: string;
    status_code: number;
    data: {
        point_reward_redemption: PointRewardRedemption;
    };
}

export interface QueryPointRewardRedemptionDto {
    point_reward_id?: string;
    customer_business_id?: string;
    business_id?: string;
    customer_id?: string;
    status?: POINT_REWARD_REDEMPTION_STATUS;
    is_active?: 'true' | 'false';
    page?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
    with_customer_detail?: 'true' | 'false';
    with_business_detail?: 'true' | 'false';
    with_reward_detail?: 'true' | 'false';
}

export interface CreatePointRewardRedemptionDto {
    point_reward_id: string;
    customer_business_id: string;
    points_deducted?: number;
    status?: POINT_REWARD_REDEMPTION_STATUS;
    is_active?: boolean;
    metadata?: Record<string, unknown>;
}

export interface CreatePointRewardRedemptionWithCustomerIdDto {
    customer_id: string;
    point_reward_id: string;
    employee_id: string;
    branch_id: string;
    status?: POINT_REWARD_REDEMPTION_STATUS;
    is_active?: boolean;
    metadata?: Record<string, unknown>;
}

export interface UpdatePointRewardRedemptionDto {
    status?: POINT_REWARD_REDEMPTION_STATUS;
    is_active?: boolean;
}
