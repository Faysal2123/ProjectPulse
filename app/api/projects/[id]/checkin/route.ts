import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/db";
import { CheckIn } from "@/app/models/checkin";
import { Project } from "@/app/models/project";
import { Risk } from "@/app/models/risk";
import { Feedback } from "@/app/models/feedback";
import { verifyJWT } from "@/app/lib/auth";
import { calculateHealthScore, getHealthStatus } from "@/app/lib/healthScore";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = req.cookies.get("token")?.value;
    const user = verifyJWT(token || "") as any;

    if (!user || user.role !== "employee") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // In Next.js 15+, params is a Promise
    const projectId = (await params).id;

    try {
        const body = await req.json();
        const db = await connectDB();

        // 1. Save Check-in
        const newCheckIn: CheckIn = {
            ...body,
            projectId,
            employeeId: user.email,
            date: new Date()
        };
        await db.collection<CheckIn>("checkins").insertOne(newCheckIn);

        // 2. Trigger Health Recalculation (Simplified: Do it inline)
        const project = await db.collection<Project>("projects").findOne({ _id: new ObjectId(projectId) });
        if (project) {
            const checkIns = await db.collection<CheckIn>("checkins").find({ projectId }).toArray();
            const feedbacks = await db.collection<Feedback>("feedbacks").find({ projectId }).toArray();
            const risks = await db.collection<Risk>("risks").find({ projectId }).toArray();

            const score = calculateHealthScore(project, checkIns, feedbacks, risks);
            const status = getHealthStatus(score);

            await db.collection("projects").updateOne(
                { _id: new ObjectId(projectId) },
                { $set: { healthScore: score, status: status } }
            );
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Failed to submit check-in" }, { status: 500 });
    }
}

// GET all check-ins for a project
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const projectId = (await params).id;
    const db = await connectDB();
    const checkIns = await db.collection("checkins").find({ projectId }).sort({ date: -1 }).toArray();
    return NextResponse.json(checkIns);
}
