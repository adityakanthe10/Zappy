"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation"; // <-- important
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "../../lib/store/store";
import { createOrder } from "../../lib/store/features/orders/orderThunk";

export default function OrderPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); // <-- important
  const orderState = useSelector((state: RootState) => state.order);

  const { status, error, order } = orderState || {
    status: "idle",
    error: null,
    order: null,
  };

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [location, setLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !location || quantity <= 0) {
      toast.error("Please fill all fields correctly");
      return;
    }
    const result = await dispatch(
      createOrder({ product, quantity: Number(quantity), location })
    );
    console.log("result", result);
    if (createOrder.fulfilled.match(result)) {
      toast.success("Order placed successfully!");
      router.push(`/customer/order/list/${result.payload.order.customerId}`);
    } else {
      toast.error("Failed to place order.");
    }
  };

  // 👇 React to successful order
  useEffect(() => {
    if (order) {
      toast.success("Order placed successfully!");
      router.push("/customer/order/list"); // Redirect
    }
  }, [order, router]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Place an Order</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Product</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            min="1"
            className="w-full border p-2 rounded"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}
