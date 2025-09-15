"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import ProductForm from "../../components/ProductForm";

type Product = {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageURL?: string;
  isActive?: boolean;
  author?: string;
  publisher?: string;
  isbn?: string;
  weight?: number;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://localhost:3000";

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    setIsAdmin(adminLoggedIn);
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/products`);
      setProducts(Array.isArray(res.data.data) ? res.data.data : []);
      setError("");
    } catch {
      setError("Failed to fetch products.");
    }
    setLoading(false);
  }

  async function handleEditProduct(data: Product) {
    if (!editProduct || !editProduct.id) return;
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(`${baseUrl}/products/${editProduct.id}`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchProducts();
      setEditProduct(null);
      setShowForm(false);
    } catch {
      setError("Failed to update product.");
    }
  }

  async function handleDeleteProduct(id: number) {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(`${baseUrl}/products/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchProducts();
    } catch {
      setError("Failed to delete product.");
    }
  }

  if (loading) return <main className="p-8">Loading...</main>;
  if (error) return <main className="p-8 text-red-500">{error}</main>;

  return (
    <section className="w-full max-w-4xl mx-auto my-12">
      <h3 className="text-2xl font-semibold mb-4">Products</h3>
      {showForm && (
        <ProductForm
          initialData={editProduct || undefined}
          onSubmit={handleEditProduct}
          submitLabel="Update Product"
        />
      )}
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
              {isAdmin && (
                <>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => { setEditProduct(product); setShowForm(true); }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
