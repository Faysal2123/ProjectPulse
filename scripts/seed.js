import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

// ---- Fix __dirname for ES module ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Load .env manually (local only) ----
try {
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf8");
    envConfig.split("\n").forEach(line => {
      const [key, ...values] = line.split("=");
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join("=").trim();
      }
    });
    console.log("Loaded .env file");
  }
} catch (e) {
  console.log(" Could not load .env file", e);
}

// ---- Mongo URI ----
const uri = process.env.MONGO_URI || "";

async function seed() {
  if (!uri.startsWith("mongodb")) {
    console.error(" Invalid MONGO_URI");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(" MongoDB connected");

    const db = client.db("projectPulse");

    // ---- Clear existing data ----
    await db.collection("users").deleteMany({});
    await db.collection("projects").deleteMany({});
    await db.collection("checkins").deleteMany({});
    await db.collection("feedbacks").deleteMany({});
    await db.collection("risks").deleteMany({});
    console.log(" Database cleared");

    // ---- Hash password once ----
    const hashedPassword = await bcrypt.hash("password", 10);

    // ---- Users ----
    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Employee One",
        email: "employee1@example.com",
        password: hashedPassword,
        role: "employee",
      },
      {
        name: "Employee Two",
        email: "employee2@example.com",
        password: hashedPassword,
        role: "employee",
      },
      {
        name: "Client User",
        email: "client@example.com",
        password: hashedPassword,
        role: "client",
      },
    ];

    const userResult = await db.collection("users").insertMany(users);
    console.log(` Users seeded: ${userResult.insertedCount}`);

    // ---- Project ----
    const project = {
      name: "Website Redesign",
      description: "Overhaul of the corporate website.",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "On Track",
      clientId: "client@example.com",
      employeeIds: ["employee1@example.com", "employee2@example.com"],
      healthScore: 100,
    };

    await db.collection("projects").insertOne(project);
    console.log(" Project seeded");

    console.log("Done!");
    process.exit(0);
  } catch (e) {
    console.error(" Error:", e);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
