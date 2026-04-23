# Client README - Smart Study Planner

Frontend application for the Smart Study Planner with Deadlines project.

## Overview

This client is built with React + Vite and provides the full user experience for:
- Authentication (Login/Register)
- Task lifecycle management
- Calendar-based planning
- Progress analytics
- Profile insights
- Dark/Light theme switching

It communicates with the backend API via Axios using JWT-based authorization.

## Tech Stack

- React 19
- Vite
- React Router
- Axios
- React Icons
- CSS (component/page scoped styles + CSS variables)

## Frontend Features

### 1. Authentication Pages
- Login page with password visibility toggle
- Register page with client-side email/password validation
- Password strength indicator in registration flow
- Token and user profile data stored after successful login

### 2. Dashboard
- Stats cards for total/completed/pending/completion rate
- Quick actions (add task, jump to today)
- Upcoming deadlines with urgent highlighting (within 48 hours)
- Today task panel with edit/delete/mark-complete operations
- Weekly productivity mini insights chart
- Create/edit task modal with optimistic UI updates

### 3. Tasks Module
- Create task with recurrence options:
	- none
	- daily
	- weekly
	- custom interval
- Full task CRUD operations
- Toggle task status pending/completed
- Advanced filters:
	- search query
	- subject
	- priority
	- status
	- date range
- Quick views (e.g., high-priority week, due today, pending only)
- Saved views persisted in localStorage

### 4. Calendar Module
- Monthly calendar grid navigation (prev/next/today)
- Date selection with task summary indicators
- Day-wise task panel
- Add tasks directly for selected date
- Toggle completion from calendar panel

### 5. Progress Module
- Completion KPIs (completed, rate, total)
- Last 7-day completion analytics
- Bar and line trend charts
- Subject performance breakdown with completion meter

### 6. Profile Module
- User profile summary from local storage
- Current streak and longest streak metrics
- Daily completion heatmap

### 7. Theme System
- Centralized theme context
- Dark/Light mode persisted in localStorage
- Theme applied globally to html/body with class + dataset sync
- CSS variable-driven token system for consistent styling

## API Integration

### Base URL config
Configured in `src/config/api.js`:
- Uses `VITE_API_BASE_URL` if provided
- Falls back to deployed backend URL

### Auth token flow
- JWT token is saved in localStorage on login
- Every protected task request sends `Authorization: Bearer <token>`
- Missing token throws client-side error and requires re-login

### Service layer
Task API requests are centralized in `src/services/taskService.js`:
- `fetchTasksApi()`
- `createTaskApi(payload)`
- `updateTaskApi(taskId, payload)`
- `deleteTaskApi(taskId)`

## Project Structure

```text
client/
	src/
		components/      # Reusable UI blocks (cards, charts, layout, filters)
		pages/           # Route-level pages (Dashboard, Tasks, Calendar, etc.)
		services/        # API service layer
		utils/           # Recurrence + analytics helpers
		context/         # Theme context
		config/          # API base config
```

## Environment Variable

Create a `.env` file in `client/` if needed:

```env
VITE_API_BASE_URL=http://localhost:5000
```

If not provided, the app uses the production backend URL by default.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- This client expects backend routes under `/api/auth` and `/api/tasks`.
- Most task interactions use optimistic updates for a smoother UI.
