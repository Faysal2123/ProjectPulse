"use client";
import { useEffect, useState, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Project } from "@/app/models/project";
import { CheckIn } from "@/app/models/checkin";
import { Feedback } from "@/app/models/feedback";
import { Risk } from "@/app/models/risk";

// Params type for Next.js 15
interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectDetails({ params }: PageProps) {
  // Unwrap params using React.use()
  const { id } = use(params);
  
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Forms state
  const [progress, setProgress] = useState("");
  const [confidence, setConfidence] = useState(5);
  const [satisfaction, setSatisfaction] = useState(5);
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    if (id) {
        fetch(`/api/projects/${id}`).then(r => r.json()).then(setProject);
    }
  }, [id]);

  const submitCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/projects/${id}/checkin`, {
        method: "POST",
        body: JSON.stringify({ progress, confidenceLevel: Number(confidence), completionPercent: 0, week: "1", blockers: "" })
    });
    alert("Check-in submitted");
    window.location.reload();
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/projects/${id}/feedback`, {
        method: "POST",
        body: JSON.stringify({ satisfaction: Number(satisfaction), communication: 5, flagged })
    });
    alert("Feedback submitted");
    window.location.reload();
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-4xl font-bold">{project.name}</h1>
            <p className="text-gray-500">{project.description}</p>
        </div>
        <div className={`text-center p-4 rounded-full text-white font-bold
            ${project.healthScore >= 80 ? 'bg-green-500' : project.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}
        `}>
            Health: {project.healthScore}
        </div>
      </div>

      {/* Role Actions */}
      {user?.role === "employee" && (
        <div className="mb-8 p-6 bg-blue-50 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Weekly Check-in</h2>
            <form onSubmit={submitCheckIn} className="space-y-4">
                <textarea placeholder="Progress Summary" className="w-full p-2 rounded" onChange={e => setProgress(e.target.value)} required />
                <div>
                    <label>Confidence (1-5): </label>
                    <input type="number" min="1" max="5" value={confidence} onChange={e => setConfidence(Number(e.target.value))} className="p-2 w-20 rounded" />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Check-in</button>
            </form>
        </div>
      )}

      {user?.role === "client" && (
        <div className="mb-8 p-6 bg-purple-50 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Provide Feedback</h2>
            <form onSubmit={submitFeedback} className="space-y-4">
                <div>
                    <label>Satisfaction (1-5): </label>
                    <input type="number" min="1" max="5" value={satisfaction} onChange={e => setSatisfaction(Number(e.target.value))} className="p-2 w-20 rounded" />
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" checked={flagged} onChange={e => setFlagged(e.target.checked)} />
                    <label className="text-red-600 font-bold">Flag an Issue (Critical)</label>
                </div>
                <button className="bg-purple-600 text-white px-4 py-2 rounded">Submit Feedback</button>
            </form>
        </div>
      )}

      {/* Timeline placeholder - fetching separate activity data takes more time, simplified here */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold border-b pb-2">Project Activity</h2>
        <p className="mt-4 text-gray-500">Activity timeline would load here fetching from Checkins/Feedback collections.</p>
      </div>
    </div>
  );
}
