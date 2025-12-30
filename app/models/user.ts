import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string; // Optional because we might not return it
  role: "admin" | "employee" | "client";
  createdAt?: Date;
}
