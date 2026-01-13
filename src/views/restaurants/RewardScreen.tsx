"use client";

import React, { useState, useEffect } from "react";
import {
    Edit2,
    Loader2,
    Save,
    Gift,
    ChevronLeft,
    ChevronRight,
    Plus,
    MoreVertical,
    Trash2,
    Coins,
    ToggleLeft,
    ToggleRight,
    Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { rewardsApi } from "@/lib/api/rewards";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { PointReward, CreatePointRewardDto, UpdatePointRewardDto } from "@/lib/types/rewards";
import { POINT_REWARD_TYPE } from "@/lib/types/rewards";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PAGINATION_LIMIT, PAGINATION_PAGE } from "@/lib/utils/constant";

interface RewardScreenProps {
    restaurantName?: string;
}

export default function RewardScreen({ restaurantName }: RewardScreenProps) {
    const router = useRouter();
    const { user } = useAuthStore();
    const [rewards, setRewards] = useState<PointReward[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: PAGINATION_PAGE,
        limit: PAGINATION_LIMIT,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
    });

    // Create/Edit modal state
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingReward, setEditingReward] = useState<PointReward | null>(null);
    const [rewardName, setRewardName] = useState("");
    const [rewardDescription, setRewardDescription] = useState("");
    const [rewardPointsCost, setRewardPointsCost] = useState<number>(0);
    const [rewardType, setRewardType] = useState<POINT_REWARD_TYPE>(POINT_REWARD_TYPE.VOUCHER);
    const [rewardIsActive, setRewardIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dropdown menu state
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Delete confirmation state
    const [deleteConfirm, setDeleteConfirm] = useState<PointReward | null>(null);

    const businessId = user?.businessId || "";

    useEffect(() => {
        if (!businessId) {
            setError("Business ID not found. Please log in again.");
            setIsLoading(false);
            return;
        }

        fetchRewards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessId, pagination.page]);

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

    const fetchRewards = async () => {
        if (!businessId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await rewardsApi.getByBusiness(businessId, {
                page: pagination.page,
                limit: pagination.limit,
            });

            setRewards(response.data.point_rewards || []);
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
                setError(err.message || "Failed to load rewards");
            } else {
                const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingReward(null);
        setRewardName("");
        setRewardDescription("");
        setRewardPointsCost(0);
        setRewardType(POINT_REWARD_TYPE.VOUCHER);
        setRewardIsActive(true);
        setShowCreateDialog(true);
    };

    const handleEdit = (reward: PointReward) => {
        setEditingReward(reward);
        setRewardName(reward.name || "");
        setRewardDescription(reward.description || "");
        setRewardPointsCost(reward.points_cost || 0);
        setRewardType(reward.type || POINT_REWARD_TYPE.VOUCHER);
        setRewardIsActive(reward.is_active ?? true);
        setShowCreateDialog(true);
        setOpenMenuId(null);
    };

    const handleDeleteClick = (reward: PointReward) => {
        setDeleteConfirm(reward);
        setOpenMenuId(null);
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;

        const rewardId = deleteConfirm.id;
        if (!rewardId) {
            setError("Reward ID not found. Cannot delete reward.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await rewardsApi.delete(rewardId);

            toast.success("Reward deleted successfully!", {
                description: `${deleteConfirm.name} has been removed`,
                duration: 4000,
            });

            setDeleteConfirm(null);
            fetchRewards();
        } catch (err) {
            if (err instanceof ApiClientError) {
                const errorMessage = err.message || "Failed to delete reward";
                setError(errorMessage);
                toast.error("Failed to delete reward", {
                    description: errorMessage,
                });
            } else {
                const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
                setError(errorMessage);
                toast.error("Failed to delete reward", {
                    description: errorMessage,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSave = async () => {
        if (!rewardName.trim() || !businessId) {
            setError("Please fill in all required fields");
            return;
        }

        if (rewardPointsCost < 0) {
            setError("Points cost must be a positive number");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            if (editingReward) {
                // Update existing reward
                const payload: UpdatePointRewardDto = {};

                if (rewardName.trim() !== editingReward.name) {
                    payload.name = rewardName.trim();
                }
                if (rewardDescription.trim() !== (editingReward.description || "")) {
                    payload.description = rewardDescription.trim() || undefined;
                }
                if (rewardPointsCost !== editingReward.points_cost) {
                    payload.points_cost = rewardPointsCost;
                }
                if (rewardType !== editingReward.type) {
                    payload.type = rewardType;
                }
                if (rewardIsActive !== editingReward.is_active) {
                    payload.is_active = rewardIsActive;
                }

                if (Object.keys(payload).length === 0) {
                    setIsSubmitting(false);
                    setShowCreateDialog(false);
                    return;
                }

                await rewardsApi.update(editingReward.id, payload);

                toast.success("Reward updated successfully!", {
                    description: `${rewardName} has been updated`,
                    duration: 4000,
                });
            } else {
                // Create new reward
                const payload: CreatePointRewardDto = {
                    business_id: businessId,
                    name: rewardName.trim(),
                    description: rewardDescription.trim() || undefined,
                    points_cost: rewardPointsCost,
                    type: rewardType,
                    is_active: rewardIsActive,
                };

                await rewardsApi.create(payload);

                toast.success("Reward created successfully!", {
                    description: `${rewardName} has been added`,
                    duration: 4000,
                });
            }

            setShowCreateDialog(false);
            resetForm();
            fetchRewards();
        } catch (err) {
            if (err instanceof ApiClientError) {
                const errorMessage = err.message || "Failed to save reward";
                setError(errorMessage);
                toast.error("Failed to save reward", {
                    description: errorMessage,
                });
            } else {
                const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
                setError(errorMessage);
                toast.error("Failed to save reward", {
                    description: errorMessage,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setEditingReward(null);
        setRewardName("");
        setRewardDescription("");
        setRewardPointsCost(0);
        setRewardType(POINT_REWARD_TYPE.VOUCHER);
        setRewardIsActive(true);
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
            });
        } catch {
            return "N/A";
        }
    };

    const getRewardTypeLabel = (type: POINT_REWARD_TYPE) => {
        switch (type) {
            case POINT_REWARD_TYPE.VOUCHER:
                return "Voucher";
            case POINT_REWARD_TYPE.CASHBACK:
                return "Cashback";
            case POINT_REWARD_TYPE.POINT_EXPIRY:
                return "Point Expiry";
            case POINT_REWARD_TYPE.BONUS:
                return "Bonus";
            default:
                return type;
        }
    };

    const getRewardTypeColor = (type: POINT_REWARD_TYPE) => {
        switch (type) {
            case POINT_REWARD_TYPE.VOUCHER:
                return "bg-purple-100 text-purple-800";
            case POINT_REWARD_TYPE.CASHBACK:
                return "bg-green-100 text-green-800";
            case POINT_REWARD_TYPE.POINT_EXPIRY:
                return "bg-orange-100 text-orange-800";
            case POINT_REWARD_TYPE.BONUS:
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-gilroy-black text-black mb-2">Reward Management</h1>
                        <p className="text-gray-600 text-sm sm:text-base">Create and manage point rewards for your customers</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={isLoading || !businessId}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg disabled:shadow-none whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Reward</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Rewards Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#7bc74d]" />
                    <span className="ml-3 text-gray-600">Loading rewards...</span>
                </div>
            ) : rewards.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
                    <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No rewards found</h3>
                    <p className="text-gray-500 mb-4">
                        Create your first reward to start engaging customers
                    </p>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold rounded-xl transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Reward</span>
                    </button>
                </div>
            ) : (
                <>


                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Reward
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                                            Points Cost
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden xl:table-cell">
                                            Created
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rewards.map((reward) => (
                                        <tr key={reward.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Gift className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-semibold text-gray-900">{reward.name}</div>
                                                        <div className="text-xs text-gray-500 sm:hidden">
                                                            {reward.points_cost.toLocaleString()} pts
                                                        </div>
                                                        {reward.description && (
                                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                                                {reward.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                                                <div className="text-sm font-semibold text-[#7bc74d]">
                                                    {reward.points_cost.toLocaleString()} pts
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRewardTypeColor(reward.type)}`}>
                                                    {getRewardTypeLabel(reward.type)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${reward.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {reward.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap hidden xl:table-cell">
                                                <div className="text-sm text-gray-500">{formatDate(reward.created_at)}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="relative inline-block" ref={(el) => { menuRefs.current[reward.id] = el; }}>
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === reward.id ? null : reward.id)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        aria-label="Actions"
                                                    >
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                    {openMenuId === reward.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                            <button
                                                                onClick={() => {
                                                                    setOpenMenuId(null);
                                                                    router.push(`/${encodeURIComponent(restaurantName || "")}/rewards/${reward.id}`);
                                                                }}
                                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(reward)}
                                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(reward)}
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

                    {pagination.total_pages > 1 && (
                        <div className="mb-6 flex items-center justify-between flex-col sm:flex-row gap-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 mt-6">
                            <div className="text-sm text-gray-700">
                                Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} total rewards)
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

            {/* Create/Edit Reward Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={(open: boolean) => {
                if (!open) {
                    setShowCreateDialog(false);
                    resetForm();
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-gilroy-black text-black">
                            {editingReward ? "Edit Reward" : "Create Reward"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingReward
                                ? "Update reward information. Only changed fields will be updated."
                                : "Create a new point reward for your customers."
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Name *
                            </label>
                            <div className="relative">
                                <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={rewardName}
                                    onChange={(e) => setRewardName(e.target.value)}
                                    placeholder="Enter reward name"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={rewardDescription}
                                onChange={(e) => setRewardDescription(e.target.value)}
                                placeholder="Enter reward description (optional)"
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Points Cost *
                            </label>
                            <div className="relative">
                                <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    value={rewardPointsCost}
                                    onChange={(e) => setRewardPointsCost(Math.max(0, parseInt(e.target.value) || 0))}
                                    placeholder="Enter points cost"
                                    min={0}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Type
                            </label>
                            <select
                                value={rewardType}
                                onChange={(e) => setRewardType(e.target.value as POINT_REWARD_TYPE)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black bg-white"
                            >
                                <option value={POINT_REWARD_TYPE.VOUCHER}>Voucher</option>
                                <option value={POINT_REWARD_TYPE.CASHBACK}>Cashback</option>
                                <option value={POINT_REWARD_TYPE.BONUS}>Bonus</option>
                                <option value={POINT_REWARD_TYPE.POINT_EXPIRY}>Point Expiry</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Status
                            </label>
                            <button
                                type="button"
                                onClick={() => setRewardIsActive(!rewardIsActive)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${rewardIsActive
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : "bg-gray-50 border-gray-200 text-gray-700"
                                    }`}
                            >
                                {rewardIsActive ? (
                                    <ToggleRight className="w-5 h-5" />
                                ) : (
                                    <ToggleLeft className="w-5 h-5" />
                                )}
                                <span className="font-medium">{rewardIsActive ? "Active" : "Inactive"}</span>
                            </button>
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            onClick={() => {
                                setShowCreateDialog(false);
                                resetForm();
                            }}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting || !rewardName.trim()}
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
                                    <span>{editingReward ? "Save Changes" : "Create Reward"}</span>
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
                        <DialogTitle className="text-2xl font-gilroy-black text-black">Delete Reward</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {deleteConfirm?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

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
}
