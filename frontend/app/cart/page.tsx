"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type CartItem = { productId: number; quantity: number };
export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    }
  }, []);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");
    setCheckoutSuccess(false);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
      if (!token) throw new Error("No token found. Please login.");
      if (!user || !user.id) throw new Error("User not found. Please login.");
      if (!cart.length) throw new Error("Cart is empty.");
      const payload = {
        status: "pending",
        orderItems: cart.map((item: CartItem) => ({ productId: item.productId, quantity: item.quantity })),
      };
      const authHeader = `Bearer ${token}`;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/orders`,
        payload,
        {
          headers: { Authorization: authHeader },
        }
      );
      localStorage.removeItem("cart");
      setCart([]);
      setCheckoutSuccess(true);
      router.push("/orders");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setCheckoutError(
        Array.isArray(msg)
          ? msg.join(", ")
          : msg || err.message || "Checkout failed."
      );
    }
    setCheckoutLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {cart.map((item, idx) => (
            <li key={idx} className="border p-4 rounded">
              <div>Product ID: {item.productId}</div>
              <div>Quantity: {item.quantity}</div>
            </li>
          ))}
        </ul>
      )}
      <button
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow mb-4"
        onClick={handleCheckout}
        disabled={checkoutLoading || cart.length === 0}
      >
        {checkoutLoading ? "Processing..." : "Checkout"}
      </button>
      {checkoutError && <div className="text-red-600 mb-4">{checkoutError}</div>}
      {checkoutSuccess && <div className="text-green-600 mb-4">Order placed successfully!</div>}
    </main>
  );
}
