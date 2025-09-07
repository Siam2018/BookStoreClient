"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/products")
      .then(res => {
        setProducts(res.data);
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
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <p className="mb-2">Browse our wide selection of books below.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
            <p className="text-sm mb-2">{product.author}</p>
            <p className="text-xs text-gray-500">{product.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
