export interface CheckIn {
  projectId: string;
  employeeId: string;
  progress: string;
  blockers: string;
  confidenceLevel: number;
  completionPercent: number;
  week: string;
}
