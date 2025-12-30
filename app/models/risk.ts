export interface Risk {
  projectId: string;
  title: string;
  severity: "Low" | "Medium" | "High";
  mitigation: string;
  status: "Open" | "Resolved";
}
