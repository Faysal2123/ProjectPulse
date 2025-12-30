"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Project } from "@/app/models/project";
import Link from "next/link";

export default function ClientDashboard() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!loading && user?.role === "client") {
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => setProjects(data));
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "client") return <div>Access Denied</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Client Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p._id?.toString()} className="p-6 bg-white rounded shadow">
            <h3 className="text-xl font-bold">{p.name}</h3>
            <p className="text-gray-600 mb-4">Status: {p.status}</p>
            <Link href={`/projects/${p._id}`} className="bg-purple-600 text-white px-4 py-2 rounded">Provide Feedback</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
