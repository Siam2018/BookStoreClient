"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const router = useRouter();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || (user.role !== "admin" && user.role !== "administrator")) {
      router.replace("/login");
    }
  }, [router]);
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-700">Manage Inventory</h1>
        <p className="text-center text-gray-600">This page will allow you to manage the bookstore inventory.</p>
      </div>
    </main>
  );
}
