import { connectDB } from "@/app/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectDB();

  if (req.method === "GET") {
    const projects = await db.collection("projects").find({}).toArray();
    return res.status(200).json(projects);
  }

  res.status(405).json({ message: "Method not allowed" });
}
