"use client";
import Link from "next/link";
import React from 'react';

export default function Navbar({ user, loading, onLogout }: {
  user: any;
  loading: boolean;
  onLogout: () => void;
}) {
  return (
    <nav className="bg-blue-600 text-white p-2 flex justify-between items-center">
      <div className="flex flex-row items-center gap-3">
        <img src={"/logo.png"} alt="Logo" className="w-20 h-20 border bg-white rounded-2xl" />
        <h1 className="text-2xl font-bold">BookStore</h1>
      </div>
      <div className="flex gap-6 items-center">
        <Link href="/" className="px-4 py-2 rounded hover:bg-blue-700">Home</Link>
        <Link href="/products" className="px-4 py-2 rounded hover:bg-blue-700">Products</Link>
        <Link href="/about" className="px-4 py-2 rounded hover:bg-blue-700">About Us</Link>
        <Link href="/orders" className="px-4 py-2 rounded hover:bg-blue-700">Orders</Link>
      </div>
      <div className="flex gap-4 items-center">
        {loading ? (
          <span>Loading...</span>
        ) : !user ? (
          <>
            <Link href="/login" className="px-4 py-2 rounded hover:bg-blue-700">Login</Link>
            <Link href="/register" className="px-4 py-2 rounded hover:bg-blue-700">Register</Link>
          </>
        ) : (
          <>
            <Link href="/orderItems" className="px-4 py-2 rounded hover:bg-blue-700">Cart</Link>
            <span className="px-2 py-1 bg-gray-200 text-blue-700 rounded">Role: {user.role || "User"}</span>
            {user.id ? (
              <Link href={`/profile/${user.id}`} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700">
                <img src={user.imageURL || "/person.svg"} alt="Profile" className="w-8 h-8 rounded-full border" />
                <span>{user.fullName || "Profile"}</span>
              </Link>
            ) : (
              <Link href="/profile" className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700">
                <img src={user.imageURL || "/person.svg"} alt="Profile" className="w-8 h-8 rounded-full border" />
                <span>{user.fullName || "Profile"}</span>
              </Link>
            )}
            <button onClick={onLogout} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
