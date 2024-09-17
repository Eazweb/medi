import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel, { OrderItem } from "@/lib/models/OrderModel";
import ProductModel from "@/lib/models/ProductModel";
import { round2 } from "@/lib/utils1";

// Function to calculate prices
const calcPrices = (orderItems: OrderItem[], discountAmount: number) => {
  const itemsPrice = round2(
    orderItems.reduce((acc, item) => {
      const basePrice = item.price;
      const designPrice = item.design ? 500 : 0; // Extra price for design
      return acc + (basePrice + designPrice) * item.qty;
    }, 0)
  );
  const shippingPrice = 150;
  const taxPrice = 0;
  const totalPrice = round2(
    itemsPrice + shippingPrice + taxPrice - discountAmount
  );
  return { itemsPrice, shippingPrice, taxPrice, totalPrice, discountAmount };
};

// POST handler for creating a new order
export const POST = auth(async (req: any) => {
  // Check if user is authenticated
  if (!req.auth) {
    return Response.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const { user } = req.auth; // Get authenticated user

  try {
    const payload = await req.json(); // Parse request body
    await dbConnect(); // Connect to the database

    // Fetch product prices from the database for the order items
    const dbProductPrices = await ProductModel.find(
      {
        _id: { $in: payload.items.map((x: { _id: string }) => x._id) },
      },
      "price"
    );

    // Map the order items with the actual product prices from the database
    const dbOrderItems = payload.items.map((x: { _id: string }) => ({
      ...x,
      product: x._id, // Store the reference to the product
      price: dbProductPrices.find((p) => p._id.toString() === x._id)?.price, // Get the price from the database
      _id: undefined, // Remove the _id field
    }));

    // Extract discount amount and coupon used from the payload
    const discountAmount = payload.discountApplied || 0; // Default to 0 if no discount is applied
    const couponUsed = payload.couponUsed || ""; // Default to an empty string if no coupon is used

    // Calculate the prices for the order
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(
      dbOrderItems,
      discountAmount
    );

    // Create a new order with the calculated values and user data
    const newOrder = new OrderModel({
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      discountApplied: discountAmount,
      couponUsed, // Coupon code used (string)
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      user: user._id, // Associate the order with the authenticated user
    });

    // Save the order to the database
    const createdOrder = await newOrder.save();

    // Return success response with the created order
    return Response.json(
      { message: "Order has been created", order: createdOrder },
      {
        status: 201,
      }
    );
  } catch (err: any) {
    // Return error response if something goes wrong
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
}) as any;
