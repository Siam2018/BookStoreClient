"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("id");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

  useEffect(() => {
    if (!orderId) return;
    const token = localStorage.getItem("jwtToken");
    axios.get(`${baseUrl}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setOrder(res.data))
      .catch(() => setError("Failed to fetch order details"));
  }, [orderId]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="mb-2"><strong>Order ID:</strong> {order.id}</div>
      <div className="mb-2"><strong>Status:</strong> {order.status}</div>
      <div className="mb-2"><strong>Customer:</strong> {order.customer?.fullName || order.customerId}</div>
      <div className="mb-2"><strong>Created At:</strong> {order.createdAt}</div>
      <div className="mb-2"><strong>Items:</strong></div>
      <ul className="list-disc pl-6">
        {order.items?.map((item: any) => (
          <li key={item.id}>
            {item.product?.name || item.productId} - Qty: {item.quantity}
          </li>
        ))}
      </ul>
      <div className="flex gap-4 mt-6">
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => router.push("/manage")}>Back</button>
      </div>
    </div>
  );
}
