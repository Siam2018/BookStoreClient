export default function Hero() {
  return (
    <section
      className="w-full text-center relative flex flex-col items-center justify-center p-0 m-0"
      style={{ backgroundImage: 'url(/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '500px', marginTop: 0 }}
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      ></div>
      <div className="relative z-10 px-8 py-10 mt-8 max-w-2xl mx-auto">
        <h2 className="text-4xl text-white font-bold mb-4">Welcome to BookStore</h2>
        <p className="text-lg text-white mb-6">Your one-stop shop for all your reading needs. Discover new books, learn about us, or create an account to start shopping!</p>
        <div className="flex gap-4 justify-center">
          <a href="/products" className="bg-[#67C090] text-white px-6 py-2 rounded hover:bg-green-700">Browse Products</a>
          <a href="/about" className="bg-gray-200 text-[#67C090] px-6 py-2 rounded hover:bg-gray-300">About Us</a>
        </div>
      </div>
    </section>
  );
}
