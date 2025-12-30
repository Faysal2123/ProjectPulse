# Project Pulse: Demo Video Guide (4-5 Minutes)

This guide provides a structured script and page-by-page explanation for a demonstration video of the **Project Pulse** application.

---

## 📽️ Demo Video Script (Estimated: 4-5 Minutes)

### 0:00 - 0:30 | Introduction & Tech Stack
*   **Action**: Start on the Landing Page (`/`).
*   **Script**: "Hello! Today I’m demonstrating **Project Pulse**, a project health monitoring system designed for IT and software companies. Built with **Next.js**, **Tailwind CSS**, and **MongoDB**, this platform helps teams avoid project 'surprises' by tracking health scores in real-time. We use **JWT-based authentication** for three distinct roles: Admin, Employee, and Client."

### 0:30 - 1:30 | Admin Dashboard: Management & Oversight
*   **Action**: Log in as Admin and show the Dashboard (`/dashboard/admin`).
*   **Script**: "As an Admin, I have a bird's-eye view of all projects. Here you can see the health scores visualized with color-coded indicators: Green for healthy, Yellow for warning, and Red for critical status. I can easily create a new project by filling out this form—assigning a name, description, client email, and team members. Once created, the project appears in the grid, ready for monitoring."

### 1:30 - 2:30 | Employee Flow: Weekly Check-ins
*   **Action**: Log in as an Employee and go to "My Projects" (`/dashboard/employee`).
*   **Script**: "Now, switching to the Employee view. Employees only see the projects they are assigned to. By clicking 'View & Check-in', an employee can submit their weekly report. They provide a progress summary and a confidence level from 1 to 5. This 'Confidence Level' is a key metric in our health score calculation, giving management early insight into potential morale or technical blockers."

### 2:30 - 3:30 | Client Flow: Feedback & Pulse Check
*   **Action**: Log in as a Client and go to the Client Portal (`/dashboard/client`).
*   **Script**: "Finally, let's look at the Client experience. Clients see their specific project's status. They can provide feedback directly through the portal. They rate their satisfaction and, most importantly, can 'Flag an Issue'. If a client flags a critical issue, the project health score immediately takes a significant penalty, alerting the Admin to take action."

### 3:30 - 4:15 | Health Score Logic: The "Pulse"
*   **Action**: Show the Project Details page (`/projects/[id]`) highlighting the Health Score.
*   **Script**: "What makes Project Pulse unique is our **Health Score Logic**. The score (0-100) isn't just a guess—it's calculated dynamically. It starts at 100 and applies weights based on:
    *   **Client Satisfaction (40%)**: Low ratings deduct points.
    *   **Employee Confidence (30%)**: If the team feels unsafe, the score drops.
    *   **Risks & Critical Issues**: Flagged issues trigger a -20 point penalty immediately.
    *   **Timelines**: Overdue projects are penalized by 15 points.
    This provides a data-driven 'Pulse' of the project's true status."

### 4:15 - 5:00 | Conclusion
*   **Action**: Go back to the landing page or overall dashboard.
*   **Script**: "In conclusion, Project Pulse bridge the communication gap between admins, employees, and clients. By quantifying qualitative feedback, it ensures that every project stays on track. Thank you for watching!"

---

## 📄 Project Page Explanations

### 1. Landing Page (`/`)
- **Purpose**: Introduction to the platform.
- **Key Elements**: "Login to Dashboard" button which redirects based on current auth state.

### 2. Login Page (`/login`)
- **Purpose**: Secure access.
- **Roles**: 
    - **Admin**: Full control.
    - **Employee**: Reporting progress.
    - **Client**: Providing feedback.

### 3. Admin Dashboard (`/dashboard/admin`)
- **Features**: 
    - List of all projects with current Health Scores.
    - "Create Project" form for quick setup.
    - Color-coded segments (Red < 60, Yellow < 80, Green >= 80).

### 4. Employee Dashboard (`/dashboard/employee`)
- **Features**: 
    - View assigned projects.
    - Action button to enter project details for check-ins.

### 5. Client Dashboard (`/dashboard/client`)
- **Features**: 
    - View project status.
    - Direct link to provide feedback and flag critical issues.

### 6. Project Details (`/projects/[id]`)
- **Features**: 
    - **Health Score**: Large indicator showing the current project health.
    - **Check-ins (Employee)**: Form to submit confidence and progress.
    - **Feedback (Client)**: Form to rate satisfaction and flag issues.
    - **Activity**: Section for timeline tracking (future expansion).

---

## 💡 Tips for the Demo Video
1.  **Seed your data first**: Run `node scripts/seed.js` so you have a realistic set of projects to show.
2.  **Use different tabs**: Open Admin, Employee, and Client dashboards in different browser tabs/windows to switch between roles quickly.
3.  **Show the math**: Explicitly show how the health score changes when you submit a low confidence check-in or a flagged issue.
4.  **Clear Voice**: Speak clearly and pace yourself according to the timestamps.
