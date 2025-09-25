"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminRegisterPage() {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/auth/admin/register`, {
        ...form,
        role: "admin",
      });
      setSuccess("Admin registered successfully! You can now login.");
      setTimeout(() => router.push("/admin/login"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Registration</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button type="submit" className="bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Register</button>
        </form>
      </div>
    </main>
  );
}
