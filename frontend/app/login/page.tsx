"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "../../components/Footer";

function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!identifier || !password) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/auth/login`,
        { identifier, password }
      );
      // Store token in localStorage
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
      }
      setSuccess(true);
      setError("");
      setTimeout(() => router.push("/"), 800);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid credentials. Please check your email/username and password.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again later.");
      }
    }
    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto p-8">
      <div className="flex flex-col items-center mb-4">
        <img src="/logo.png" alt="Logo" className="w-22 h-22 mb-2" />
        <h1 className="text-3xl font-bold">Login</h1>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="identifier"
          placeholder="Email or Username"
          className="border p-2 rounded"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
  {error && <div className="text-red-500 text-sm" role="alert">{error}</div>}
  {success && <div className="text-green-600 text-sm">Login successful! Redirecting...</div>}
      </form>
      <div className="mt-4 text-sm text-gray-600">
        Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
      </div>
    </main>
  );
}

export default function Login() {
  return (
    <>
      <LoginForm />
      <Footer />
    </>
  );
}
