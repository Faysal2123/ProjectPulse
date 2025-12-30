# Project Pulse

Project Pulse is a comprehensive project health monitoring system designed for IT and software development companies. It enables real-time tracking of project status, risks, and client satisfaction through a data-driven "Health Score."

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Health Score Logic](#health-score-logic)
- [Getting Started](#getting-started)
- [API Summary](#api-summary)
- [Demo Guide](#demo-guide)

---

## Overview
The platform facilitates communication between three primary stakeholders:
- **Admins**: Oversee all projects, monitor health scores, and manage project creation.
- **Employees**: Provide weekly progress updates (check-ins) and self-reported confidence levels.
- **Clients**: Rate satisfaction and flag critical issues or risks directly.

## Key Features
- **Role-Based Access Control**: Secure logins for Admins, Employees, and Clients.
- **Automated Health Scoring**: Dynamic calculation of project viability.
- **Interactive Dashboards**: Tailored views for each user role.
- **Early Warning System**: Color-coded indicators (Green/Yellow/Red) to highlight at-risk projects.
- **Feedback Loop**: Integrated client feedback and employee reporting.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: JWT (JSON Web Tokens) with HttpOnly cookies.
- **Backend**: Next.js API Routes.

---

## Health Score Logic
The project "Pulse" (0-100) is calculated based on several weighted factors:

1.  **Client Satisfaction (40%)**: Derived from client ratings.
2.  **Employee Confidence (30%)**: Based on team sentiment and reporting.
3.  **Critical Issues**: Immediate **-20 point** penalty if a client flags a major issue.
4.  **Risks**: Deductions for open risks (High Severity: -10, Medium: -5).
5.  **Timeline**: **-15 point** penalty if the project surpasses its deadline.

*Color Coding:*
- 🟢 **Healthy (80-100)**: Project is on track.
- 🟡 **Warning (60-79)**: Minor issues or risks identified.
- 🔴 **Critical (< 60)**: Urgent attention required.

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Database Seeding
Initialize the database with demo users and projects:
```bash
node scripts/seed.js
```
*Default Credentials:*
- **Admin**: `admin@example.com` / `password`
- **Employee**: `employee1@example.com` / `password`
- **Client**: `client@example.com` / `password`

### 5. Running the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## API Summary
- `POST /api/auth/login`: User authentication.
- `GET /api/projects`: Retrieve projects (filtered by role).
- `POST /api/projects/[id]/checkin`: Submit employee updates.
- `POST /api/projects/[id]/feedback`: Submit client feedback.

---

## Demo Guide
To demonstrate the full capability of Project Pulse:
1. **Admin View**: Show the dashboard with the health score grid and create a new project.
2. **Employee Flow**: Log in as an employee, select a project, and submit a "Weekly Check-in" with a low confidence level to see the health score drop.
3. **Client Flow**: Log in as a client and "Flag an Issue" to witness an immediate status change to "Critical".
