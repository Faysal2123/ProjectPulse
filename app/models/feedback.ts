export interface Feedback {
  projectId: string;
  clientId: string;
  satisfaction: number;
  communication: number;
  comment?: string;
  flagged: boolean;
}
