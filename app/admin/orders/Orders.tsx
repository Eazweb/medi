"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye, MoreVertical, Trash, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import Loader from "@/components/Loader";

interface Order {
  _id: string;
  user: {
    name: string;
  } | null;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
}

// Custom Select Component
const CustomSelect = ({ 
  value, 
  onChange 
}: { 
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: 'all', label: 'All Orders' },
    { value: 'paid', label: 'Paid Orders' },
    { value: 'notpaid', label: 'Unpaid Orders' }
  ];

  const selectedLabel = options.find(opt => opt.value === value)?.label || 'Filter orders';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[180px] flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-white hover:bg-gray-50"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Orders() {
  // State management
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch orders data
  const { data: orders, error } = useSWR<Order[]>('/api/admin/orders');

  if (error) {
    toast.error("Failed to load orders");
    return <div className="text-center text-red-500">Failed to load orders</div>;
  }
  
  if (!orders) return <Loader />;

  // Filter orders based on selected filter
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "paid") return order.isPaid;
    if (filter === "notpaid") return !order.isPaid;
    return true;
  });

  // Handle order deletion
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const response = await fetch(`/api/admin/orders/${id}/delete`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete order");
      }
  
      const data = await response.json();
      
      // Optimistically update the UI
      const updatedOrders = orders.filter(order => order._id !== id);
      mutate('/api/admin/orders', updatedOrders, false);
      
      toast.success(data.message);
    } catch (error: any) {
      console.error("Error deleting order:", error);
      setDeleteError(error.message);
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <CustomSelect value={filter} onChange={setFilter} />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">No orders found for the selected filter</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="hidden sm:table-cell">Paid</TableHead>
                  <TableHead className="hidden lg:table-cell">Delivered</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      ..{order._id.substring(20, 24)}
                    </TableCell>
                    <TableCell>
                      {order.user?.name || "Deleted user"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>₹{order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {order.isPaid && order.paidAt
                        ? new Date(order.paidAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {order.isDelivered && order.deliveredAt
                        ? new Date(order.deliveredAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link
                              href={`/order/${order._id}`}
                              className="flex items-center"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedOrderId(order._id);
                              setShowModal(true);
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
            <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            <p className="text-gray-600">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            {deleteError && (
              <p className="text-red-500 text-sm">{deleteError}</p>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedOrderId && handleDelete(selectedOrderId)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Order"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}