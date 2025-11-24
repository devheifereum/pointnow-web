"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Edit2, Loader2, Save, User, Mail, Phone, ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { customersApi } from "@/lib/api/customers";
import { useAuthStore } from "@/lib/auth/store";
import { ApiClientError } from "@/lib/api/client";
import { convertPhoneNumber } from "@/lib/utils";
import type { Customer } from "@/lib/types/customers";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
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

  const fetchCustomers = async () => {
    if (!businessId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use /customers/business/{business_id} endpoint
      const response = await customersApi.getByBusiness(businessId, {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-gilroy-black text-black mb-2">Customer Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">View and edit customer information</p>
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
                        <div className="text-sm text-gray-500">{formatDate(customer.created_at)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#7bc74d] hover:bg-[#6ab63d] text-white font-semibold rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
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
                  className="p-3 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-6 h-6 font-bold" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.has_next}
                  className="p-3 bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center min-w-[44px] min-h-[44px]"
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
    </div>
  );
}

