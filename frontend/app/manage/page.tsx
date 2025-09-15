"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Pusher from 'pusher-js';


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
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{ orderId: string; message: string; timestamp: string }[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  async function fetchAllOrders() {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get(`${baseUrl}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setOrders([]);
    }
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

  useEffect(() => {
    if (localStorage.getItem("isAdminLoggedIn") === "true") {
      setIsLoggedIn(true);
      fetchAdmins();
      fetchPendingOrders();
      fetchAllOrders();
      // Pusher setup for real-time pending order notifications
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER! });
      const channel = pusher.subscribe('orders');
      channel.bind('pending-order', function(data: any) {
        fetchPendingOrders();
        fetchAllOrders();
        setNotifications(prev => [
          { orderId: data?.orderId ?? 'unknown', message: `New pending order (ID: ${data?.orderId ?? 'unknown'})`, timestamp: new Date().toLocaleTimeString() },
          ...prev
        ]);
      });
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect();
      };
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

  async function fetchPendingOrders() {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get(`${baseUrl}/orders?status=pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pending = Array.isArray(res.data)
        ? res.data.filter((order: any) => order.status === 'pending')
        : [];
      setPendingOrders(pending.length);
      // Sync notifications with pending orders
      if (pending.length > 0) {
        setNotifications(
          pending.map((order: any) => ({
            orderId: order.id,
            message: `Pending order (ID: ${order.id})`,
            timestamp: order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString(),
          }))
        );
      } else {
        setNotifications([]);
      }
    } catch (err) {
      setPendingOrders(0);
      setNotifications([]);
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

  async function handleDelete(id: string) {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(`${baseUrl}/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(admins.filter(a => a.id !== id));
    } catch (err) {
      setError("Failed to delete admin");
    }
  }

  function handleAcceptOrder(notif: { orderId: string; message: string; timestamp: string }) {
    if (!notif.orderId) return;
    const token = localStorage.getItem("jwtToken");
    axios.patch(`${baseUrl}/orders/${notif.orderId}`, { status: "accepted" }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setNotifications(prev => {
          const updated = prev.filter(n => n.orderId !== notif.orderId);
          setPendingOrders(updated.length);
          return updated;
        });
        fetchPendingOrders();
      })
      .catch(() => {
        setError("Failed to accept order");
      });
  }
  function handleRejectOrder(notif: { orderId: string; message: string; timestamp: string }) {
    if (!notif.orderId) return;
    const token = localStorage.getItem("jwtToken");
    axios.patch(`${baseUrl}/orders/${notif.orderId}`, { status: "rejected" }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setNotifications(prev => {
          const updated = prev.filter(n => n.orderId !== notif.orderId);
          setPendingOrders(updated.length);
          return updated;
        });
        fetchPendingOrders();
      })
      .catch(() => {
        setError("Failed to reject order");
      });
  }

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#DDF4E7] via-[#67C090] to-[#A7E9C7]">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-black">Admin Management</h1>
        </div>
        <div className="relative flex items-center gap-4">
          <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={() => router.push("/adminregister")}>Register Admin</button>
          <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={() => router.push("/editproducts")}>Products</button>
          <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={() => router.push("/orders")}>Order</button>
          <div
            className="relative"
            onMouseEnter={() => setShowNotifications(true)}
            onMouseLeave={() => setShowNotifications(false)}
          >

        </div>
      </nav>
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="space-y-4 w-full max-w-xl flex flex-col items-center">
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
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
          {/* Orders list for admin */}
          <div className="bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-black">All Orders</h2>
            <ul className="space-y-2">
              {orders.length === 0 ? (
                <li className="text-gray-500">No orders found.</li>
              ) : (
                orders.map(order => (
                  <li key={order.id} className="flex flex-col md:flex-row md:items-center justify-between bg-white/80 p-3 rounded shadow">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                      <span className="font-semibold text-black">Order #{order.id}</span>
                      <span className="text-black">Customer: {order.customer?.fullName ?? order.customerId}</span>
                      <span className="text-black">Status: {order.status}</span>
                      <span className="text-black">Created: {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</span>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => router.push(`/orders/${order.id}`)}>Details</button>
                      {order.status === 'pending' && (
                        <>
                          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleAcceptOrder({ orderId: order.id, message: '', timestamp: '' })}>Accept</button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleRejectOrder({ orderId: order.id, message: '', timestamp: '' })}>Reject</button>
                        </>
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
