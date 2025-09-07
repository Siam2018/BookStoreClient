import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
  axios.get(`${process.env.BACKEND_ORIGIN}/products/${id}`)
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

  return (
    <div className="max-w-xl mx-auto my-12 p-6 border rounded shadow bg-white">
      <img src={product.imageURL || "/placeholder.png"} alt={product.name} className="w-full h-64 object-cover mb-4 rounded" />
      <h2 className="text-2xl font-bold mb-2">{product.name || product.title}</h2>
      <p className="text-lg mb-2">{product.author}</p>
      <p className="mb-2 text-gray-700">{product.description}</p>
      <p className="text-blue-600 font-bold text-xl mb-2">${product.price}</p>
      {/* Add more product details or actions here */}
    </div>
  );
};

export default ProductDetails;
