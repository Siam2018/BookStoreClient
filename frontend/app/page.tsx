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
    async function fetchUser() {
      try {
        const res = await axios.get(
          `${process.env.BACKEND_ORIGIN}/auth/me`,
          { withCredentials: true }
        );
        setUser(res.data);
      } catch {
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await axios.post(
      `${process.env.BACKEND_ORIGIN}/auth/logout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <Navbar user={user} loading={loading} onLogout={handleLogout} />
      <Hero />
      <ProductSection />
      <div className="w-full flex gap-4 justify-center mt-12 mb-8">
        <a
          href="/adminregister"
          className="bg-[#67C090] text-white px-6 py-3 rounded hover:bg-green-700 text-lg"
        >
          Admin Registration
        </a>
        <a
          href="/adminlogin"
          className="bg-[#67C090] text-white px-6 py-3 rounded hover:bg-green-700 text-lg"
        >
          Admin Login
        </a>
      </div>
      <Footer />
    </main>
  );
}

