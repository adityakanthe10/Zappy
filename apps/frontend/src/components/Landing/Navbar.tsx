"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="h-10 flex items-center">
          <Link href="/">
            <div className="text-xl font-bold">Zappy</div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/login" className="text-gray-700 hover:text-black">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              login
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md">
              Signup
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg p-4 space-y-4">
          <Link
            href="/login"
            className="block pl-2 text-black hover:text-black"
          >
            Login
          </Link>
          <Link href="/register">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Signup
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
