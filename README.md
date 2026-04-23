# 📚 Smart Study Planner with Deadlines

A full-stack study productivity platform designed to help students stay organized, reduce missed deadlines, and build consistent academic habits.

## 🎓 Academic Details

- Section: 24AML-2 (A)

## 👥 Team Members

- Nishant Kumar (UID: 24BAI70089)
- Jyotiranjan Moharana (UID: 24BAI70027)

## 🌐 Live Links

- Frontend: https://smart-study-planner-with-deadline-t.vercel.app
- Backend: https://smart-study-planner-with-deadline-tracker.onrender.com
- GitHub: https://github.com/nishant-kumar9/Smart-Study-Planner-with-Deadline-Tracker

## 📖 Project Overview

Smart Study Planner with Deadlines combines daily planning, deadline tracking, and progress analysis into one focused application. Instead of using separate tools for tasks, calendar, and performance, students can manage everything in a single workflow.

## ❗ Problem It Solves

Students often miss deadlines because planning is spread across notebooks, reminders, and multiple apps. This project solves that by unifying task planning, calendar visibility, and performance tracking in one system.

## 🧩 How The System Works

1. Users register/login securely using JWT-based authentication.
2. The frontend sends API requests to the backend for task and user operations.
3. The backend validates requests, applies business logic, and stores data in MongoDB.
4. Dashboard, calendar, progress, and profile pages display real-time task insights.

## 🖥️ Main Modules

- Dashboard: Productivity summary, quick actions, upcoming deadlines, and weekly insights.
- Tasks: Full task lifecycle management with priority, filters, and recurring task support.
- Calendar: Date-wise task visualization for better deadline planning.
- Progress: Completion trends, charts, and subject-wise performance view.
- Profile: Streak metrics and activity heatmap for consistency tracking.

## 🧠 Tech Stack

### Frontend
- React (Vite)
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose)

### Authentication
- JWT
- bcrypt

### Deployment
- Vercel (Frontend)
- Render (Backend)

## 🚀 Core Features

- Create, update, and delete tasks
- Mark tasks as completed and track pending work
- Set task priority (High, Medium, Low)
- Visualize tasks in calendar view
- Use dashboard insights for daily planning
- Track progress through charts and statistics
- Monitor profile streaks and activity heatmap
- Search and filter tasks quickly
- Manage recurring tasks
- Switch between dark and light themes

## 📂 Project Structure

- /client -> Frontend application built with React + Vite
- /backend -> REST API server built with Node.js + Express

## ⚙️ Local Setup

1. Clone the repository
```bash
git clone https://github.com/nishant-kumar9/Smart-Study-Planner-with-Deadline-Tracker.git
cd Smart-Study-Planner-with-Deadline-Tracker
```

2. Setup backend
```bash
cd backend
npm install
```

3. Create backend .env file
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Run backend server
```bash
npm run dev
```

5. Setup and run frontend (new terminal)
```bash
cd client
npm install
npm run dev
```

## 🎯 Goal

To provide a clean, practical, and reliable planning system that helps students stay ahead of deadlines and improve study consistency.