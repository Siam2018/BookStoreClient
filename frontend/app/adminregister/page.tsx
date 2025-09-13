'use client';
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

export default function AdminRegisterPage() {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    gender: "",
    phone: "",
    password: "",
    imageURL: "",
    address: "",
    city: "",
    country: "",
    dateOfBirth: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!/^\w{4,}$/.test(form.username)) return "Username must be at least 4 characters and contain only letters, numbers, and underscores.";
    if (!/^[A-Za-z\s]+$/.test(form.fullName)) return "Full Name must contain only letters and spaces.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email format.";
    if (!["male", "female", "other"].includes(form.gender.toLowerCase())) return "Gender must be Male, Female, or Other.";
    if (!/^\d{7,15}$/.test(form.phone)) return "Phone must be 7-15 digits.";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(form.password)) return "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
    if (form.city && !/^[A-Za-z\s]+$/.test(form.city)) return "City must contain only letters and spaces.";
    if (form.country && !/^[A-Za-z\s]+$/.test(form.country)) return "Country must contain only letters and spaces.";
    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      if (isNaN(dob.getTime())) return "Date of Birth must be a valid date.";
      const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) return "Admin must be at least 18 years old.";
    }
    return "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:4000";
      const response = await axios.post(`${baseUrl}/admin/create`, form);
      console.log(response);
      setSuccess(true);
      setError("");
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || "Registration failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#DDF4E7] via-[#67C090] to-[#A7E9C7] relative">
    
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#67C090] opacity-30 rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#A7E9C7] opacity-30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-[#DDF4E7] opacity-40 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      <div className="relative z-10 max-w-md w-full mx-auto p-8 border border-white/30 rounded-xl shadow-lg bg-white/60 backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Admin Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-3 text-black">
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="w-full p-2 border rounded bg-white/80 backdrop-blur text-black" />
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className="w-full p-2 border rounded bg-white/80 backdrop-blur text-black" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full p-2 border rounded bg-white/80 backdrop-blur text-black" />
          <input name="gender" placeholder="Gender (Male/Female/Other)" value={form.gender} onChange={handleChange} required className="w-full p-2 border rounded bg-white/80 backdrop-blur text-black" />
          <input name="phone" placeholder="Phone (7-15 digits)" value={form.phone} onChange={handleChange} required className="w-full p-2 border rounded bg-white/80 backdrop-blur text-black" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full p-2 border rounded bg-white/80 backdrop-blur text-black" />
          <input name="imageURL" placeholder="Image URL" value={form.imageURL} onChange={handleChange} className="w-full p-2 border rounded bg-white/80 backdrop-blur text-black" />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full p-2 border rounded bg-white/80 backdrop-blur text-black" />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="w-full p-2 border rounded bg-white/80 backdrop-blur text-black" />
          <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className="w-full p-2 border rounded bg-white/80 backdrop-blur text-black" />
          <input name="dateOfBirth" type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={handleChange} className="w-full p-2 border rounded bg-white/80 backdrop-blur text-black" />
          <button type="submit" className="w-full bg-[#67C090] text-white py-2 rounded" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mt-2">Registration successful!</div>}
        </form>
      </div>
    </div>
  );
}