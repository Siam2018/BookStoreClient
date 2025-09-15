"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/auth/logout`, {}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
  <main className="bg-white text-gray-900 min-h-screen flex flex-col">
      <Navbar user={user} loading={loading} onLogout={handleLogout} />
      <Hero />
      <ProductSection />
      <div className="w-full flex gap-4 justify-center mt-12 mb-8">
    
        <a
          href="/adminlogin"
          className="bg-[#67C090] text-white px-6 py-3 rounded hover:bg-green-700 text-lg w-full sm:w-auto text-center"
        >
          Admin Login
        </a>
      </div>
      <Footer />
    </main>
  );
}

