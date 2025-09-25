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
  const [fieldErrors, setFieldErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    dateOfBirth: "",
    gender: ""
  });
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      dateOfBirth: "",
      gender: ""
    });
    setFormError("");
    setSuccess(false);
    // Advanced validation
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
    let errors: any = {};
    let requiredFields = false;
    if (!fullName) { errors.fullName = "Full Name is required."; requiredFields = true; }
    else if (!nameRegex.test(fullName)) errors.fullName = "Full Name must contain only letters and spaces.";
    if (!email) { errors.email = "Email is required."; requiredFields = true; }
    else if (!emailRegex.test(email)) errors.email = "Invalid email format.";
    if (!password) { errors.password = "Password is required."; requiredFields = true; }
    else if (password.length < 6) errors.password = "Password must be at least 6 characters.";
    else if (!/[#@\$&]/.test(password)) errors.password = "Password must contain one special character (@, #, $ or &).";
    if (phone && !phoneRegex.test(phone)) errors.phone = "Phone number is invalid.";
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
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
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/customer/addcustomer`, {
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
      // If backend returns token, store it
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
      }
      setSuccess(true);
      setFormError("");
    } catch (err: any) {
      if (err.response?.data?.message?.toLowerCase().includes('email') && err.response?.data?.message?.toLowerCase().includes('exist')) {
        setFieldErrors((prev: any) => ({ ...prev, email: 'This email is already registered. Please use a different email.' }));
      } else {
        setFormError(err.response?.data?.message || "Registration failed.");
      }
    }
    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto p-8">
      <div className="flex flex-col items-center mb-4">
        <img src="/logo.png" alt="Logo" className="w-22 h-22 mb-2" />
        <h1 className="text-3xl font-bold">Register</h1>
      </div>
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
        {fieldErrors.fullName && <div className="text-red-500 text-xs">{fieldErrors.fullName}</div>}
        <label className="text-sm font-medium">Email*</label>
        <input
          type="email"
          name="email"
          placeholder="Email*"
          className="border p-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {fieldErrors.email && <div className="text-red-500 text-xs">{fieldErrors.email}</div>}
        <label className="text-sm font-medium">Password*</label>
        <input
          type="password"
          name="password"
          placeholder="Password* (min 6 chars)"
          className="border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {fieldErrors.password && <div className="text-red-500 text-xs">{fieldErrors.password}</div>}
        <label className="text-sm font-medium">Phone</label>
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          className="border p-2 rounded"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        {fieldErrors.phone && <div className="text-red-500 text-xs">{fieldErrors.phone}</div>}
        <label className="text-sm font-medium">Address</label>
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="border p-2 rounded"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        {fieldErrors.address && <div className="text-red-500 text-xs">{fieldErrors.address}</div>}
        <label className="text-sm font-medium">City</label>
        <input
          type="text"
          name="city"
          placeholder="City"
          className="border p-2 rounded"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        {fieldErrors.city && <div className="text-red-500 text-xs">{fieldErrors.city}</div>}
        <label className="text-sm font-medium">Postal Code</label>
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          className="border p-2 rounded"
          value={postalCode}
          onChange={e => setPostalCode(e.target.value)}
        />
        {fieldErrors.postalCode && <div className="text-red-500 text-xs">{fieldErrors.postalCode}</div>}
        <label className="text-sm font-medium">Country</label>
        <input
          type="text"
          name="country"
          placeholder="Country"
          className="border p-2 rounded"
          value={country}
          onChange={e => setCountry(e.target.value)}
        />
        {fieldErrors.country && <div className="text-red-500 text-xs">{fieldErrors.country}</div>}
        <label className="text-sm font-medium">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          className="border p-2 rounded"
          value={dateOfBirth}
          onChange={e => setDateOfBirth(e.target.value)}
        />
        {fieldErrors.dateOfBirth && <div className="text-red-500 text-xs">{fieldErrors.dateOfBirth}</div>}
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
        {fieldErrors.gender && <div className="text-red-500 text-xs">{fieldErrors.gender}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {formError && <div className="text-red-500 text-sm">{formError}</div>}
        {success && <div className="text-green-600 text-sm">Registration successful!</div>}
      </form>
      <div className="mt-4 text-xs text-gray-500">* Required fields</div>
    </main>
  );
}
