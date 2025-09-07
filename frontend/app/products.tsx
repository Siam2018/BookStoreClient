export default function Products() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <p className="mb-2">Browse our wide selection of books below.</p>
      {/* TODO: Add product listing here, fetch from backend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {/* Example product card */}
        <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-lg mb-2">Book Title</h2>
          <p className="text-sm mb-2">Author Name</p>
          <p className="text-xs text-gray-500">Description of the book goes here.</p>
        </div>
        {/* More product cards... */}
      </div>
    </main>
  );
}
