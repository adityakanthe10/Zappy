"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../lib/store/store";
import { fetchPendingOrders } from "../../../lib/store/features/orders/fetchPendingThunk";
import axios from "axios";
import { io, Socket } from "socket.io-client";

// // Socket.io connection setup
// const socket = io("http://localhost:3000"); // Ensure your backend URL matches

const PendingOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, status, error } = useAppSelector(
    (state) => state.fetchPendingOrders
  );
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
 const [socket, setSocket] = useState<Socket | null>(null);

 useEffect(()=>{
  const newSocket =io("http://localhost:8000")
  setSocket(newSocket);
  return () =>{
    newSocket.disconnect();
  } 
 },[])


  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchPendingOrders());
  }, [dispatch]);

  // Handle status change with error handling and refetching orders
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      // Make API call to update order status
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      // Emit the status update through socket.io
      socket?.emit("orderStatusUpdated", { orderId, status: newStatus });
      dispatch(fetchPendingOrders()); // refetch pending orders
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingOrderId(null); // Reset updating state
    }
  };

  // Return the next possible statuses based on the current order status
  const getNextStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case "Pending":
        return ["Accepted", "Out for Delivery", "Delivered"];
      case "Accepted":
        return ["Out for Delivery", "Delivered"];
      case "Out for Delivery":
        return ["Delivered"];
      default:
        return [];
    }
  };

  // Render loading or error state
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
                  {order.status === "Delivered" ? (
                    <span className="text-green-500 font-semibold">
                      Delivered
                    </span>
                  ) : (
                    <select
                      value=""
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="border p-1 rounded"
                      disabled={updatingOrderId === order.id}
                    >
                      <option value="">Update Status</option>
                      {getNextStatusOptions(order.status).map(
                        (statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        )
                      )}
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
