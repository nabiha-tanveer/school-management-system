# ClassBridge

A full-featured School Management System built with Next.js, TypeScript, and PostgreSQL. Supports three roles — Admin, Teacher, and Student — each with a dedicated dashboard and permissions.

## Features

- **Authentication** — JWT-based login/register with role-based access control (Admin, Teacher, Student)
- **Class Management** — Create classes, assign teachers, enroll students
- **Attendance** — Teachers mark daily attendance; students view their own record
- **Results/Grades** — Teachers record marks per subject; students track their performance
- **Fees Management** — Admin creates fee records; students view payment status
- **Timetable** — Class-wise schedules visible to admins, teachers, and students
- **Announcements** — School-wide notice board
- **Leave Applications** — Teachers/students apply for leave; admin approves or rejects
- **Dashboard Analytics** — Real-time stats: total students/teachers, attendance %, fees collected/pending

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, lucide-react
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (hosted on Neon)
- **Auth:** JWT (jose for Edge middleware, jsonwebtoken for API routes), bcryptjs for password hashing

## Getting Started

1. Clone the repo:
```bash
   git clone https://github.com/nabiha-tanveer/school-management-system.git
   cd school-management-system
```

2. Install dependencies:
```bash
   npm install
```

3. Set up environment variables — create a `.env` file:

DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secret-key"


4. Push the Prisma schema to your database:
```bash
   npx prisma db push
```

5. Run the development server:
```bash
   npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

8 relational models: `User` (with role-based enum), `Class`, `Attendance`, `Result`, `Fees`, `Timetable`, `Announcement`, `Leave`.

## Roles

| Role    | Access                                                        |
|---------|-----------------------------------------------------------------|
| Admin   | Manage classes, students, fees, timetable, announcements, leave approvals |
| Teacher | Mark attendance, record results, apply for leave                |
| Student | View own attendance, results, fees, timetable, announcements; apply for leave |

## License

This project was built as part of a learning roadmap and is open for educational use.
