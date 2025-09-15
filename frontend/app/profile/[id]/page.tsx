"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
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
          // Get token from localStorage
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          // Try fetching as customer first
          let res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/customer/${userId}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );
          setUser(res.data.data);
          setForm(res.data.data);
      } catch {
        try {
            // Get token from localStorage
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            // If not found as customer, try as admin
            let res = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/admin/${userId}`,
              {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              }
            );
            setUser(res.data.data);
            setForm(res.data.data);
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
  <main className="max-w-md mx-auto p-8 bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-xl shadow-lg">
  <div className="flex flex-col items-center mb-4 bg-white rounded-xl shadow p-6">
        <img
          src={form.imageURL ? `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/customer/uploads/customers/${form.imageURL}` : "/person.svg"}
          alt="Profile"
          className="w-24 h-24 rounded-full border mb-2"
        />
  <h1 className="text-3xl font-bold text-blue-700 mb-2">Profile</h1>
        <input
          type="file"
          accept="image/*"
          id="profile-image-input"
          style={{ display: "none" }}
          onChange={async e => {
            const file = e.target.files?.[0];
            if (!file) return;
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const formData = new FormData();
            formData.append('file', file);
            try {
              const imgRes = await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/customer/${userId}/image`,
                formData,
                {
                  headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'Content-Type': 'multipart/form-data',
                  },
                }
              );
              setUser((prev: any) => ({ ...prev, imageFilename: imgRes.data.imageFilename }));
              setForm((prev: any) => ({ ...prev, imageFilename: imgRes.data.imageFilename }));
              // Update localStorage user imageURL (only filename)
              const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
              if (storedUser) {
                try {
                  const parsedUser = JSON.parse(storedUser);
                  parsedUser.imageURL = imgRes.data.imageFilename;
                  localStorage.setItem("user", JSON.stringify(parsedUser));
                } catch {}
              }
              setSuccess(true);
            } catch (err: any) {
              setFormError(err.response?.data?.message || "Image upload failed.");
            }
          }}
        />
        <button
          type="button"
          className="bg-gradient-to-r from-blue-500 to-green-400 text-white py-1 px-3 rounded hover:from-blue-600 hover:to-green-500 mb-2 shadow"
          onClick={() => document.getElementById('profile-image-input')?.click()}
        >
          Change Profile Picture
        </button>
      </div>
  <form className="flex flex-col gap-4 bg-white rounded-xl shadow p-6" onSubmit={async e => {
          e.preventDefault();
          if (!editMode) return;
          setFieldErrors({});
          setFormError("");
          setSuccess(false);
          // Advanced validation
          const nameRegex = /^[A-Za-z\s]+$/;
          const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
          const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
          let errors: any = {};
          let requiredFields = false;
          if (!form.fullName) { errors.fullName = "Full Name is required."; requiredFields = true; }
          else if (!nameRegex.test(form.fullName)) errors.fullName = "Full Name must contain only letters and spaces.";
          if (!form.email) { errors.email = "Email is required."; requiredFields = true; }
          else if (!emailRegex.test(form.email)) errors.email = "Invalid email format.";
          if (form.password) {
            if (form.password.length < 6) errors.password = "Password must be at least 6 characters.";
            else if (!/[#@\$&]/.test(form.password)) errors.password = "Password must contain one special character (@, #, $ or &).";
          }
          if (form.phone && !phoneRegex.test(form.phone)) errors.phone = "Phone number is invalid.";
          if (form.dateOfBirth) {
            const dob = new Date(form.dateOfBirth);
            if (isNaN(dob.getTime())) errors.dateOfBirth = "Date of Birth must be a valid date.";
            else {
              const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
              if (age < 0 || age > 120) errors.dateOfBirth = "Age must be a valid number between 0 and 120.";
            }
          }
          if (Object.keys(errors).length > 0) {
            setFieldErrors((prev: any) => ({ ...prev, ...errors }));
            if (requiredFields) {
              setFormError("");
            } else {
              setFormError("Please fix the errors above.");
            }
            return;
          }
          try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            let imageURL = form.imageURL;
            // If imageFile is present, upload it first
            if (form.imageFile) {
              const formData = new FormData();
              formData.append('file', form.imageFile);
              const imgRes = await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/customer/${userId}/image`,
                formData,
                {
                  headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'Content-Type': 'multipart/form-data',
                  },
                }
              );
              imageURL = imgRes.data.imageURL || form.imageURL;
            }
            // Now update profile data
            // Remove password from payload
            const { password, ...safeForm } = form;
            const res = await axios.put(
              `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/customer/${userId}`,
              {
                ...safeForm,
                imageURL,
                dateOfBirth: form.dateOfBirth || null,
              },
              {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              }
            );
            setUser(res.data.data);
            setForm(res.data.data);
            setSuccess(true);
            setEditMode(false);
          } catch (err: any) {
            setFormError(err.response?.data?.message || "Update failed.");
          }
        }}>
          <label className="text-sm font-medium text-gray-800">Full Name*</label>
          <input type="text" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 text-gray-900" value={form.fullName || ""} onChange={e => setForm({ ...form, fullName: e.target.value })} disabled={!editMode} />
          {fieldErrors.fullName && <div className="text-red-500 text-xs">{fieldErrors.fullName}</div>}
          <label className="text-sm font-medium text-gray-800">Email*</label>
          <input type="email" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 text-gray-900" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} disabled={!editMode} />
          {fieldErrors.email && <div className="text-red-500 text-xs">{fieldErrors.email}</div>}
          <label className="text-sm font-medium text-gray-800">Phone</label>
          <input type="tel" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 text-gray-900" value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} disabled={!editMode} />
          <label className="text-sm font-medium text-gray-800">Address</label>
          <input type="text" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 text-gray-900" value={form.address || ""} onChange={e => setForm({ ...form, address: e.target.value })} disabled={!editMode} />
          <label className="text-sm font-medium text-gray-800">City</label>
          <input type="text" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 text-gray-900" value={form.city || ""} onChange={e => setForm({ ...form, city: e.target.value })} disabled={!editMode} />
          <label className="text-sm font-medium text-gray-800">Postal Code</label>
          <input type="text" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 text-gray-900" value={form.postalCode || ""} onChange={e => setForm({ ...form, postalCode: e.target.value })} disabled={!editMode} />
          <label className="text-sm font-medium text-gray-800">Country</label>
          <input type="text" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 text-gray-900" value={form.country || ""} onChange={e => setForm({ ...form, country: e.target.value })} disabled={!editMode} />
          <label className="text-sm font-medium text-gray-800">Date of Birth</label>
          <input type="date" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 text-gray-900" value={form.dateOfBirth ? form.dateOfBirth.slice(0,10) : ""} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} disabled={!editMode} />
          <label className="text-sm font-medium text-gray-800">Gender</label>
          <select className="border p-2 rounded focus:ring-2 focus:ring-blue-400 text-gray-900" value={form.gender || ""} onChange={e => setForm({ ...form, gender: e.target.value })} disabled={!editMode}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          {success && <div className="text-green-600 text-sm">Profile updated successfully!</div>}
          {editMode ? (
            <>
              <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2">Save</button>
              <button type="button" className="bg-gray-400 text-white py-2 rounded hover:bg-gray-500 mt-2" onClick={() => { setEditMode(false); setForm(user); setFieldErrors({}); setFormError(""); }}>Cancel</button>
            </>
          ) : (
            <button type="button" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2" onClick={() => setEditMode(true)}>Update Profile</button>
          )}
      </form>
      <div className="mt-4 text-xs text-gray-500">* Required fields</div>
    </main>
  );
}
