// components/OrderListPage.tsx
"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../lib/store/store";
import { fetchOrders } from "../../../lib/store/features/orders/fetchOrderThunk";
import { setOrderStatus } from "../../../lib/store/features/orders/fetchOrderSlice"; // Import the setOrderStatus action
import type { Order } from "../../../lib/store/features/orders/orderSlice";
import { io } from "socket.io-client";

export default function OrderListPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { orders, status, error } = useAppSelector(
    (state) => state.fetchOrders
  ) as {
    orders: Order[];
    status: string;
    error: string | null;
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchOrders({ id: id as string }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    // Join the user's room on connection
    if (id) {
      socket.emit("joinUserRoom", id);
    }

    socket.on("orderStatusUpdated", ({ orderId, status }) => {
      console.log("Received order status update", orderId, status);

      // Dispatch the setOrderStatus action to update the status of the specific order
      dispatch(setOrderStatus({ orderId, status }));
    });

    return () => {
      socket.disconnect();
    };
  }, [id, dispatch]);

  if (status === "loading") {
    return <div className="text-center mt-10">Loading Orders...</div>;
  }

  if (status === "failed") {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Location</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{order.product}</td>
                  <td className="p-2 border text-center">{order.quantity}</td>
                  <td className="p-2 border text-center">
                    <span
                      className={`p-1 rounded ${
                        order.status === "PENDING"
                          ? "bg-yellow-200"
                          : order.status === "SHIPPED"
                            ? "bg-blue-200"
                            : "bg-green-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-2 border">{order.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
