"use client";

import React, { useState, useEffect } from "react";
import {
    Edit2,
    Loader2,
    Save,
    Gift,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Trash2,
    User,
    ArrowLeft,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { toast } from "sonner";
import { rewardsApi, redemptionsApi } from "@/lib/api/rewards";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type {
    PointReward,
    PointRewardRedemption,
    UpdatePointRewardRedemptionDto,
} from "@/lib/types/rewards";
import { POINT_REWARD_REDEMPTION_STATUS } from "@/lib/types/rewards";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PAGINATION_LIMIT, PAGINATION_PAGE } from "@/lib/utils/constant";
import Link from "next/link";

interface RewardDetailScreenProps {
    restaurantName?: string;
    reward_id: string;
}

const RewardDetailScreen = ({ restaurantName, reward_id }: RewardDetailScreenProps) => {
    void restaurantName;
    const { user } = useAuthStore();
    const [reward, setReward] = useState<PointReward | null>(null);
    const [redemptions, setRedemptions] = useState<PointRewardRedemption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingRedemptions, setIsLoadingRedemptions] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: PAGINATION_PAGE,
        limit: PAGINATION_LIMIT,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
    });

    // Edit modal state
    const [editingRedemption, setEditingRedemption] = useState<PointRewardRedemption | null>(null);
    const [redemptionStatus, setRedemptionStatus] = useState<POINT_REWARD_REDEMPTION_STATUS>(
        POINT_REWARD_REDEMPTION_STATUS.PENDING
    );
    const [redemptionIsActive, setRedemptionIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dropdown menu state
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Delete confirmation state
    const [deleteConfirm, setDeleteConfirm] = useState<PointRewardRedemption | null>(null);

    const businessId = user?.businessId || "";

    useEffect(() => {
        if (!reward_id) {
            setError("Reward ID not found.");
            setIsLoading(false);
            return;
        }

        fetchRewardDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reward_id]);

    useEffect(() => {
        if (reward_id) {
            fetchRedemptions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reward_id, pagination.page]);

    // Close dropdown menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId && menuRefs.current[openMenuId]) {
                const menuElement = menuRefs.current[openMenuId];
                if (menuElement && !menuElement.contains(event.target as Node)) {
                    setOpenMenuId(null);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openMenuId]);

    const fetchRewardDetails = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await rewardsApi.getById(reward_id);
            setReward(response.data.point_reward);
        } catch (err) {
            if (err instanceof ApiClientError) {
                setError(err.message || "Failed to load reward details");
            } else {
                const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRedemptions = async () => {
        setIsLoadingRedemptions(true);

        try {
            const response = await redemptionsApi.getByPointReward(reward_id, {
                page: pagination.page,
                limit: pagination.limit,
                with_customer_detail: 'true',
                with_reward_detail: 'true',
            });

            setRedemptions(response.data.point_reward_redemptions || []);
            setPagination({
                page: response.data.metadata.page,
                limit: response.data.metadata.limit,
                total: response.data.metadata.total || 0,
                total_pages: response.data.metadata.total_pages || 0,
                has_next: response.data.metadata.has_next || false,
                has_prev: response.data.metadata.has_prev || false,
            });
        } catch (err) {
            if (err instanceof ApiClientError) {
                console.error("Failed to load redemptions:", err.message);
            } else {
                console.error("Failed to load redemptions:", err);
            }
        } finally {
            setIsLoadingRedemptions(false);
        }
    };

    const handleEdit = (redemption: PointRewardRedemption) => {
        setEditingRedemption(redemption);
        setRedemptionStatus(redemption.status || POINT_REWARD_REDEMPTION_STATUS.PENDING);
        setRedemptionIsActive(redemption.is_active ?? true);
        setOpenMenuId(null);
    };

    const handleDeleteClick = (redemption: PointRewardRedemption) => {
        setDeleteConfirm(redemption);
        setOpenMenuId(null);
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;

        const redemptionId = deleteConfirm.id;
        if (!redemptionId) {
            setError("Redemption ID not found. Cannot delete redemption.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await redemptionsApi.delete(redemptionId);

            toast.success("Redemption deleted successfully!", {
                description: "The redemption has been removed and points have been refunded",
                duration: 4000,
            });

            setDeleteConfirm(null);
            fetchRedemptions();
        } catch (err) {
            if (err instanceof ApiClientError) {
                const errorMessage = err.message || "Failed to delete redemption";
                setError(errorMessage);
                toast.error("Failed to delete redemption", {
                    description: errorMessage,
                });
            } else {
                const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
                setError(errorMessage);
                toast.error("Failed to delete redemption", {
                    description: errorMessage,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSave = async () => {
        if (!editingRedemption) {
            setError("No redemption selected for editing");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const payload: UpdatePointRewardRedemptionDto = {};

            if (redemptionStatus !== editingRedemption.status) {
                payload.status = redemptionStatus;
            }
            if (redemptionIsActive !== editingRedemption.is_active) {
                payload.is_active = redemptionIsActive;
            }

            if (Object.keys(payload).length === 0) {
                setIsSubmitting(false);
                setEditingRedemption(null);
                return;
            }

            await redemptionsApi.update(editingRedemption.id, payload);

            toast.success("Redemption updated successfully!", {
                description: "The redemption status has been updated",
                duration: 4000,
            });

            setEditingRedemption(null);
            resetForm();
            fetchRedemptions();
        } catch (err) {
            if (err instanceof ApiClientError) {
                const errorMessage = err.message || "Failed to update redemption";
                setError(errorMessage);
                toast.error("Failed to update redemption", {
                    description: errorMessage,
                });
            } else {
                const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
                setError(errorMessage);
                toast.error("Failed to update redemption", {
                    description: errorMessage,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setEditingRedemption(null);
        setRedemptionStatus(POINT_REWARD_REDEMPTION_STATUS.PENDING);
        setRedemptionIsActive(true);
    };

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "N/A";
        }
    };

    const getStatusIcon = (status: POINT_REWARD_REDEMPTION_STATUS) => {
        switch (status) {
            case POINT_REWARD_REDEMPTION_STATUS.COMPLETED:
                return <CheckCircle className="w-4 h-4" />;
            case POINT_REWARD_REDEMPTION_STATUS.FAILED:
                return <XCircle className="w-4 h-4" />;
            case POINT_REWARD_REDEMPTION_STATUS.PENDING:
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: POINT_REWARD_REDEMPTION_STATUS) => {
        switch (status) {
            case POINT_REWARD_REDEMPTION_STATUS.COMPLETED:
                return "bg-green-100 text-green-800";
            case POINT_REWARD_REDEMPTION_STATUS.FAILED:
                return "bg-red-100 text-red-800";
            case POINT_REWARD_REDEMPTION_STATUS.PENDING:
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    const getStatusLabel = (status: POINT_REWARD_REDEMPTION_STATUS) => {
        switch (status) {
            case POINT_REWARD_REDEMPTION_STATUS.COMPLETED:
                return "Completed";
            case POINT_REWARD_REDEMPTION_STATUS.FAILED:
                return "Failed";
            case POINT_REWARD_REDEMPTION_STATUS.PENDING:
            default:
                return "Pending";
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#7bc74d]" />
                    <span className="ml-3 text-gray-600">Loading reward details...</span>
                </div>
            </div>
        );
    }

    if (error && !reward) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600">{error}</p>
                </div>
                <Link
                    href={`/${encodeURIComponent(businessId)}/rewards`}
                    className="inline-flex items-center gap-2 text-[#7bc74d] hover:text-[#6ab63d] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Rewards
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <div className="mb-6">
                <Link
                    href={`/${encodeURIComponent(restaurantName || businessId)}/rewards`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-[#7bc74d] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Rewards
                </Link>
            </div>

            {/* Reward Details Card */}
            {reward && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center flex-shrink-0">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-gilroy-black text-black mb-2">
                                {reward.name}
                            </h1>
                            {reward.description && (
                                <p className="text-gray-600 mb-4">{reward.description}</p>
                            )}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Points Cost:</span>
                                    <span className="font-semibold text-[#7bc74d]">
                                        {reward.points_cost.toLocaleString()} pts
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Type:</span>
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                        {reward.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Status:</span>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${reward.is_active
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                        }`}>
                                        {reward.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Redemptions Section */}
            <div className="mb-6">
                <h2 className="text-xl font-gilroy-black text-black mb-2">Redemption History</h2>
                <p className="text-gray-600 text-sm">View and manage all redemptions for this reward</p>
            </div>

            {/* Redemptions Table */}
            {isLoadingRedemptions ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#7bc74d]" />
                    <span className="ml-3 text-gray-600">Loading redemptions...</span>
                </div>
            ) : redemptions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No redemptions found</h3>
                    <p className="text-gray-500">
                        No customers have redeemed this reward yet
                    </p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                                            Points Deducted
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                                            Active
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden xl:table-cell">
                                            Redeemed At
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {redemptions.map((redemption) => (
                                        <tr key={redemption.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <User className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {redemption.customer?.name || "Unknown Customer"}
                                                        </div>
                                                        <div className="text-xs text-gray-500 sm:hidden">
                                                            {redemption.points_deducted.toLocaleString()} pts
                                                        </div>
                                                        {redemption.customer?.email && (
                                                            <div className="text-xs text-gray-500">
                                                                {redemption.customer.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                                                <div className="text-sm font-semibold text-[#7bc74d]">
                                                    {redemption.points_deducted.toLocaleString()} pts
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(redemption.status)}`}>
                                                    {getStatusIcon(redemption.status)}
                                                    {getStatusLabel(redemption.status)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${redemption.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {redemption.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap hidden xl:table-cell">
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(redemption.redeemed_at)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="relative inline-block" ref={(el) => { menuRefs.current[redemption.id] = el; }}>
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === redemption.id ? null : redemption.id)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        aria-label="Actions"
                                                    >
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                    {openMenuId === redemption.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                            <button
                                                                onClick={() => handleEdit(redemption)}
                                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                                Edit Status
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(redemption)}
                                                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {pagination.total_pages > 1 && (
                        <div className="mb-6 flex items-center justify-between flex-col sm:flex-row gap-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 mt-6">
                            <div className="text-sm text-gray-700">
                                Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} total redemptions)
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={!pagination.has_prev}
                                    className="p-3 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white disabled:text-gray-700 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center min-w-[44px] min-h-[44px]"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="w-6 h-6 font-bold" />
                                </button>
                                <div className="flex items-center gap-1 sm:gap-2">
                                    {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                                        let pageNum: number;
                                        if (pagination.total_pages <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.page <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.page >= pagination.total_pages - 2) {
                                            pageNum = pagination.total_pages - 4 + i;
                                        } else {
                                            pageNum = pagination.page - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 ${pagination.page === pageNum
                                                    ? "bg-[#7bc74d] text-white shadow-md"
                                                    : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={!pagination.has_next}
                                    className="p-3 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white disabled:text-gray-700 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center min-w-[44px] min-h-[44px]"
                                    aria-label="Next page"
                                >
                                    <ChevronRight className="w-6 h-6 font-bold" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Edit Redemption Dialog */}
            <Dialog open={!!editingRedemption} onOpenChange={(open: boolean) => {
                if (!open) {
                    setEditingRedemption(null);
                    resetForm();
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-gilroy-black text-black">
                            Edit Redemption
                        </DialogTitle>
                        <DialogDescription>
                            Update the status and active state of this redemption.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Customer Info */}
                        {editingRedemption?.customer && (
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {editingRedemption.customer.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {editingRedemption.points_deducted.toLocaleString()} points deducted
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={redemptionStatus}
                                onChange={(e) => setRedemptionStatus(e.target.value as POINT_REWARD_REDEMPTION_STATUS)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black bg-white"
                            >
                                <option value={POINT_REWARD_REDEMPTION_STATUS.PENDING}>Pending</option>
                                <option value={POINT_REWARD_REDEMPTION_STATUS.COMPLETED}>Completed</option>
                                <option value={POINT_REWARD_REDEMPTION_STATUS.FAILED}>Failed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Active Status
                            </label>
                            <button
                                type="button"
                                onClick={() => setRedemptionIsActive(!redemptionIsActive)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${redemptionIsActive
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : "bg-gray-50 border-gray-200 text-gray-700"
                                    }`}
                            >
                                {redemptionIsActive ? (
                                    <ToggleRight className="w-5 h-5" />
                                ) : (
                                    <ToggleLeft className="w-5 h-5" />
                                )}
                                <span className="font-medium">{redemptionIsActive ? "Active" : "Inactive"}</span>
                            </button>
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            onClick={() => {
                                setEditingRedemption(null);
                                resetForm();
                            }}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onOpenChange={(open: boolean) => {
                if (!open) {
                    setDeleteConfirm(null);
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-gilroy-black text-black">Delete Redemption</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this redemption? The points will be refunded to the customer. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    {deleteConfirm?.customer && (
                        <div className="p-4 bg-gray-50 rounded-xl my-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {deleteConfirm.customer.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {deleteConfirm.points_deducted.toLocaleString()} points will be refunded
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <button
                            onClick={() => setDeleteConfirm(null)}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isSubmitting || !deleteConfirm}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </>
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RewardDetailScreen;
