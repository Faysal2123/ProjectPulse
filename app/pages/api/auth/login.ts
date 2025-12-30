import { signJWT } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password } = req.body;
    const db = await connectDB();

    const user = await db.collection("users").findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare plaintext password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // create JWT token
    const token = signJWT({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    return res.status(200).json({
      token,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
