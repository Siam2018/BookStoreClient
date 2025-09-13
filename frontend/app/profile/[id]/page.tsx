"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Migration-safe: unwrap params if it's a Promise (Next.js future pattern)
  // Remove this guard when Next.js enforces Promise for params
  let userId: string;
  if (typeof (params as any).then === "function") {
    // params is a Promise, unwrap with React.use()
    userId = (React.use(params as any) as { id: string }).id;
  } else {
    // params is a plain object
    userId = (params as any).id;
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        // Try fetching as customer first
        let res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/customer/${userId}`, { withCredentials: true });
        setUser(res.data);
      } catch {
        try {
          // If not found as customer, try as admin
          let res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/admin/${userId}`, { withCredentials: true });
          setUser(res.data);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
    fetchUser();
  }, [userId]);

  if (loading) return <main className="max-w-md mx-auto p-8">Loading...</main>;
  if (!user) return <main className="max-w-md mx-auto p-8 text-red-500">User not found.</main>;

  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="flex flex-col items-center gap-4">
        <img src={user.imageURL || "/person.svg"} alt="Profile" className="w-24 h-24 rounded-full border" />
        <div className="text-lg font-semibold">{user.fullName || user.email}</div>
        <div className="text-gray-600">Role: {user.role}</div>
        <div className="text-gray-600">Email: {user.email}</div>
  {user.id && <div className="text-gray-600">User ID: {user.id}</div>}
      </div>
    </main>
  );
}
