# JG Portfolio — Architectural Backend & Supabase Database

This backend service powers Jeevan Gowda's portfolio website and architectural admin dashboard, replacing Firebase with an Express REST API connected to **Supabase** (PostgreSQL).

---

## 🛠️ Architecture Overview

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL with JSONB & Row-Level Security)
- **Authentication**: JWT / Admin Secret Key
- **Endpoints**:
  - `GET /api/health` — Diagnostics & database connection status
  - `GET /api/portfolio` — Public portfolio data catalog
  - `PUT /api/portfolio` — Admin upsert & live synchronization
  - `POST /api/contact` — Inbound public contact transmission
  - `GET /api/messages` — Admin inbound inquiries list
  - `PATCH /api/messages/:id/status` — Mark inquiry read/unread
  - `DELETE /api/messages/:id` — Delete inquiry from database
  - `POST /api/admin/login` — Authenticate admin console

---

## 🚀 Step 1: Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a free project (or log in to your existing project).
2. Once the project is created, navigate to **SQL Editor** in the left sidebar.
3. Open [`backend/schema.sql`](./schema.sql), copy its entire contents, paste it into the Supabase SQL Editor, and click **Run**.
   - This creates the `portfolio` and `contacts` tables with indices and security policies.

---

## 🔑 Step 2: Configure Environment Variables

1. In Supabase, go to **Project Settings** (gear icon) -> **API**.
2. Copy your **Project URL** and **service_role secret key** (or **anon public key**).
3. Open [`backend/.env`](./.env) and populate the values:

```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-key-here

ADMIN_EMAIL=jeevangowdajeevan080@gmail.com
ADMIN_PASSWORD=admin123
JWT_SECRET=super_secret_architectural_jwt_key_change_in_production
FRONTEND_URL=http://localhost:3000
```

---

## ▶️ Step 3: Run Backend

Inside the `backend/` directory:

```bash
# Install dependencies
npm install

# Run with auto-reload (development)
npm run dev

# Or run in production
npm start
```

When started locally, your API will be live at:
`http://localhost:5000/api`

---

## ☁️ Step 4: Deploying to Render

You can deploy this backend to [Render.com](https://render.com) for free:

### 1. Create a New Web Service on Render
1. Connect your GitHub repository to Render.
2. Click **New +** → **Web Service**.
3. Choose your repository.

### 2. Configure Service Settings
- **Name**: `jeevan-portfolio-backend` (or any preferred name)
- **Region**: Singapore / Oregon / Frankfurt
- **Branch**: `main`
- **Root Directory**: `backend` *(Crucial: set to `backend` so Render runs inside this folder)*
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### 3. Add Environment Variables on Render
Under the **Environment Variables** tab, add:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | `https://your-project.supabase.co` |
| `SUPABASE_KEY` | *your Supabase key* |
| `ADMIN_EMAIL` | `jeevangowdajeevan080@gmail.com` |
| `ADMIN_PASSWORD` | *a strong password of your choice* |
| `JWT_SECRET` | *a long random string* |

### 4. Connect Frontend to Render
Once deployed, copy your Render service URL (e.g. `https://jeevan-portfolio-backend.onrender.com`).
In your frontend `.env` file (or frontend deployment platform environment variables):

```env
VITE_API_URL=https://jeevan-portfolio-backend.onrender.com
```

Rebuild/redeploy the frontend. Your frontend and admin console will now communicate directly with the live Render cloud backend!


---

## ⏰ Step 5: Keep the Free Backend Awake 24/7

Render's free plan sleeps after 15 minutes without traffic, and free Supabase projects pause after
about a week without database activity. `GET /api/health` runs a tiny database query, so pinging it
every 5 minutes keeps **both** awake. One always-on free service uses ~744 of Render's 750 free hours/month.

1. Sign up free at [UptimeRobot](https://uptimerobot.com) (or [cron-job.org](https://cron-job.org)).
2. **Add New Monitor** → type **HTTP(s)**.
3. URL: `https://<your-service>.onrender.com/api/health`
4. Interval: **5 minutes** → **Create Monitor**.

UptimeRobot also emails you if the backend ever goes down.
