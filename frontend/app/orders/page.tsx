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
  // Removed checkout state for orders page

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

  // Removed handleCheckout for orders page

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
      {/* Checkout button and related messages removed from orders page */}
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
