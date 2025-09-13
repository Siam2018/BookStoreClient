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
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/auth/me`, { withCredentials: true });
        setUser(res.data);
      } catch {
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
  await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/auth/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <main>
      <Navbar user={user} loading={loading} onLogout={handleLogout} />
      <Hero />
      <ProductSection />
      <Footer />
    </main>
  );
}

