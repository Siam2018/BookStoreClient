
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/products/${id}`)
      .then(res => {
        setProduct(res.data.data);
        setError(null);
      })
      .catch(() => setError("Failed to load product."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found.</div>;

  const handleAddToCart = () => {
    setCartLoading(true);
    setCartSuccess(false);
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((item: any) => item.productId === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ productId: product.id, quantity });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartSuccess(true);
    } catch {
      setCartSuccess(false);
    }
    setCartLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto my-12 p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 via-white to-green-50">
      <img src={product.imageURL || "/placeholder.png"} alt={product.name} className="w-full h-64 object-cover mb-4 rounded-xl border-2 border-blue-200" />
      <h2 className="text-3xl font-bold text-blue-700 mb-2">{product.name || product.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        <p className="text-base text-gray-800 font-semibold">Author:</p>
        <p className="text-base text-gray-900">{product.author}</p>
        <p className="text-base text-gray-800 font-semibold">Category:</p>
        <p className="text-base text-gray-900">{product.category}</p>
        <p className="text-base text-gray-800 font-semibold">Publisher:</p>
        <p className="text-base text-gray-900">{product.publisher}</p>
        <p className="text-base text-gray-800 font-semibold">ISBN:</p>
        <p className="text-base text-gray-900">{product.isbn}</p>
        <p className="text-base text-gray-800 font-semibold">Language:</p>
        <p className="text-base text-gray-900">{product.language}</p>
        <p className="text-base text-gray-800 font-semibold">Pages:</p>
        <p className="text-base text-gray-900">{product.pages}</p>
        <p className="text-base text-gray-800 font-semibold">Published:</p>
        <p className="text-base text-gray-900">{product.publishedDate}</p>
      </div>
      <p className="mb-2 text-gray-700 text-base font-semibold">Description:</p>
      <p className="mb-4 text-gray-900">{product.description}</p>
      <p className="text-green-600 font-bold text-2xl mb-2">${product.price}</p>
      <div className="flex items-center gap-4 mt-4">
        <label htmlFor="quantity" className="font-semibold text-gray-800">Quantity:</label>
        <input
          id="quantity"
          type="number"
          min={1}
          max={product.stock}
          value={quantity}
          onChange={e => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
          className="w-20 px-2 py-1 border rounded"
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded shadow"
          onClick={handleAddToCart}
          disabled={cartLoading}
        >
          {cartLoading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
      {cartSuccess && <div className="text-green-700 mt-2 font-semibold">Added to cart!</div>}
    </div>
  );
}
