"use client";
import { formatId } from "@/lib/utils1";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";

export default function Products() {
  const { data: coupons, error: couponsError } = useSWR(`/api/admin/coupons`);
  const { data: orders, error: ordersError } = useSWR(`/api/admin/orders`);
  const [couponUsage, setCouponUsage] = useState<{ [key: string]: number }>({});

  const router = useRouter();

  useEffect(() => {
    if (orders) {
      const usage: { [key: string]: number } = {};
      orders.forEach((order: any) => {
        if (order.couponUsed) {
          usage[order.couponUsed] = (usage[order.couponUsed] || 0) + 1;
        }
      });
      setCouponUsage(usage);
    }
  }, [orders]);

  const { trigger: deleteCoupon } = useSWRMutation(
    `/api/admin/coupons`,
    async (url, { arg }: { arg: { couponId: string } }) => {
      const toastId = toast.loading("Deleting coupon...");
      const res = await fetch(`${url}/${arg.couponId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success("Coupon deleted successfully", {
            id: toastId,
          })
        : toast.error(data.message, {
            id: toastId,
          });
    }
  );

  const { trigger: createCoupon, isMutating: isCreating } = useSWRMutation(
    `/api/admin/coupons`,
    async (url) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success("Coupon created successfully");
      router.push(`/admin/coupons/${data.coupon._id}`);
    }
  );

  if (couponsError || ordersError) return "An error has occurred.";
  if (!coupons || !orders)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="w-[90%] mx-auto max-w-[1200px]">
      <div className="flex justify-between items-center">
        <h1 className="py-4 text-2xl">Coupons</h1>
        <button
          disabled={isCreating}
          onClick={() => createCoupon()}
          className="btn btn-primary btn-sm"
        >
          {isCreating && <span className="loading loading-spinner"></span>}
          Create
        </button>
      </div>

      <div className="overflow-x-auto">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className="hidden md:table-cell">
                  Used Count
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  Discount Type
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon: any) => (
                <TableRow key={coupon._id}>
                  <TableCell className="font-medium">
                    {formatId(coupon._id)}
                  </TableCell>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>₹{coupon.discountValue}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {couponUsage[coupon.code] || 0}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {coupon.discountType}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/coupons/${coupon._id}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            deleteCoupon({ couponId: coupon._id! })
                          }
                        >
                          Delete
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
    </div>
  );
}
