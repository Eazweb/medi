"use client";
import { OrderItem } from "@/lib/models/OrderModel";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import Loader from "@/components/Loader";
import { Link2 } from "lucide-react";

export default function OrderDetails({
  orderId,
  razorpayKeyId,
}: {
  orderId: string;
  razorpayKeyId: string;
}) {
  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success("Order delivered successfully")
        : toast.error(data.message);
    }
  );

  const { data: session } = useSession();

  function loadRazorpayScript() {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleRazorpayPayment() {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Failed to load Razorpay SDK.");
      return;
    }

    const order = await fetch(`/api/orders/${orderId}/create-razorpay-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());

    const options = {
      key: razorpayKeyId,
      amount: order.amount,
      currency: "INR",
      name: "Lift Lock",
      description: "Order Payment",
      order_id: order.id,
      handler: function (response: any) {
        fetch(`/api/orders/${orderId}/capture-razorpay-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        }).then((res) => {
          if (res.ok) {
            toast.success("Order paid successfully");
          } else {
            toast.error("Payment failed");
          }
        });
      },
      prefill: {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  }

  const { data, error } = useSWR(`/api/orders/${orderId}`);

  if (error) return error.message;
  if (!data)
    return (
      <div className="w-full h-[90vh]">
        <Loader />
      </div>
    );

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    couponUsed,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data;

  return (
    <div className="w-[90%] mx-auto max-w-[1300px] min-h-[90vh]">
      <h1 className="text-2xl font-semibold py-4 mt-5">Order {orderId}</h1>

      <div className="md:flex ">
        <div className="md:w-[60%]">
          <h2 className="text-xl font-semibold">Ordered Items</h2>
          {items.map((item: OrderItem, index: any) => (
            <div
              key={index}
              className="flex items-center justify-between py-4 px-2 mt-2 border-b border-gray-200"
            >
              <div className="flex gap-5">
                <Link href={`/product/${item.slug}`}>
                  <div className="relative w-20 h-20 rounded-xl">
                    <Image
                      src={item.image[0]}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg border border-gray-300"
                    />
                    <div className="w-6 h-6 rounded-full bg-red-700 text-white absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                      {item.qty}
                    </div>
                  </div>
                </Link>
                <div className="">
                  <h1 className="text-xl line-clamp-1 font-semibold text-gray-800 ">
                    {item.name.toUpperCase()}
                  </h1>
                  <h2 className="text-sm mt-1 flex gap-2 text-gray-600">
                    ({item.size} {item.color})
                    {item.design && (
                      <a href={item.design} target="_blank">
                        <Link2 />
                      </a>
                    )}
                  </h2>
                </div>
              </div>

              <div className="text-right w-24">
                <p className="text-gray-600 font-semibold">
                  {" "}
                  ₹{(item.price + (item.design ? 500 : 0)) * item.qty}
                </p>
              </div>
            </div>
          ))}

          <div className="my-5">
            <h2 className="card-title">Shipping Address</h2>
            <p className="mt-2 font-semibold">{shippingAddress.fullName}</p>
            <p className="">{shippingAddress.mobileNumber}</p>
            <p>
              {shippingAddress.address}, {shippingAddress.city},{" "}
              {shippingAddress.postalCode}, {shippingAddress.country}{" "}
            </p>
            {isDelivered ? (
              <div className="text-success">Delivered at {deliveredAt}</div>
            ) : (
              <div className="text-error">Not Delivered</div>
            )}
          </div>
          <div className="my-5">
            <h2 className="card-title">Payment Method</h2>
            <p className="mt-2">{paymentMethod}</p>
            {isPaid ? (
              <div className="text-success">Paid at {paidAt}</div>
            ) : (
              <div className="text-error">Not Paid</div>
            )}
            <h1 className="text-sm text-gray-700 mt-3">
              ( Reload the page if this does not update )
            </h1>
          </div>
        </div>

        <div className="w-full md:w-[40%] md:px-10">
          <h2 className="card-title">Order Summary</h2>
          <ul className="mt-5">
            <li>
              <div className="mb-2 flex justify-between">
                <div>Items</div>
                <div>₹{itemsPrice}</div>
              </div>
            </li>
            <li>
              <div className="mb-2 flex justify-between">
                <div>Tax</div>
                <div>₹{taxPrice}</div>
              </div>
            </li>
            <li>
              <div className="mb-2 flex justify-between">
                <div>Shipping</div>
                <div>₹{shippingPrice}</div>
              </div>
            </li>
            <li>
              <div className="mb-2 flex justify-between">
                <div>Total</div>
                <div>₹{totalPrice}</div>
              </div>
            </li>
            <li>
              {couponUsed != "" ? (
                <div className="mb-2 flex justify-center text-center">
                  <h1>
                    Coupon Used:{" "}
                    <span className="text-green-500 font-semibold">
                      {couponUsed}
                    </span>
                  </h1>
                </div>
              ) : null}
            </li>

            {!isPaid && paymentMethod === "Razorpay" && (
              <li>
                <button
                  className="btn bg-zinc-900 hover:bg-black text-white w-full my-2"
                  onClick={handleRazorpayPayment}
                >
                  Pay with Razorpay
                </button>
              </li>
            )}
            {session?.user.isAdmin && (
              <li>
                <button
                  className="btn w-full my-2"
                  onClick={() => deliverOrder()}
                  disabled={isDelivering}
                >
                  {isDelivering && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Mark as delivered
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
