# Project Pulse

A comprehensive project health monitoring system for IT/Software companies.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: Next.js API Routes (Serverless Functions)
- **Database**: MongoDB (Access via URI)
- **Auth**: JWT (HttpOnly Cookie)

## Features
- **Role-Based Access**: Admin, Employee, Client.
- **Health Score Logic**: Automatically calculated (0-100) based on:
    - Client Satisfaction (40%)
    - Employee Confidence (30%)
    - Timeline Status (20%)
    - Risks & Issues (10% + penalties)
- **Dashboards**: Dedicated views for each role.
- **Weekly Check-ins**: Employees report progress.
- **Feedback Loop**: Clients rate satisfaction.

## Health Score Logic Explained
1.  **Base Score starts at 100.**
2.  **Client Satisfaction**: Deducts points if average rating < 5.
3.  **Employee Confidence**: Deducts points if average confidence < 5.
4.  **Critical Issues**: -20 points immediately if a client flags an issue.
5.  **Risks**: Deducts points for open risks based on severity (High: -10, Medium: -5).
6.  **Timeline**: -15 points if the project is overdue.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create `.env` with:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=supersecretkey
    ```

3.  **Seed Database**:
    Run the seed script to create initial users and a project:
    ```bash
    node scripts/seed.js
    ```
    *Default Users:*
    - Admin: `admin@example.com` / `password`
    - Employee: `employee1@example.com` / `password`
    - Client: `client@example.com` / `password`

4.  **Run Dev Server**:
    ```bash
    npm run dev
    ```

## API Extensions
- `POST /api/auth/login`
- `GET /api/projects` (Role-filtered)
- `POST /api/projects/[id]/checkin`
- `POST /api/projects/[id]/feedback`
