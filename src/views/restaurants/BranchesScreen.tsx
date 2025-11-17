"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Save, Building2 } from "lucide-react";
import { branchesApi } from "@/lib/api/branches";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import type { Branch } from "@/lib/types/branches";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BranchesScreen() {
  const { user } = useAuthStore();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });
  
  // Create/Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branchName, setBranchName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const businessId = user?.businessId || "";

  useEffect(() => {
    if (!businessId) {
      setError("Business ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, pagination.page]);

  const fetchBranches = async () => {
    if (!businessId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await branchesApi.getAll({
        business_id: businessId,
        page: pagination.page,
        limit: pagination.limit,
      });

      setBranches(response.data.branches || []);
      setPagination({
        page: response.data.metadata.page,
        limit: response.data.metadata.limit,
        total: response.data.metadata.total,
        total_pages: response.data.metadata.total_pages,
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Use the server's error message directly
        setError(err.message || "Failed to load branches");
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBranch(null);
    setBranchName("");
    setShowModal(true);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setBranchName(branch.name);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!branchName.trim() || !businessId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingBranch) {
        // Update existing branch
        await branchesApi.update(editingBranch.id, {
          name: branchName.trim(),
        });
      } else {
        // Create new branch
        await branchesApi.create({
          name: branchName.trim(),
          business_id: businessId,
        });
      }

      setShowModal(false);
      setBranchName("");
      setEditingBranch(null);
      fetchBranches();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "Failed to save branch");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (branchId: string) => {
    if (!branchId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await branchesApi.delete(branchId);
      setDeleteConfirm(null);
      fetchBranches();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "Failed to delete branch");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-gilroy-black text-black mb-2">Branches Management</h1>
              <p className="text-gray-600">Manage your business branches</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Branch
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Branches Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#7bc74d]" />
              <span className="ml-3 text-gray-600">Loading branches...</span>
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No branches found</p>
              <p className="text-gray-400 text-sm mt-2">Create your first branch to get started</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-gilroy-extrabold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-gilroy-extrabold text-gray-700">Created At</th>
                      <th className="px-6 py-4 text-right text-sm font-gilroy-extrabold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {branches.map((branch) => (
                      <tr key={branch.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-lg flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-black">{branch.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {branch.created_at
                            ? new Date(branch.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(branch)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit branch"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(branch.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete branch"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} total)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      disabled={pagination.page >= pagination.total_pages}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={(open) => {
        if (!open) {
                  setShowModal(false);
                  setBranchName("");
                  setEditingBranch(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-gilroy-black text-black">
              {editingBranch ? "Edit Branch" : "Create New Branch"}
            </DialogTitle>
            <DialogDescription>
              {editingBranch ? "Update the branch information" : "Add a new branch to your business"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Branch Name *
                </label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="e.g., Gombak"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                setShowModal(false);
                setBranchName("");
                setEditingBranch(null);
              }}
              className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
                <button
                  onClick={handleSave}
                  disabled={!branchName.trim() || isSubmitting}
              className="bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingBranch ? "Update" : "Create"}
                    </>
                  )}
                </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => {
        if (!open) {
          setDeleteConfirm(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-gilroy-black text-black">Delete Branch</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this branch? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
                <button
              onClick={() => setDeleteConfirm(null)}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              <button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                disabled={isSubmitting || !deleteConfirm}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

