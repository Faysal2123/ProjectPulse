import { NextResponse, NextRequest } from "next/server";
import { verifyJWT } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ user: null });
    }

    const payload = verifyJWT(token);
    if (!payload) {
        return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: payload });
}
