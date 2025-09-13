"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


interface Admin {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export default function ManagePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ fullName: string; email: string; phone: string }>({ fullName: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

  useEffect(() => {
    if (localStorage.getItem("isAdminLoggedIn") === "true") {
      setIsLoggedIn(true);
      fetchAdmins();
    } else {
      router.push("/adminlogin");
    }
    // eslint-disable-next-line
  }, [router]);

  async function fetchAdmins() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get<Admin[]>(`${baseUrl}/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(res.data);
    } catch (err) {
      setError("Failed to fetch admins");
    }
  }

  async function handleDelete(id: string) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseUrl}/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdmins(admins.filter(a => a.id !== id));
    } catch (err) {
      setError("Failed to delete admin");
    }
  }

  function startEdit(admin: Admin) {
    setEditId(admin.id);
    setEditData({ fullName: admin.fullName, email: admin.email, phone: admin.phone });
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await axios.put(`${baseUrl}/admin/${editId}`, editData);
      setEditId(null);
      fetchAdmins();
    } catch (err) {
      setError("Failed to update admin");
    }
  }

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#DDF4E7] via-[#67C090] to-[#A7E9C7]">
      <h1 className="text-3xl font-bold mb-6 text-black">Admin Management</h1>
      <div className="space-y-4 w-full max-w-xl flex flex-col items-center">
        <div className="flex flex-row gap-4 w-full mb-2">
          <button className="flex-1 bg-[#67C090] text-white py-2 rounded" onClick={() => router.push("/adminregister")}>Register Admin</button>
          <button className="flex-1 bg-blue-500 text-white py-2 rounded" onClick={() => alert('View All clicked')}>View All</button>
          <button className="flex-1 bg-yellow-500 text-white py-2 rounded" onClick={() => alert('Update clicked')}>Update</button>
          <button className="flex-1 bg-red-500 text-white py-2 rounded" onClick={() => alert('Delete clicked')}>Delete</button>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {/* ...existing code for admin list and management... */}
        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-black">Manage Existing Admins</h2>
          <ul className="space-y-2">
            {admins.map(admin => (
              <li key={admin.id} className="flex flex-col md:flex-row md:items-center justify-between bg-white/80 p-3 rounded shadow">
                {editId === admin.id ? (
                  <form onSubmit={handleUpdate} className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                    <input type="text" value={editData.fullName} onChange={e => setEditData({ ...editData, fullName: e.target.value })} className="border p-1 rounded text-black" required />
                    <input type="email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} className="border p-1 rounded text-black" required />
                    <input type="text" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} className="border p-1 rounded text-black" required />
                    <button type="submit" className="bg-[#67C090] text-white px-3 py-1 rounded">Save</button>
                    <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditId(null)}>Cancel</button>
                  </form>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                    <span className="font-semibold text-black">{admin.fullName}</span>
                    <span className="text-black">{admin.email}</span>
                    <span className="text-black">{admin.phone}</span>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => router.push(`/admin/${admin.id}`)}>Edit</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(admin.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
