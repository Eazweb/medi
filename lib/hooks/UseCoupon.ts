import { useState } from "react";
import toast from "react-hot-toast";

const useCoupon = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isCouponCorrect, setIsCouponCorrect] = useState<boolean>(false);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [couponUsed, setCouponUsed] = useState<string | null>(null);

  const checkCoupon = async () => {
    try {
      console.log("Attempting to check coupon:", couponCode);
      const res = await fetch(
        `/api/coupons?code=${encodeURIComponent(couponCode.trim())}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      console.log("Coupon API response:", data);

      if (res.ok) {
        if (data.coupon) {
          setIsCouponCorrect(true);
          setDiscountValue(data.coupon.discountValue);
          setCouponUsed(couponCode); // Set couponUsed after successful validation
          toast.success("Coupon applied successfully!");
        } else {
          setIsCouponCorrect(false);
          setDiscountValue(0);
          setCouponUsed(null); // Reset couponUsed on invalid code
          toast.error(data.message || "Invalid coupon code");
        }
      } else {
        setIsCouponCorrect(false);
        setDiscountValue(0);
        setCouponUsed(null); // Reset couponUsed on error
        toast.error(data.message || "Error checking coupon");
      }
    } catch (error) {
      console.error("Error fetching coupon:", error);
      setIsCouponCorrect(false);
      setDiscountValue(0);
      setCouponUsed(null); // Reset couponUsed on error
      toast.error("Something went wrong!");
    }
  };

  return {
    couponCode,
    setCouponCode,
    isCouponCorrect,
    discountValue,
    checkCoupon,
    couponUsed, // Expose couponUsed state
  };
};

export default useCoupon;
