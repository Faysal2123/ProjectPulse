import { Project } from "@/app/models/project";
import { CheckIn } from "@/app/models/checkin";
import { Feedback } from "@/app/models/feedback";
import { Risk } from "@/app/models/risk";

export function calculateHealthScore(
    project: Project,
    checkIns: CheckIn[],
    feedbacks: Feedback[],
    risks: Risk[]
): number {
    let score = 100;

    // 1. Client Satisfaction (Last Few Feedbacks) - Weight 40%
    // Scale 1-5. 5=100%, 1=20%.
    if (feedbacks.length > 0) {
        const totalSat = feedbacks.reduce((sum, f) => sum + f.satisfaction, 0);
        const avgSat = totalSat / feedbacks.length;
        // Map 1..5 to 0..40 deduction? No, let's just make it a component.
        // Let's degrade from 100 based on missing satisfaction.
        // If avg is 5, no deduction. If avg is 1, max deduction.
        // Logic: (5 - Avg) * 10 points.
        // 5 -> 0 lost. 4 -> 10 lost. 1 -> 40 lost.
        score -= (5 - avgSat) * 10;
    }

    // 2. Employee Confidence - Weight 30%
    // Scale 1-5.
    if (checkIns.length > 0) {
        const totalConf = checkIns.reduce((sum, c) => sum + c.confidenceLevel, 0);
        const avgConf = totalConf / checkIns.length;
        // Similar logic: (5 - Avg) * 8 (approx 30-40 range).
        score -= (5 - avgConf) * 8;
    }

    // 3. Flagged Issues - Critical Hits
    // Each flagged issue deducts 20 points immediately.
    const flaggedCount = feedbacks.filter(f => f.flagged).length;
    score -= flaggedCount * 20;

    // 4. Risks - Weight 10% (Penalty)
    const openRisks = risks.filter(r => r.status === "Open");
    openRisks.forEach(r => {
        if (r.severity === "High") score -= 10;
        if (r.severity === "Medium") score -= 5;
        if (r.severity === "Low") score -= 2;
    });

    // 5. Timeline Check
    const now = new Date();
    if (now > new Date(project.endDate) && project.status !== "Completed") {
        score -= 15; // Overdue penalty
    }

    // Cap at 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
}

export function getHealthStatus(score: number): "On Track" | "At Risk" | "Critical" {
    if (score >= 80) return "On Track";
    if (score >= 60) return "At Risk";
    return "Critical";
}
