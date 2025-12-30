import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Feedback } from "@/app/models/feedback";
import { Project } from "@/app/models/project";
import { CheckIn } from "@/app/models/checkin";
import { Risk } from "@/app/models/risk";
import { verifyJWT } from "@/app/lib/auth";
import { calculateHealthScore, getHealthStatus } from "@/app/lib/healthScore";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = req.cookies.get("token")?.value;
    const user = verifyJWT(token || "") as any;

    if (!user || user.role !== "client") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const projectId = (await params).id;

    try {
        const body = await req.json();
        const db = await connectDB();

        const newFeedback: Feedback = {
            ...body,
            projectId,
            clientId: user.email,
            date: new Date()
        };
        await db.collection("feedbacks").insertOne(newFeedback);

        // Recalculate Health
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
