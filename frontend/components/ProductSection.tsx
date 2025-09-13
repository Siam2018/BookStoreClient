"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";
import Link from "next/link";

export default function ProductSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/products`);
      setProducts(res.data.data || []);
      setError(null);
    } catch (err: any) {
      setError("Failed to load products.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (productData: any) => {
  await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/products`, productData);
    fetchProducts();
    setShowForm(false);
  };

  const handleEditProduct = async (productData: any) => {
    if (!editProduct) return;
  await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/products/${editProduct.id}`, productData);
    fetchProducts();
    setEditProduct(null);
    setShowForm(false);
  };

  const handleDeleteProduct = async (id: number) => {
  await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/products/${id}`);
    fetchProducts();
  };

  const handlePatchProduct = async (id: number, patchData: any) => {
  await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/products/${id}`, patchData);
    fetchProducts();
  };

  if (loading) return <div>Loading products...</div>;
  if (error || products.length === 0) {
    // Placeholder cards
    return (
      <section className="w-full max-w-4xl mx-auto my-12">
        <h3 className="text-2xl font-semibold mb-4">Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border rounded-lg p-4 shadow flex flex-col items-center bg-gray-100"
            >
              <img
                src="/placeholder.png"
                alt="Placeholder"
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h4 className="font-semibold text-lg mb-2">Product {i}</h4>
              <p className="text-sm mb-2">Author {i}</p>
              <p className="text-[#67C090] font-bold">$0.00</p>
              <button className="px-2 py-1 bg-[#67C090] text-white rounded mt-2">
                View
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }

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
            <p className="text-[#67C090] font-bold">${product.price}</p>
            <div className="mt-2 flex gap-2">
              <Link href={`/products/${product.id}`} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">View</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
