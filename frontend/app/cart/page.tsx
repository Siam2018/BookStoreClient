"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type CartItem = { productId: number; quantity: number; price?: number };
export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    }
  }, []);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");
    setCheckoutSuccess(false);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
      if (!token) throw new Error("No token found. Please login.");
      if (!user || !user.id) throw new Error("User not found. Please login.");
      if (!cart.length) throw new Error("Cart is empty.");
      const payload = {
        status: "pending",
        orderItems: cart.map((item: CartItem) => ({ productId: item.productId, quantity: item.quantity })),
      };
      const authHeader = `Bearer ${token}`;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/orders`,
        payload,
        {
          headers: { Authorization: authHeader },
        }
      );
      localStorage.removeItem("cart");
      setCart([]);
      setCheckoutSuccess(true);
      router.push("/orders");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setCheckoutError(
        Array.isArray(msg)
          ? msg.join(", ")
          : msg || err.message || "Checkout failed."
      );
    }
    setCheckoutLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {cart.map((item, idx) => (
            <li key={idx} className="border p-4 rounded">
              <div>Product ID: {item.productId}</div>
              {item.price !== undefined && (
                <div>Price: ${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price || 0).toFixed(2)}</div>
              )}
              {item.price !== undefined && (
                <div>Total: {typeof item.price === 'number' ? (item.price * item.quantity).toFixed(2) : (Number(item.price || 0) * item.quantity).toFixed(2)}</div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span>Quantity:</span>
                <button
                  className="bg-gray-300 text-black px-2 rounded"
                  onClick={() => {
                    if (item.quantity === 1) {
                      // Remove item if quantity is 1 and user clicks -
                      const newCart = cart.filter((_, i) => i !== idx);
                      setCart(newCart);
                      localStorage.setItem("cart", JSON.stringify(newCart));
                    } else {
                      const newCart = cart.map((c, i) => i === idx ? { ...c, quantity: c.quantity - 1 } : c);
                      setCart(newCart);
                      localStorage.setItem("cart", JSON.stringify(newCart));
                    }
                  }}
                  disabled={item.quantity <= 0}
                >-</button>
                <input
                  type="text"
                  value={item.quantity}
                  readOnly
                  className="w-12 text-center font-bold text-gray-800 border rounded bg-gray-100"
                />
                <button
                  className="bg-gray-300 text-black px-2 rounded"
                  onClick={() => {
                    const newCart = cart.map((c, i) => i === idx ? { ...c, quantity: c.quantity + 1 } : c);
                    setCart(newCart);
                    localStorage.setItem("cart", JSON.stringify(newCart));
                  }}
                >+</button>
                <button
                  className="bg-red-500 text-white px-2 rounded ml-2"
                  onClick={() => {
                    const newCart = cart.filter((_, i) => i !== idx);
                    setCart(newCart);
                    localStorage.setItem("cart", JSON.stringify(newCart));
                  }}
                >Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {cart.length > 0 && (
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow mb-4"
          onClick={handleCheckout}
          disabled={checkoutLoading}
        >
          {checkoutLoading ? "Processing..." : "Checkout"}
        </button>
      )}
      {checkoutError && <div className="text-red-600 mb-4">{checkoutError}</div>}
      {checkoutSuccess && <div className="text-green-600 mb-4">Order placed successfully!</div>}
    </main>
  );
}
