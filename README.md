# Jeevan Gowda A V — Portfolio

> Personal portfolio website built with modern React, Vite, Tailwind/Lucide icons, and Vanilla CSS.  
> Powered by an Express REST API backend and Supabase (PostgreSQL) database.

## 🏗️ Project Structure

```
portfolio/
├── backend/                       ← Dedicated Express + Supabase backend
│   ├── server.js                  ← REST API endpoints (portfolio, contact, auth)
│   ├── supabase.js                ← Supabase client initialization & health check
│   ├── schema.sql                 ← PostgreSQL schema for Supabase
│   ├── defaultData.js             ← Seed data fallback
│   ├── package.json               ← Backend dependencies
│   ├── .env                       ← Supabase credentials & server config
│   └── README.md                  ← Supabase setup instructions
├── public/                        ← Static assets & documents
│   ├── manifest.json              ← PWA manifest
│   ├── robots.txt                 ← SEO crawling rules
│   ├── sitemap.xml                ← Search engine sitemap
│   └── assets/                    ← Images, icons, and documents
├── src/                           ← React Vite frontend
│   ├── admin/                     ← React Admin Console (/admin)
│   │   ├── AdminApp.jsx           ← Light-theme Admin dashboard & editor
│   │   └── admin.css              ← Luxury architectural admin styles
│   ├── components/                ← UI components (Hero, About, Projects, Contact...)
│   ├── api.js                     ← API client for Express + Supabase backend
│   ├── App.jsx                    ← Main React application & SPA routing
│   └── index.css                  ← Global styles & animations
├── package.json                   ← Frontend dependencies (React, Router, Framer Motion)
├── vite.config.js                 ← Vite configuration with /api proxy
└── README.md
```

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
# Set your SUPABASE_URL and SUPABASE_KEY in backend/.env
npm run dev
```
The backend server runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
npm install
npm run dev
```
The frontend dev server runs on `http://localhost:3000` and automatically proxies `/api` calls to the backend.

### 3. Database Setup (Supabase)
1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL script from `backend/schema.sql` in the Supabase SQL Editor.
3. Copy your Project URL and Anon/Service Role Key into `backend/.env`.

## 🔧 Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | React, Vite, Vanilla CSS  |
| 3D Effects | Three.js (ThreeFiber)     |
| Backend    | Node.js, Express.js       |
| Database   | Supabase (PostgreSQL)     |
| Auth       | JWT / Bearer Token        |

## 📄 License

© 2025 Jeevan Gowda A V. All rights reserved.
