# Hiring Platform

A production-ready Full Stack web application where companies post jobs and developers apply. Features real-time notifications, role-based authentication

## 🚀 Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit + React Redux
- Socket.io Client
- Axios
- Framer Motion
- Lucide React
- date-fns
- clsx + tailwind-merge

### Backend
- NestJS 11
- TypeScript
- MongoDB + Mongoose
- Passport + passport-jwt (JWT & Refresh Token strategies)
- bcrypt
- Socket.io (WebSockets via @nestjs/websockets)

## ⚙️ Setup & Local Development

### 1. Clone the repository (or extract files)
If you haven't already, ensure you are in the root directory.

### 2. Configure Environment Variables
Both frontend and backend require a `.env` file.
Create a `.env` file in both folders and fill in the required values.

Backend `.env`:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=super_secret_key
JWT_REFRESH_SECRET=super_secret_refresh_key
FRONTEND_URL=http://localhost:3000
```

Frontend `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### 3. Install Dependencies
Open two terminals, one for frontend and one for backend.

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🌐 Deployment Instructions

### Backend -> Render (Free Tier)
1. Push the repository to GitHub.
2. Create a new "Web Service" on [Render.com](https://render.com).
3. Connect your GitHub repository.
4. Set the Root Directory to `backend`.
5. Set Build Command to `npm install && npm run build`.
6. Set Start Command to `npm run start:prod`.
7. Add the environment variables from your `.env` file.
8. **UptimeRobot Setup:** Since Render's free tier sleeps after 15 minutes of inactivity, we implemented a `/health` endpoint. Create a free account on [UptimeRobot](https://uptimerobot.com/) and set up an HTTP(s) monitor to ping `https://your-backend-url.onrender.com/health` every 5-10 minutes.

### Frontend -> Vercel
1. Create a new project on [Vercel](https://vercel.com).
2. Import your GitHub repository.
3. Set the Root Directory to `frontend`.
4. Framework Preset will automatically be detected as Next.js.
5. Add your Environment Variables (`NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` pointing to the deployed backend).
6. Click Deploy.

## 📚 API Endpoints

### Auth
- `POST /auth/register` - Register a new user (role: `Developer` or `Company`)
- `POST /auth/login` - Login and receive access + refresh JWT tokens
- `POST /auth/refresh` - Get a new access token using refresh token
- `POST /auth/logout` - Invalidate refresh token (JWT required)

### Users
- `GET /users/profile` - Get current user profile (JWT required)
- `PATCH /users/profile` - Update current user profile (JWT required)

### Jobs
- `GET /jobs` - List all jobs (public, supports `?title=...` filter)
- `GET /jobs/:id` - Get job details (public)
- `POST /jobs` - Create a new job (Company only)
- `PATCH /jobs/:id` - Update a job (Company only)
- `DELETE /jobs/:id` - Delete a job (Company only)
- `POST /jobs/:id/save` - Toggle save/unsave a job (JWT required)

### Applications
- `POST /applications` - Apply for a job (Developer only)
- `GET /applications/developer` - Get all applications submitted by the current developer
- `GET /applications/company` - Get all applications received by the current company
- `GET /applications/job/:jobId` - Get all applications for a specific job (Company only)
- `PATCH /applications/:id/status` - Update application status (Company only)

### Health Check
- `GET /health` - Returns `{ status: 'ok', timestamp }` — keep-alive endpoint for Render

## 🔌 WebSocket Events (Socket.io)

The server uses Socket.io for real-time notifications. Clients connect by passing `userId` as a query parameter:

```js
const socket = io(SOCKET_URL, { query: { userId } });
```

| Event | Direction | Description |
|-------|-----------|-------------|
| `new_application` | Server → Company | Fired when a developer applies for a company's job |
| `application_status_updated` | Server → Developer | Fired when a company updates the developer's application status |

## 🎨 UI Features
- Fully responsive "Cinematic Dark Mode" using Tailwind CSS.
- Glassmorphism UI components (`Card`, `Navbar`).
- Real-time `Toast` notifications for newly submitted applications and application status updates using Socket.io.
- Smooth page transitions and micro-animations via Framer Motion.

## 📁 Project Structure

```
hiring-platform/
├── backend/                    # NestJS API server
│   ├── src/
│   │   ├── auth/               # JWT auth, strategies, guards, decorators
│   │   ├── users/              # User schema, profile management
│   │   ├── jobs/               # Job CRUD, save/unsave
│   │   ├── applications/       # Apply, status updates
│   │   ├── notifications/      # Socket.io WebSocket gateway
│   │   ├── health/             # Keep-alive endpoint
│   │   └── main.ts
│   └── .env
└── frontend/                   # Next.js 16 client
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/         # Login & Register pages
    │   │   ├── (company)/      # Company dashboard, job & application management
    │   │   └── (developer)/    # Developer job browsing & application tracking
    │   ├── components/         # Shared UI components
    │   ├── store/              # Redux Toolkit slices & store
    │   └── lib/                # Axios instance, helpers
    └── .env
```

---

*Built by Karim Sliem — 2026*