"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function getCart() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function clearCart() {
  if (typeof window !== "undefined") localStorage.removeItem("cart");
}

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/orders`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    })
      .then(res => {
        if (user && user.id) {
          const filtered = (Array.isArray(res.data) ? res.data : []).filter((order: any) => order.customerId === user.id);
          setOrders(filtered);
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setError("Failed to fetch orders.");
        }
      });
  }, [router]);

  if (loading) return <main className="p-8">Loading...</main>;
  if (error) return <main className="p-8 text-red-500">{error}</main>;

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");
    setCheckoutSuccess(false);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
      const cart = getCart();
      if (!user || !user.id) throw new Error("User not found. Please login.");
      if (!cart.length) throw new Error("Cart is empty.");
      const payload = {
        customerId: user.id,
        status: "pending",
        orderItems: cart.map((item: any) => ({ productId: item.productId, quantity: item.quantity })),
      };
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/orders`,
        payload,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      clearCart();
      setCheckoutSuccess(true);
    } catch (err: any) {
      setCheckoutError(err?.response?.data?.message || err.message || "Checkout failed.");
    }
    setCheckoutLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow mb-6"
        onClick={handleCheckout}
        disabled={checkoutLoading}
      >
        {checkoutLoading ? "Processing..." : "Checkout"}
      </button>
      {checkoutError && <div className="text-red-600 mb-4">{checkoutError}</div>}
      {checkoutSuccess && <div className="text-green-600 mb-4">Order placed successfully!</div>}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order: any) => (
            <li key={order.id} className="border p-4 rounded">
              <div>Order ID: {order.id}</div>
              <div>Status: {order.status}</div>
              <div>Total: ${order.total}</div>
              <div>Date: {order.date}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
