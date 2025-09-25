"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function AdministratorHome() {
  const router = useRouter();

  // Example: handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin-login");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Administrator Home</h1>
        <div className="flex flex-col gap-4">
          <button className="bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700" onClick={() => router.push("/administrator/manage-admins")}>Manage Administrators</button>
          <button className="bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700" onClick={() => router.push("/inventory")}>Manage Inventory</button>
          <button className="bg-yellow-600 text-white py-2 rounded font-bold hover:bg-yellow-700" onClick={() => router.push("/invoices")}>Manage Invoices</button>
          <button className="bg-gray-400 text-white py-2 rounded font-bold hover:bg-gray-500" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </main>
  );
}
