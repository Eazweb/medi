import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { NextRequest } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin status
    const session = await auth();
    
    if (!session?.user?.isAdmin) {
      return Response.json(
        { message: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();
    
    const { id } = params;

    // Validate ID
    if (!id) {
      return Response.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find and delete the order
    const order = await OrderModel.findByIdAndDelete(id);
    
    if (!order) {
      return Response.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete order error:', error);
    return Response.json(
      { message: error.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}