"use client";

import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../lib/store/store";
import { fetchPendingOrders } from "../../../lib/store/features/orders/fetchPendingThunk";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { updateOrderStatus } from "../../../lib/store/features/orders/fetchPendingOrderSlice";

const PendingOrders = () => {
  // const router = useRouter();
  const dispatch = useAppDispatch();
  const { orders, status, error } = useAppSelector(
    (state) => state.fetchPendingOrders
  );
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    newSocket.on("orderStatusUpdated", (data) => {
      dispatch(updateOrderStatus({ orderId: data.orderId, status: data.status }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [dispatch]);

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchPendingOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId: string, newStatus: string, customerId: string) => {
    setUpdatingOrderId(orderId);
    try {
      await axios.put(
        `/api/v1/orders/delivery/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (socket) {
        socket.emit("orderStatusUpdated", { orderId, status: newStatus, customerId });
      }

      dispatch(fetchPendingOrders());
      // router.push("/delivery/update"); // Only use if necessary
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getNextStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case "PENDING":
        return ["ACCEPTED"];
      case "ACCEPTED":
        return ["OUT_FOR_DELIVERY"];
      case "OUT_FOR_DELIVERY":
        return ["DELIVERED"];
      default:
        return [];
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Product</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center">
                <td className="py-2 px-4 border-b">{order.product}</td>
                <td className="py-2 px-4 border-b">{order.quantity}</td>
                <td className="py-2 px-4 border-b">{order.location}</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">
                  {order.status === "DELIVERED" ? (
                    <span className="text-green-500 font-semibold">Delivered</span>
                  ) : (
                    <select
                      value=""
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value, order.customerId)
                      }
                      className="border p-1 rounded"
                      disabled={updatingOrderId === order.id}
                    >
                      <option value="">Update Status</option>
                      {getNextStatusOptions(order.status).map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingOrders;
