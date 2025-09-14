"use client";
import Link from "next/link";
import React, { useEffect, useState } from 'react';

interface User {
  id?: string;
  userId?: string;
  role?: string;
  imageURL?: string;
  fullName?: string;
}

interface NavbarProps {
  user?: User;
  loading?: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, loading = false, onLogout }) => {
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
      window.addEventListener("storage", () => {
        const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(updatedCart.reduce((sum: number, item: any) => sum + item.quantity, 0));
      });
    }
  }, []);
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
            <Link href="/cart" className="relative px-4 py-2 rounded hover:bg-blue-700">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs font-bold">{cartCount}</span>
              )}
            </Link>
            <span className="px-2 py-1 bg-gray-200 text-blue-700 rounded">Role: {user.role || "User"}</span>
            <Link href={`/profile/${user.id || user.userId || ""}`} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700">
              <img src={user.imageURL ? `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/customer/uploads/customers/${user.imageURL}` : "/person.svg"} alt="Profile" className="w-8 h-8 rounded-full border" />
              <span>{user.fullName || "Profile"}</span>
            </Link>
            <button onClick={onLogout} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
