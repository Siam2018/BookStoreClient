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
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/auth/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setUser(res.data);
      } catch {
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/auth/logout`, {}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <Navbar user={user} loading={loading} onLogout={handleLogout} />
      <Hero />
      {user && user.role === "customer" && (
        <section className="max-w-md mx-auto my-8 p-6 border rounded shadow bg-white">
          <div className="flex flex-col items-center mb-4">
            <img src={user.imageURL || "/person.svg"} alt="Profile" className="w-20 h-20 rounded-full border mb-2" />
            <h2 className="text-2xl font-bold mb-2">{user.fullName || user.username}</h2>
            <p className="text-gray-700 mb-1">Email: {user.email}</p>
            {user.phone && <p className="text-gray-700 mb-1">Phone: {user.phone}</p>}
            {user.address && <p className="text-gray-700 mb-1">Address: {user.address}</p>}
            {user.city && <p className="text-gray-700 mb-1">City: {user.city}</p>}
            {user.country && <p className="text-gray-700 mb-1">Country: {user.country}</p>}
            {user.dateOfBirth && <p className="text-gray-700 mb-1">Date of Birth: {user.dateOfBirth}</p>}
            {user.gender && <p className="text-gray-700 mb-1">Gender: {user.gender}</p>}
          </div>
        </section>
      )}
      <ProductSection />
      <div className="w-full flex gap-4 justify-center mt-12 mb-8">
    
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

