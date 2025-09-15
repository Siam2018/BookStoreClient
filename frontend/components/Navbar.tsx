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
  const [cartTotal, setCartTotal] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    function updateCartState() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
      setCartTotal(cart.reduce((sum: number, item: any) => sum + (item.quantity * (item.price || 0)), 0));
    }
    if (typeof window !== "undefined") {
      updateCartState();
      window.addEventListener("storage", updateCartState);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", updateCartState);
      }
    };
  }, []);
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/70 text-white p-2 flex flex-row items-center justify-between">
      {/* Left: Logo */}
      <div className="flex flex-row items-center gap-3">
        <img src={"/logo.png"} alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 border bg-white rounded-2xl" />
        <h1 className="text-xl sm:text-2xl font-bold">BookStore</h1>
      </div>
      {/* Center: Home, Products, About Us */}
      <div className="flex flex-row gap-6 items-center justify-center flex-1">
        <Link href="/" className="px-4 py-2 rounded hover:bg-blue-700 text-center">Home</Link>
        <Link href="/products" className="px-4 py-2 rounded hover:bg-blue-700 text-center">Products</Link>
        <Link href="/about" className="px-4 py-2 rounded hover:bg-blue-700 text-center">About Us</Link>
      </div>
      {/* Right: Cart, Profile, Logout, Orders (only for logged in customer) */}
      <div className={`flex-col sm:flex-row flex gap-6 items-center sm:w-auto ${menuOpen ? 'flex' : 'hidden sm:flex'} justify-end`}>
        {user?.role === 'admin' ? (
          <Link href="/manage" className="px-4 py-2 rounded hover:bg-blue-700 text-center">Orders</Link>
        ) : user ? (
          <Link href={`/orders?customerId=${user?.id || user?.userId || ''}`} className="px-4 py-2 rounded hover:bg-blue-700 text-center">Orders</Link>
        ) : null}
        {loading ? (
          <span>Loading...</span>
        ) : !user ? (
          <>
            <Link href="/login" className="px-4 py-2 rounded hover:bg-blue-700 text-center">Login</Link>
            <Link href="/register" className="px-4 py-2 rounded hover:bg-blue-700 text-center">Register</Link>
          </>
        ) : (
          <>
            <Link href="/cart" className="relative px-4 py-2 rounded hover:bg-blue-700 text-center flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 2.25l1.5 1.5m0 0l1.5 1.5m-1.5-1.5h15.75a.75.75 0 01.75.75v15a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75m0 0L2.25 2.25m4.5 4.5h12.75" />
              </svg>
              {cartCount > 0 && (
                <>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs font-bold">{cartCount}</span>
                  <span className="ml-2 text-green-300 text-xs font-bold">${cartTotal.toFixed(2)}</span>
                </>
              )}
            </Link>
            <Link href={`/profile/${user.id || user.userId || ""}`} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700 text-center">
              <img src={user.imageURL ? `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/customer/uploads/customers/${user.imageURL}` : "/person.svg"} alt="Profile" className="w-8 h-8 rounded-full border" />
              <span>{user.fullName || "Profile"}</span>
            </Link>
            <button onClick={onLogout} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-center">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
