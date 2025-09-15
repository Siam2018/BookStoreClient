"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../components/ProductForm";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageURL?: string;
}

export default function EditProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get(`${baseUrl}/products`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProducts(res.data.data || res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load products.");
    }
    setLoading(false);
  }

  async function handleAddProduct(data: Omit<Product, "id">) {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(`${baseUrl}/products`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchProducts();
      setShowForm(false);
    } catch (err) {
      setError("Failed to add product.");
    }
  }

  async function handleEditProduct(data: Omit<Product, "id">) {
    if (!editProduct) return;
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(`${baseUrl}/products/${editProduct.id}`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchProducts();
      setEditProduct(null);
      setShowForm(false);
    } catch (err) {
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
    } catch (err) {
      setError("Failed to delete product.");
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-[#DDF4E7] via-[#67C090] to-[#A7E9C7] py-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Edit Products</h1>
      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => { setEditProduct(null); setShowForm(true); }}
      >
        Add New Product
      </button>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {showForm && (
        <ProductForm
          initialData={editProduct || undefined}
          onSubmit={editProduct ? handleEditProduct : handleAddProduct}
          submitLabel={editProduct ? "Update Product" : "Add Product"}
        />
      )}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {loading ? (
          <div>Loading products...</div>
        ) : products.length === 0 ? (
          <div>No products found.</div>
        ) : (
          products.map(product => (
            <div key={product.id} className="bg-white/80 p-6 rounded-xl shadow flex flex-col gap-2">
              <img src={product.imageURL || "/bookplaceholder.svg"} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
              <h2 className="text-xl font-bold text-black">{product.name}</h2>
              <p className="text-black">{product.description}</p>
              <p className="text-[#67C090] font-bold">${product.price}</p>
              <div className="flex gap-2 mt-2">
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
