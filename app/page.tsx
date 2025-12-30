"use client";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function Home() {
    const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-5xl font-bold text-blue-600 mb-6">Project Pulse</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Monitor project health, track risks, and gather client feedback in one place.
      </p>

        {!user ? (
            <div className="space-x-4">
                <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition">
                Login to Dashboard
                </Link>
            </div>
        ) : (
            <div className="space-x-4">
                 <Link href={user.role === 'admin' ? '/dashboard/admin' : user.role === 'client' ? '/dashboard/client' : '/dashboard/employee'} className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition">
                    Go to Dashboard
                </Link>
            </div>
        )}
      
    </div>
  );
}
