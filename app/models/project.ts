import { ObjectId } from "mongodb";

export interface Project {
  _id?: ObjectId;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: "On Track" | "At Risk" | "Critical" | "Completed";
  clientId: string; // Email for now
  employeeIds: string[]; // Email for now
  healthScore: number;
}
