import Link from "next/link";
import LandingNavbar from "../components/Landing/Navbar";

// app/page.tsx
export default function Home() {
  return (
    <>
    <LandingNavbar />
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gray-50">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 mt-10">
          Order Management Made Easy
        </h1>
        <p className="text-lg mb-8 text-gray-600">
          Manage your orders efficiently with our powerful platform.
        </p>
        <Link href="/register">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Get Started
        </button>
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-10 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 border rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">Easy Order Tracking</h3>
            <p className="text-gray-600">
              Track all your orders in one place with real-time updates.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">
              Admin & Delivery Management
            </h3>
            <p className="text-gray-600">
              Empower admins and delivery partners with custom tools.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">Secure and Fast</h3>
            <p className="text-gray-600">
              Built with security and speed at the core for your business.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="px-8 py-20 bg-blue-600 text-white text-center"
      >
        <h2 className="text-3xl font-bold mb-6">
          Ready to streamline your operations?
        </h2>
        <a
          href="/register"
          className="px-6 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100"
        >
          Join Now
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6">
        © 2025 Zappy. All rights reserved.
      </footer>
    </>
  );
}
