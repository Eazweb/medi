import { cache } from "react";
import dbConnect from "../dbConnect";
import CouponModel, { Coupon } from "../models/CouponModel";

const getLatest = cache(async () => {
  await dbConnect();
  const coupons = await CouponModel.find({}).sort({ _id: -1 }).limit(6).lean();
  return coupons as unknown as Coupon[];
});

const couponService = { getLatest };

export default couponService;
