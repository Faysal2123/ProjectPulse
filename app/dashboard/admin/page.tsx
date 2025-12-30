"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Project } from "@/app/models/project";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ name: "", description: "", startDate: "", endDate: "", clientId: "", employeeIds: "" });

  useEffect(() => {
    if (!loading && user?.role === "admin") {
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => setProjects(data));
    }
  }, [user, loading]);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({
            ...newProject,
            employeeIds: newProject.employeeIds.split(",").map(s => s.trim())
        })
    });
    if (res.ok) {
        alert("Project Created");
        window.location.reload();
    } else {
        alert("Failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "admin") return <div>Access Denied</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Create Project</h2>
        <form onSubmit={createProject} className="grid grid-cols-2 gap-4">
            <input placeholder="Name" className="border p-2" onChange={e => setNewProject({...newProject, name: e.target.value})} required />
            <input placeholder="Description" className="border p-2" onChange={e => setNewProject({...newProject, description: e.target.value})} required />
            <input type="date" className="border p-2" onChange={e => setNewProject({...newProject, startDate: e.target.value})} required />
            <input type="date" className="border p-2" onChange={e => setNewProject({...newProject, endDate: e.target.value})} required />
            <input placeholder="Client Email" className="border p-2" onChange={e => setNewProject({...newProject, clientId: e.target.value})} required />
            <input placeholder="Employee Emails (comma sep)" className="border p-2" onChange={e => setNewProject({...newProject, employeeIds: e.target.value})} required />
            <button className="col-span-2 bg-green-600 text-white p-2 rounded">Create</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p._id?.toString()} className={`p-6 rounded shadow border-l-4 ${p.healthScore < 60 ? 'border-red-500' : p.healthScore < 80 ? 'border-yellow-500' : 'border-green-500'} bg-white`}>
            <h3 className="text-xl font-bold">{p.name}</h3>
            <p className="text-gray-600 mb-2">{p.status} (Health: {p.healthScore})</p>
            <p className="text-sm text-gray-500">Client: {p.clientId}</p>
            <Link href={`/projects/${p._id}`} className="text-blue-500 hover:underline mt-4 block">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
