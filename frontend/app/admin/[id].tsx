"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function AdminUpdatePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [admin, setAdmin] = useState({ fullName: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${baseUrl}/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
      } catch (err) {
        setError("Failed to fetch admin");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchAdmin();
  }, [id, baseUrl]);

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${baseUrl}/admin/${id}`, admin, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/manage");
    } catch (err) {
      setError("Failed to update admin");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#DDF4E7] via-[#67C090] to-[#A7E9C7]">
      <h1 className="text-2xl font-bold mb-4">Update Admin</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-3 w-full max-w-md bg-white/60 p-6 rounded-xl shadow-lg">
        <input
          type="text"
          value={admin.fullName}
          onChange={e => setAdmin({ ...admin, fullName: e.target.value })}
          placeholder="Full Name"
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          value={admin.email}
          onChange={e => setAdmin({ ...admin, email: e.target.value })}
          placeholder="Email"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          value={admin.phone}
          onChange={e => setAdmin({ ...admin, phone: e.target.value })}
          placeholder="Phone"
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-[#67C090] text-white py-2 rounded">Update Admin</button>
      </form>
    </div>
  );
}
