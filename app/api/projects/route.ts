import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Project } from "@/app/models/project";
import { verifyJWT } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const user = verifyJWT(token || "");

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDB();
    let query = {};
    const u = user as any;

    if (u.role === "employee") {
        query = { employeeIds: u.email }; // Using email as ID for simplicity or need to map
    } else if (u.role === "client") {
        query = { clientId: u.email };
    }
    // Admin sees all

    const projects = await db.collection<Project>("projects").find(query).toArray();
    return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const user = verifyJWT(token || "") as any;

    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const db = await connectDB();
        const newProject: Project = {
            ...body,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            healthScore: 100, // Default start
            status: "On Track"
        };
        const result = await db.collection<Project>("projects").insertOne(newProject);
        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (e) {
        return NextResponse.json({ error: "Creation failed" }, { status: 500 });
    }
}
