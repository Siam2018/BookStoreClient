export default function Register() {
  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form className="flex flex-col gap-4">
        <input type="text" name="fullName" placeholder="Full Name" className="border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" className="border p-2 rounded" />
        <input type="password" name="password" placeholder="Password" className="border p-2 rounded" />
        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Register</button>
      </form>
    </main>
  );
}
