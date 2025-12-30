import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Risk } from "@/app/models/risk";
import { Project } from "@/app/models/project";
import { CheckIn } from "@/app/models/checkin";
import { Feedback } from "@/app/models/feedback";
import { verifyJWT } from "@/app/lib/auth";
import { calculateHealthScore, getHealthStatus } from "@/app/lib/healthScore";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const user = verifyJWT(token || "") as any;

    if (!user || user.role !== "employee") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const db = await connectDB();

        const newRisk: Risk = {
            ...body,
            status: "Open"
        };
        await db.collection("risks").insertOne(newRisk);

        // Recalculate Health for this project
        const projectId = body.projectId;
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
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) return NextResponse.json([]);

    const db = await connectDB();
    const risks = await db.collection("risks").find({ projectId }).toArray();
    return NextResponse.json(risks);
}
