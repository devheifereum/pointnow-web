"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Edit2, Loader2, Save, User, Mail, ChevronLeft, ChevronRight, Download, Upload, X, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { customersApi } from "@/lib/api/customers";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import { convertPhoneNumber } from "@/lib/utils";
import type { Customer } from "@/lib/types/customers";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import * as XLSX from 'xlsx';
import { csvToJson, convertToBatchPayload, type ParsedCustomer } from "@/lib/utils/csvToJson";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomersScreenProps {
  restaurantName?: string;
}

export default function CustomersScreen({ restaurantName }: CustomersScreenProps) {
  // restaurantName is available but not currently used
  void restaurantName;
  const { user } = useAuthStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });
  
  // Edit modal state
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phoneValue, setPhoneValue] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Dropdown menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<Customer | null>(null);
  
  // Import CSV state
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedCustomers, setParsedCustomers] = useState<ParsedCustomer[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const businessId = user?.businessId || "";

  // Memoize the phone input component to prevent re-renders that cause focus loss
  const PhoneInputComponent = useMemo(() => {
    const Component = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
      (props, ref) => (
        <input
          {...props}
          ref={ref}
          className="w-full text-black placeholder-gray-400"
        />
      )
    );
    Component.displayName = "PhoneInputComponent";
    return Component;
  }, []);

  useEffect(() => {
    if (!businessId) {
      setError("Business ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    fetchCustomers();
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

  const fetchCustomers = async () => {
    if (!businessId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use search endpoint with empty query to get all customers
      const response = await customersApi.search({
        query: "",
        business_id: businessId,
        page: pagination.page,
        limit: pagination.limit,
      });

      setCustomers(response.data.customers || []);
      setPagination({
        page: response.data.metadata.page,
        limit: response.data.metadata.limit,
        total: response.data.metadata.total || 0,
        total_pages: response.data.metadata.total_pages || 0,
        has_next: response.data.metadata.has_next || false,
        has_previous: response.data.metadata.has_previous || false,
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Use the server's error message directly
        setError(err.message || "Failed to load customers");
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerName(customer.name || "");
    setCustomerEmail(customer.email || "");
    setPhoneValue(customer.phone_number || undefined);
    setOpenMenuId(null); // Close menu
  };

  const handleDeleteClick = (customer: Customer) => {
    setDeleteConfirm(customer);
    setOpenMenuId(null); // Close menu
  };

  const handleDelete = async () => {
    if (!deleteConfirm || !businessId) return;

    const customerId = deleteConfirm.id;
    if (!customerId) {
      setError("Customer ID not found. Cannot delete customer.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await customersApi.delete(customerId, businessId);

      toast.success("Customer deleted successfully!", {
        description: `${deleteConfirm.name} has been removed from your business`,
        duration: 4000,
      });

      setDeleteConfirm(null);
      fetchCustomers();
    } catch (err) {
      if (err instanceof ApiClientError) {
        const errorMessage = err.message || "Failed to delete customer";
        setError(errorMessage);
        toast.error("Failed to delete customer", {
          description: errorMessage,
        });
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        toast.error("Failed to delete customer", {
          description: errorMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (!editingCustomer || !customerName.trim() || !businessId) {
      setError("Please fill in all required fields");
      return;
    }

    const customerId = editingCustomer.id;
    
    if (!customerId) {
      setError("Customer ID not found. Cannot update customer.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Build payload with only changed fields
      const payload: { name?: string; email?: string; phone_number?: string } = {};
      
      const trimmedName = customerName.trim();
      const trimmedEmail = customerEmail.trim();
      const trimmedPhone = phoneValue ? convertPhoneNumber(phoneValue.trim()) : "";
      const originalName = (editingCustomer.name || "").trim();
      const originalEmail = (editingCustomer.email || "").trim();
      const originalPhone = (editingCustomer.phone_number || "").trim();

      // Only include fields that have changed
      if (trimmedName !== originalName) {
        payload.name = trimmedName;
      }
      
      if (trimmedEmail !== originalEmail) {
        payload.email = trimmedEmail || undefined;
      }
      
      if (trimmedPhone !== originalPhone) {
        payload.phone_number = trimmedPhone || " ";
      }

      // Only make the API call if there are actual changes
      if (Object.keys(payload).length === 0) {
        setIsSubmitting(false);
        setEditingCustomer(null);
        return;
      }

      await customersApi.updateByBusiness(customerId, businessId, payload);

      toast.success("Customer updated successfully!", {
        description: `${customerName}'s information has been updated`,
        duration: 4000,
      });

      setEditingCustomer(null);
      setCustomerName("");
      setCustomerEmail("");
      setPhoneValue(undefined);
      fetchCustomers();
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Use the server's error message directly
        const errorMessage = err.message || "Failed to update customer";
        setError(errorMessage);
        toast.error("Failed to update customer", {
          description: errorMessage,
        });
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        toast.error("Failed to update customer", {
          description: errorMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
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

  // Helper function to get customer points
  const getCustomerPoints = (customer: Customer): number => {
    // First check if customer_businesses exists and find the matching business
    if (customer.customer_businesses && customer.customer_businesses.length > 0) {
      const customerBusiness = customer.customer_businesses.find(
        (cb) => cb.business?.id === businessId
      );
      if (customerBusiness && customerBusiness.total_points !== undefined) {
        return customerBusiness.total_points;
      }
    }
    // Fallback to total_points if available (from search API or other endpoints)
    if (customer.total_points !== undefined) {
      return customer.total_points;
    }
    // Legacy fallback
    return customer.points || 0;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error("Invalid file type", {
        description: "Please upload a CSV or Excel file",
      });
      return;
    }

    setSelectedFile(file);
    setIsParsing(true);
    setParseErrors([]);
    setParsedCustomers([]);

    try {
      const result = await csvToJson(file, businessId);
      
      if (result.success && result.data) {
        // Always set valid customers for preview
        setParsedCustomers(result.data);
        
        // If there are any errors, show them but still allow preview
        if (result.errors && result.errors.length > 0) {
          setParseErrors(result.errors);
          toast.error("File has errors", {
            description: `Found ${result.data.length} valid customer(s) but ${result.errors.length} error(s) - please fix errors before uploading`,
          });
        } else {
          setParseErrors([]);
          toast.success("File parsed successfully", {
            description: `Found ${result.data.length} valid customer(s)`,
          });
        }
      } else {
        setParseErrors(result.errors || ["Failed to parse file"]);
        setParsedCustomers([]); // Clear parsed customers on complete failure
        toast.error("Failed to parse file", {
          description: result.errors?.join(", ") || "Unknown error",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setParseErrors([errorMessage]);
      toast.error("Failed to parse file", {
        description: errorMessage,
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmUpload = async () => {
    if (parsedCustomers.length === 0) {
      toast.error("No valid customers to upload");
      return;
    }

    if (!businessId) {
      toast.error("Business ID not found");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const payload = convertToBatchPayload(parsedCustomers);
      await customersApi.createWithUserBatch(payload);

      toast.success("Customers uploaded successfully!", {
        description: `${parsedCustomers.length} customer(s) have been added`,
        duration: 4000,
      });

      // Reset state and close dialog
      setShowImportDialog(false);
      setSelectedFile(null);
      setParsedCustomers([]);
      setParseErrors([]);
      
      // Refresh customer list
      fetchCustomers();
    } catch (err) {
      if (err instanceof ApiClientError) {
        const errorMessage = err.message || "Failed to upload customers";
        setError(errorMessage);
        toast.error("Failed to upload customers", {
          description: errorMessage,
        });
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        toast.error("Failed to upload customers", {
          description: errorMessage,
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseImportDialog = () => {
    if (isUploading) return; // Prevent closing while uploading
    
    setShowImportDialog(false);
    setSelectedFile(null);
    setParsedCustomers([]);
    setParseErrors([]);
    // Reset file input
    const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleExport = async () => {
    if (!businessId) {
      toast.error("Business ID not found");
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      // Fetch all customers by paginating through all pages
      let allCustomers: Customer[] = [];
      let currentPage = 1;
      let hasMore = true;
      const limit = 100; // Use a larger limit to reduce API calls

      while (hasMore) {
        const response = await customersApi.search({
          query: "",
          business_id: businessId,
          page: currentPage,
          limit: limit,
        });

        const fetchedCustomers = response.data.customers || [];
        allCustomers = [...allCustomers, ...fetchedCustomers];

        hasMore = response.data.metadata.has_next || false;
        currentPage++;
      }

      if (allCustomers.length === 0) {
        toast.error("No customers to export");
        setIsExporting(false);
        return;
      }

      // Prepare data for Excel
      const excelData = allCustomers.map((customer) => ({
        Name: customer.name || "",
        Email: customer.email || "",
        "Phone Number": customer.phone_number || "",
        Points: getCustomerPoints(customer),
        "Joined Date": customer.created_at
          ? new Date(customer.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `customers_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Export successful!", {
        description: `Exported ${allCustomers.length} customer(s) to Excel`,
        duration: 4000,
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        const errorMessage = err.message || "Failed to export customers";
        setError(errorMessage);
        toast.error("Failed to export customers", {
          description: errorMessage,
        });
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        toast.error("Failed to export customers", {
          description: errorMessage,
        });
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-gilroy-black text-black mb-2">Customer Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">View and edit customer information</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowImportDialog(true)}
              disabled={isLoading || !businessId}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg disabled:shadow-none whitespace-nowrap"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import from CSV</span>
              <span className="sm:hidden">Import</span>
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || isLoading || customers.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg disabled:shadow-none whitespace-nowrap"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Exporting...</span>
                  <span className="sm:hidden">Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export to Excel</span>
                  <span className="sm:hidden">Export</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}


      {/* Customers Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#7bc74d]" />
          <span className="ml-3 text-gray-600">Loading customers...</span>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No customers found</h3>
          <p className="text-gray-500">
            No customers have registered with your business yet
          </p>
        </div>
      ) : (
        <>
          {/* Top Pagination */}
          {pagination.total_pages > 1 && (
            <div className="mb-6 flex items-center justify-between flex-col sm:flex-row gap-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4">
              <div className="text-sm text-gray-700">
                Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} total customers)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.has_previous}
                  className="p-3 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white disabled:text-gray-700 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-6 h-6 font-bold" />
                </button>
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Show page numbers */}
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
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 ${
                          pagination.page === pageNum
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

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                      Points
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden xl:table-cell">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">{customer.name}</div>
                            <div className="text-xs text-gray-500 sm:hidden">{customer.email || "No email"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-gray-900">{customer.email || "—"}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900">{customer.phone_number || "—"}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm font-semibold text-[#7bc74d]">
                          {getCustomerPoints(customer).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden xl:table-cell">
                        <div className="text-sm text-gray-500">{formatDate(customer.created_at)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative inline-block" ref={(el) => { menuRefs.current[customer.id] = el; }}>
                          <button
                            onClick={() => setOpenMenuId(openMenuId === customer.id ? null : customer.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Actions"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {openMenuId === customer.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => handleEdit(customer)}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                                Edit
                        </button>
                              <button
                                onClick={() => handleDeleteClick(customer)}
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
            <div className="mt-6 flex items-center justify-between flex-col sm:flex-row gap-4">
              <div className="text-sm text-gray-700">
                Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} total customers)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.has_previous}
                  className="p-3 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white disabled:text-gray-700 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-6 h-6 font-bold" />
                </button>
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

      {/* Edit Customer Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={(open: boolean) => {
        if (!open) {
          setEditingCustomer(null);
          setCustomerName("");
          setCustomerEmail("");
          setPhoneValue(undefined);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-gilroy-black text-black">Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information. Only changed fields will be updated.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <style dangerouslySetInnerHTML={{__html: `
                  .customer-phone-input-wrapper .PhoneInput {
                    display: flex !important;
                    align-items: center !important;
                    width: 100% !important;
                    border: 1px solid #e5e7eb !important;
                    border-radius: 0.75rem !important;
                    padding: 0.625rem !important;
                    transition: all 0.2s !important;
                  }
                  .customer-phone-input-wrapper .PhoneInput:focus-within {
                    outline: none !important;
                    ring: 2px !important;
                    ring-color: #7bc74d !important;
                    border-color: transparent !important;
                  }
                  .customer-phone-input-wrapper .PhoneInputCountry {
                    margin-right: 0.5rem !important;
                  }
                  .customer-phone-input-wrapper .PhoneInputInput {
                    border: none !important;
                    outline: none !important;
                    background: transparent !important;
                    flex: 1 !important;
                  }
                `}} />
                <div className="customer-phone-input-wrapper">
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={phoneValue}
                    onChange={setPhoneValue}
                    defaultCountry="MY"
                    international
                    className="w-full"
                    style={{
                      '--PhoneInput-color--focus': '#7bc74d',
                      '--PhoneInputCountryFlag-borderColor': 'transparent',
                      '--PhoneInputCountrySelectArrow-color': '#9ca3af',
                    }}
                    inputComponent={PhoneInputComponent}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                setEditingCustomer(null);
                setCustomerName("");
                setCustomerEmail("");
                setPhoneValue(undefined);
              }}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !customerName.trim()}
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
            <DialogTitle className="text-2xl font-gilroy-black text-black">Delete Customer</DialogTitle>
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

      {/* Import CSV Dialog */}
      <Dialog open={showImportDialog} onOpenChange={handleCloseImportDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-gilroy-black text-black">Import Customers from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with columns: name, email, phone_number. Review the data before confirming the upload.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select CSV File
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="csv-file-input"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  disabled={isParsing || isUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#7bc74d] file:text-white hover:file:bg-[#6ab63d] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setParsedCustomers([]);
                        setParseErrors([]);
                        const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                      disabled={isParsing || isUploading}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              {isParsing && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Parsing file...</span>
                </div>
              )}
            </div>

            {/* Parse Errors */}
            {parseErrors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="text-sm font-semibold text-red-800 mb-2">
                  Errors ({parseErrors.length}) - Upload Disabled
                </h4>
                <p className="text-xs text-red-700 mb-2">Please fix all errors before uploading.</p>
                <ul className="text-sm text-red-700 space-y-1 max-h-32 overflow-y-auto">
                  {parseErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview Table */}
            {parsedCustomers.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  These are correct rows ({parsedCustomers.length} customer{parsedCustomers.length !== 1 ? 's' : ''})
                </h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {parsedCustomers.map((customer, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900">{customer.name}</td>
                            <td className="px-3 py-2 text-gray-900">{customer.email}</td>
                            <td className="px-3 py-2 text-gray-900">{customer.phone_number}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            {!selectedFile && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">CSV Format Requirements</h4>
                <div className="text-sm text-blue-700 space-y-2">
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li>Required columns: <code className="bg-blue-100 px-1.5 py-0.5 rounded">name</code>, <code className="bg-blue-100 px-1.5 py-0.5 rounded">email</code>, <code className="bg-blue-100 px-1.5 py-0.5 rounded">phone_number</code></li>
                    <li>Column names are case-insensitive. Phone column can also be named &quot;phone&quot; or &quot;phone number&quot;.</li>
                    <li>Example format:
                      <div className="bg-blue-100 p-2 rounded text-xs font-mono text-blue-900 mt-1 ml-4">
                        <div>name,email,phone_number</div>
                        <div>John Doe,john@example.com,60123456789</div>
                      </div>
                    </li>
                    <li>Phone numbers with + sign will have it automatically removed.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <button
              onClick={handleCloseImportDialog}
              disabled={isUploading}
              className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmUpload}
              disabled={isUploading || parsedCustomers.length === 0 || isParsing || parseErrors.length > 0}
              className="bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Confirm & Upload ({parsedCustomers.length})</span>
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

