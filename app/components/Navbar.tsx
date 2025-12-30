"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 tracking-wide"
          >
            ProjectPulse
          </Link>

          <nav className="flex items-center gap-8">
            {user && (
                <>
                    {user.role === 'admin' && <Link href="/dashboard/admin" className="text-gray-600 hover:text-blue-600">Dashboard</Link>}
                    {user.role === 'employee' && <Link href="/dashboard/employee" className="text-gray-600 hover:text-blue-600">My Work</Link>}
                    {user.role === 'client' && <Link href="/dashboard/client" className="text-gray-600 hover:text-blue-600">Portal</Link>}
                </>
            )}

            {!user ? (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Hi, {user.name}</span>
                  <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
              </div>
            )}
          </nav>

        </div>
      </div>
    </header>
  );
}
