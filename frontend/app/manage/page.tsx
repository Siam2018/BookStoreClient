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
    
  }, [router]);

  async function fetchAdmins() {
    try {
      const token = localStorage.getItem("jwtToken");
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
      const token = localStorage.getItem("jwtToken");
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
      const token = localStorage.getItem("jwtToken");
      await axios.put(`${baseUrl}/admin/${editId}`, editData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditId(null);
      fetchAdmins();
    } catch (err) {
      setError("Failed to update admin");
    }
  }

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#DDF4E7] via-[#67C090] to-[#A7E9C7]">
      
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/80 shadow-md">
        <div className="flex items-center gap-3">
          {/* <img src="/logo.png" alt="Logo" className="w-16 h-16 border bg-white rounded-2xl" /> */}
          {/* <span className="text-2xl font-bold text-[#0677e1]">BookStore</span> */}
          <h1 className="text-3xl font-bold text-black">Admin Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={() => router.push("/adminregister")}>Register Admin</button>
          <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={() => router.push("/editproducts")}>Products</button>
          <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={() => router.push("/orders")}>Order</button>
          <button
            className="relative bg-transparent border-none outline-none cursor-pointer"
            aria-label="Notifications"
            onClick={() => alert('No new notifications')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#67C090]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            
            <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="space-y-4 w-full max-w-xl flex flex-col items-center">
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          
          <div className="bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-lg w-full max-w-5xl">
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
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => router.push(`/editprofile/${admin.id}`)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(admin.id)}>Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
