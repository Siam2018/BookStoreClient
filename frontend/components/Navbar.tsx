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
  const [menuOpen, setMenuOpen] = useState(false);
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
    <nav className="bg-blue-600 text-white p-2 flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <div className="flex flex-row items-center gap-3 justify-between w-full">
        <div className="flex flex-row items-center gap-3">
          <img src={"/logo.png"} alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 border bg-white rounded-2xl" />
          <h1 className="text-xl sm:text-2xl font-bold">BookStore</h1>
        </div>
        <button className="sm:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      <div className={`flex-col sm:flex-row flex gap-6 items-center w-full sm:w-auto ${menuOpen ? 'flex' : 'hidden sm:flex'}`}>
        <Link href="/" className="px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-center">Home</Link>
        <Link href="/products" className="px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-center">Products</Link>
        <Link href="/about" className="px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-center">About Us</Link>
        <Link href="/orders" className="px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-center">Orders</Link>
        {loading ? (
          <span>Loading...</span>
        ) : !user ? (
          <>
            <Link href="/login" className="px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-center">Login</Link>
            <Link href="/register" className="px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-center">Register</Link>
          </>
        ) : (
          <>
            <Link href="/cart" className="relative px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-center">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs font-bold">{cartCount}</span>
              )}
            </Link>
            <span className="px-2 py-1 bg-gray-200 text-blue-700 rounded w-full sm:w-auto text-center">Role: {user.role || "User"}</span>
            <Link href={`/profile/${user.id || user.userId || ""}`} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-center">
              <img src={user.imageURL ? `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/customer/uploads/customers/${user.imageURL}` : "/person.svg"} alt="Profile" className="w-8 h-8 rounded-full border" />
              <span>{user.fullName || "Profile"}</span>
            </Link>
            <button onClick={onLogout} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 w-full sm:w-auto text-center">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
