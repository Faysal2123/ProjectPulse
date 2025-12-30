import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Project } from "@/app/models/project";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    try {
        const db = await connectDB();
        const project = await db.collection<Project>("projects").findOne({ _id: new ObjectId(id) });

        if (!project) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (e) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
}
