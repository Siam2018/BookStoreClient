"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      });
      if (!res.ok) {
        setError("Invalid username or password");
      } else {
        const data = await res.json();
       
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("jwtToken", data.access_token);
        localStorage.setItem("adminRole", data.role);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        router.push("/manage");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#DDF4E7] via-[#67C090] to-[#A7E9C7] relative">
      
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#67C090] opacity-30 rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#A7E9C7] opacity-30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-[#DDF4E7] opacity-40 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      <div className="relative z-10 max-w-md w-full mx-auto p-8 border border-white/30 rounded-xl shadow-lg bg-white/60 backdrop-blur-lg">
        <h1 className="text-3xl font-bold mb-4 text-center text-black">Admin Login</h1>
        <form className="flex flex-col gap-4 text-black" onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Username or Email"
            className="border p-2 rounded bg-white/80 backdrop-blur text-black"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border p-2 rounded bg-white/80 backdrop-blur text-black"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-[#67C090] text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}