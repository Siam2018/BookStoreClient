"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/auth/admin/login`, {
        username,
        password,
      });
      localStorage.setItem("adminToken", res.data.access_token);
      localStorage.setItem("user", JSON.stringify({ ...res.data.admin, role: "admin" }));
      router.push("/admin/home");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Login</button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            className="text-blue-600 underline hover:text-blue-800 font-bold"
            onClick={() => router.push("/admin/register")}
          >
            Register as Admin
          </button>
        </div>
      </div>
    </main>
  );
}
