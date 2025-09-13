export default function Hero() {
  return (
    <section className="w-full bg-[#DDF4E7] flex flex-col md:flex-row items-center justify-between gap-8 py-8">
      <div className="md:w-1/2 text-left px-8">
        <h2 className="text-4xl font-bold mb-4">Welcome to BookStore</h2>
        <p className="text-lg mb-6">Your one-stop shop for all your reading needs. Discover new books, learn about us, or create an account to start shopping!</p>
        <div className="flex gap-4 justify-start">
          <a href="/products" className="bg-[#67C090] text-white px-6 py-2 rounded hover:bg-green-700">Browse Products</a>
          <a href="/about" className="bg-[#67C090] text-white px-6 py-2 rounded hover:bg-green-700">About Us</a>
        </div>
      </div>
      <div className="md:w-1/2 flex justify-center px-8">
        {/* Featured Book Card */}
        <div className="border rounded-lg p-6 shadow flex flex-col items-center bg-gray-100 w-72">
          <img src="/placeholder.png" alt="Featured Book" className="w-full h-40 object-cover mb-2 rounded" />
          <h4 className="font-semibold text-lg mb-2">Featured Book</h4>
          <p className="text-sm mb-2">Author Name</p>
          <p className="text-blue-600 font-bold">$19.99</p>
          <button className="px-4 py-2 bg-[#67C090] text-white rounded mt-2">View</button>
        </div>
      </div>
    </section>
  );
}
