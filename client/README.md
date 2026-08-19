# CareerNest — Job Portal System

A full-stack capstone project using React, Node.js, Express and MySQL.

## Features

### Admin
- Login
- Dashboard statistics
- View users
- Review pending jobs
- Approve/reject jobs

### Recruiter
- Register/login
- Create company
- Post jobs
- View/manage jobs
- View applicants
- Shortlist/select/reject candidates

### Job Seeker
- Register/login
- Browse approved jobs
- Search jobs
- View job details
- Apply for jobs
- Track applications
- Profile page

## Tech Stack

Frontend: React + Vite + Axios + React Router  
Backend: Node.js + Express + JWT + bcrypt  
Database: MySQL

## Setup

### 1. Database

Open MySQL Workbench and run:

`database/job_portal_db.sql`

### 2. Server

```bash
cd server
npm install
```

Create `.env` from `.env.example` and set your MySQL password.

```bash
npm run dev
```

Server: http://localhost:5000

### 3. Client

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend: http://localhost:5173

## Demo Accounts

Password: `123456`

- Admin: admin@test.com
- Recruiter: recruiter@test.com
- Job Seeker: jobseeker@test.com

## Important

If you already have an older `job_portal_db`, back it up before running the SQL file because the SQL file recreates the database.