"use client";
import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    // Advanced validation
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
    if (!fullName || !email || !password) {
      setError("Full Name, Email, and Password are required.");
      return;
    }
    if (!nameRegex.test(fullName)) {
      setError("Full Name must contain only letters and spaces.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!/[#@\$&]/.test(password)) {
      setError("Password must contain one special character (@, #, $ or &).");
      return;
    }
    if (phone && !phoneRegex.test(phone)) {
      setError("Phone number is invalid.");
      return;
    }
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        setError("Date of Birth must be a valid date.");
        return;
      }
      const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 0 || age > 120) {
        setError("Age must be a valid number between 0 and 120.");
        return;
      }
    }
    setLoading(true);
    try {
  await axios.post(`${process.env.BACKEND_ORIGIN}/customer/addcustomer`, {
        fullName,
        email,
        password,
        phone,
        address,
        city,
        postalCode,
        country,
        dateOfBirth: dateOfBirth || null,
        gender
      });
      setSuccess(true);
      setError("");
    } catch (err: any) {
      if (err.response?.data?.message?.toLowerCase().includes('email') && err.response?.data?.message?.toLowerCase().includes('exist')) {
        setError('This email is already registered. Please use a different email.');
      } else {
        setError(err.response?.data?.message || "Registration failed.");
      }
    }
    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="text-sm font-medium">Full Name*</label>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name*"
          className="border p-2 rounded"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
        <label className="text-sm font-medium">Email*</label>
        <input
          type="email"
          name="email"
          placeholder="Email*"
          className="border p-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label className="text-sm font-medium">Password*</label>
        <input
          type="password"
          name="password"
          placeholder="Password* (min 6 chars)"
          className="border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <label className="text-sm font-medium">Phone</label>
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          className="border p-2 rounded"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <label className="text-sm font-medium">Address</label>
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="border p-2 rounded"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <label className="text-sm font-medium">City</label>
        <input
          type="text"
          name="city"
          placeholder="City"
          className="border p-2 rounded"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <label className="text-sm font-medium">Postal Code</label>
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          className="border p-2 rounded"
          value={postalCode}
          onChange={e => setPostalCode(e.target.value)}
        />
        <label className="text-sm font-medium">Country</label>
        <input
          type="text"
          name="country"
          placeholder="Country"
          className="border p-2 rounded"
          value={country}
          onChange={e => setCountry(e.target.value)}
        />
        <label className="text-sm font-medium">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          className="border p-2 rounded"
          value={dateOfBirth}
          onChange={e => setDateOfBirth(e.target.value)}
        />
        <label className="text-sm font-medium">Gender</label>
        <select
          name="gender"
          className="border p-2 rounded"
          value={gender}
          onChange={e => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Registration successful!</div>}
      </form>
      <div className="mt-4 text-xs text-gray-500">* Required fields</div>
    </main>
  );
}
