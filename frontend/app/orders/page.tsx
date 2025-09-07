"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    axios.get("http://localhost:3000/orders", { withCredentials: true })
      .then(res => {
        setOrders(res.data);
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

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
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
