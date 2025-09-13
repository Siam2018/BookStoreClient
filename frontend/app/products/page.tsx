"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/products`)
      .then(res => {
        // Ensure products is always an array
        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch products.");
        setLoading(false);
      });
  }, []);

  if (loading) return <main className="p-8">Loading...</main>;
  if (error) return <main className="p-8 text-red-500">{error}</main>;

  return (
    <section className="w-full max-w-4xl mx-auto my-12">
      <h3 className="text-2xl font-semibold mb-4">Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col">
            <img src={product.imageURL || "/bookplaceholder.svg"} alt={product.name} className="w-full h-50 object-cover mb-2 rounded" />
            <h4 className="font-semibold text-lg mb-2">{product.name || product.title}</h4>
            <p className="text-sm mb-2">{product.author}</p>
            <p className="text-xs text-gray-500">{product.description}</p>
            <p className="text-blue-600 font-bold">${product.price}</p>
            <div className="mt-2 flex gap-2">
              <Link href={`/products/${product.id}`} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">View</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
