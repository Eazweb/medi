"use client";
import { Product } from "@/lib/models/ProductModel";
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

export default function Products() {
  const { data: products, error } = useSWR(`/api/admin/products`);

  const router = useRouter();

  const { trigger: deleteProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading("Deleting product...");
      const res = await fetch(`${url}/${arg.productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success("Product deleted successfully", {
            id: toastId,
          })
        : toast.error(data.message, {
            id: toastId,
          });
    }
  );

  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    `/api/admin/products`,
    async (url) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success("Product created successfully");
      router.push(`/admin/products/${data.product._id}`);
    }
  );

  if (error) return "An error has occurred.";
  if (!products)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="min-h-[90vh] w-[90%] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="py-4 text-2xl">Products</h1>
        <button
          disabled={isCreating}
          onClick={() => createProduct()}
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
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Stock</TableHead>
                <TableHead className="hidden sm:table-cell">Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">
                    {formatId(product._id)}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>₹{product.price.toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.category}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {product.countInStock}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {product.rating.toFixed(1)}
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
                          <Link href={`/admin/products/${product._id}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            deleteProduct({ productId: product._id! })
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
