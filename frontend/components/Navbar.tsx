"use client";
import Link from "next/link";
import React, { useState, useEffect } from 'react';

// Simulate authentication state (replace with real auth logic)
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Replace with real check, e.g. check localStorage or context
    setIsLoggedIn(false); // Default: not logged in
  }, []);
  return { isLoggedIn };
};

export default function Navbar() {
  const { isLoggedIn } = useAuth();
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">BookStore</h1>
      <div className="flex gap-6 items-center">
        <Link href="/" className="px-4 py-2 rounded hover:bg-blue-700">Home</Link>
        <Link href="/products" className="px-4 py-2 rounded hover:bg-blue-700">Products</Link>
        <Link href="/about" className="px-4 py-2 rounded hover:bg-blue-700">About Us</Link>
        <Link href="/orders" className="px-4 py-2 rounded hover:bg-blue-700">Orders</Link>
      </div>
      <div className="flex gap-4 items-center">
        {!isLoggedIn ? (
          <>
            <Link href="/login" className="px-4 py-2 rounded hover:bg-blue-700">Login</Link>
            <Link href="/register" className="px-4 py-2 rounded hover:bg-blue-700">Register</Link>
          </>
        ) : (
          <>
            <Link href="/orderItems" className="px-4 py-2 rounded hover:bg-blue-700">Cart</Link>
            <span className="px-2 py-1 bg-gray-200 text-blue-700 rounded">Total: $0</span>
            <Link href="/profile/1" className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700">
              <img src="/placeholder-profile.png" alt="Profile" className="w-8 h-8 rounded-full border" />
              <span>Profile</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
