import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { signJWT } from "@/app/lib/auth";
import bcrypt from "bcryptjs";
import { User } from "@/app/models/user";

export async function POST(req: Request) {
  try {
    console.log("🔐 Login attempt started");
    const body = await req.json();
    console.log("📧 Email received:", body.email);

    const { email, password } = body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    console.log("🔌 Connecting to database...");
    const db = await connectDB();
    console.log("✅ Database connected");

    console.log("🔍 Looking for user:", email);
    const user = await db.collection<User>("users").findOne({ email });
    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user || !user.password) {
      console.log("❌ Invalid credentials - user not found or no password");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log("🔑 Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Invalid credentials - password mismatch");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log("🎫 Generating JWT token...");
    const token = signJWT({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    });
    console.log("✅ JWT token generated");

    const response = NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("✅ Login successful");
    return response;
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    const errorStack = error?.stack || "No stack trace";
    console.error("❌ Login API Error:", errorMsg);
    console.error("Error stack:", errorStack);

    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: errorMsg,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
