import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/db";
import { User } from "@/app/models/user";

// Simple seed check logic (should be protected in prod)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const db = await connectDB();

        // Check if user already exists
        const existing = await db.collection<User>("users").findOne({ email: body.email });
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const newUser: User = {
            name: body.name,
            email: body.email,
            password: body.password, // In real app, hash this!
            role: body.role,
            createdAt: new Date()
        };

        const result = await db.collection<User>("users").insertOne(newUser);
        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const db = await connectDB();
        const users = await db.collection<User>("users").find({}).toArray();
        return NextResponse.json(users);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
