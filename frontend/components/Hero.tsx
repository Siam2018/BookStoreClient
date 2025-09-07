export default function Hero() {
  return (
    <section className="max-w-2xl text-center mx-auto my-12">
      <h2 className="text-4xl font-bold mb-4">Welcome to BookStore</h2>
      <p className="text-lg mb-6">Your one-stop shop for all your reading needs. Discover new books, learn about us, or create an account to start shopping!</p>
      <div className="flex gap-4 justify-center">
        <a href="/products" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800">Browse Products</a>
        <a href="/about" className="bg-gray-200 text-blue-700 px-6 py-2 rounded hover:bg-gray-300">About Us</a>
      </div>
    </section>
  );
}
