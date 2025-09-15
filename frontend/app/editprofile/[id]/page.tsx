"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

interface Admin {
	id: string;
	username: string;
	fullName: string;
	email: string;
	gender: string;
	phone: string;
	password: string;
	imageURL: string;
	address: string;
	city: string;
	country: string;
	dateOfBirth: string;
}

export default function EditProfilePage() {
	const router = useRouter();
	const params = useParams();
	const { id } = params;
	const [admin, setAdmin] = useState<Admin | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

	useEffect(() => {
		async function fetchAdmin() {
			try {
				const token = localStorage.getItem("jwtToken");
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

	async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const token = localStorage.getItem("jwtToken");
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
	if (!admin) return null;

	return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#DDF4E7] via-[#67C090] to-[#A7E9C7]">
				<h1 className="text-2xl font-bold mb-4 text-black">Edit Admin Profile</h1>
				<form onSubmit={handleUpdate} className="flex flex-col gap-3 w-full max-w-md bg-white/60 p-6 rounded-xl shadow-lg">
					<input
						type="text"
						value={admin.username}
						onChange={e => setAdmin({ ...admin, username: e.target.value })}
						placeholder="Username"
						className="border p-2 rounded text-black"
						required
					/>
					<input
						type="text"
						value={admin.fullName}
						onChange={e => setAdmin({ ...admin, fullName: e.target.value })}
						placeholder="Full Name"
						className="border p-2 rounded text-black"
						required
					/>
					<input
						type="email"
						value={admin.email}
						onChange={e => setAdmin({ ...admin, email: e.target.value })}
						placeholder="Email"
						className="border p-2 rounded text-black"
						required
					/>
					<input
						type="text"
						value={admin.gender}
						onChange={e => setAdmin({ ...admin, gender: e.target.value })}
						placeholder="Gender (Male/Female/Other)"
						className="border p-2 rounded text-black"
						required
					/>
					<input
						type="text"
						value={admin.phone}
						onChange={e => setAdmin({ ...admin, phone: e.target.value })}
						placeholder="Phone (7-15 digits)"
						className="border p-2 rounded text-black"
						required
					/>
					<input
						type="text"
						value={admin.imageURL}
						onChange={e => setAdmin({ ...admin, imageURL: e.target.value })}
						placeholder="Image URL"
						className="border p-2 rounded text-black"
					/>
					<input
						type="text"
						value={admin.address}
						onChange={e => setAdmin({ ...admin, address: e.target.value })}
						placeholder="Address"
						className="border p-2 rounded text-black"
					/>
					<input
						type="text"
						value={admin.city}
						onChange={e => setAdmin({ ...admin, city: e.target.value })}
						placeholder="City"
						className="border p-2 rounded text-black"
					/>
					<input
						type="text"
						value={admin.country}
						onChange={e => setAdmin({ ...admin, country: e.target.value })}
						placeholder="Country"
						className="border p-2 rounded text-black"
					/>
					<input
						type="date"
						value={admin.dateOfBirth}
						onChange={e => setAdmin({ ...admin, dateOfBirth: e.target.value })}
						placeholder="Date of Birth"
						className="border p-2 rounded text-black"
					/>
					<button type="submit" className="bg-[#67C090] text-white py-2 rounded">Update Admin</button>
				</form>
			</div>
	);
}
