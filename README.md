# Smart Leads Dashboard

A production-ready full-stack MERN application for managing sales leads with a modern SaaS-style UI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS v4 |
| State Management | Zustand + Persist |
| Form Handling | React Hook Form + Zod |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcrypt |
| Validation | Zod |
| HTTP Client | Axios |
| Containerization | Docker + Docker Compose |

## Features

- **Authentication** — JWT-based login/register with role-based access control
- **Role System** — Admin (full CRUD) and Sales User (own leads only)
- **Leads CRUD** — Create, view, edit, and delete sales leads
- **Advanced Filtering** — Filter by status, source, search by name/email
- **Server-side Pagination** — 10 records/page with full metadata
- **CSV Export** — Export filtered leads to CSV
- **Dashboard Analytics** — Lead stats by status and source with visual breakdown
- **Responsive UI** — Mobile-first design with sidebar, modals, toasts
- **Loading States** — Skeleton loaders for all async operations
- **Empty States** — Graceful empty UI for no-data scenarios

## Project Structure

```
management/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection & env
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, errors
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Express routers
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # AppError helper
│   │   ├── validators/      # Zod schemas
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Entry point
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Button, Input, Modal, Badge, etc.
│   │   │   ├── leads/       # LeadsTable, LeadForm, Pagination, Filters
│   │   │   └── dashboard/   # StatCard, StatusDistribution, SourceDistribution
│   │   ├── hooks/           # useDebounce
│   │   ├── layouts/         # DashboardLayout
│   │   ├── pages/           # LoginPage, RegisterPage, DashboardPage, LeadsPage
│   │   ├── routes/          # ProtectedRoute, PublicRoute
│   │   ├── services/        # api.ts, auth.service.ts, lead.service.ts
│   │   ├── store/           # authStore.ts, leadStore.ts (Zustand)
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # cn(), formatters
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)

### Option 1: Docker Compose (Recommended)

```bash
# Clone and enter directory
cd management

# Start all services
docker-compose up --build

# App is live at http://localhost
```

### Option 2: Local Development

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
# API running at http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-leads` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `NODE_ENV` | Environment | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### POST /auth/register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "sales"
}
```

#### POST /auth/login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /auth/me
```
Authorization: Bearer <token>
```

### Leads

All lead routes require `Authorization: Bearer <token>` header.

#### GET /leads
Query params: `page`, `limit`, `status`, `source`, `search`, `sort`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "totalRecords": 45,
    "totalPages": 5,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### POST /leads
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "status": "New",
  "source": "Website"
}
```

#### PUT /leads/:id — Update lead (admin or owner)
#### DELETE /leads/:id — Delete lead (admin only)
#### GET /leads/stats — Lead analytics
#### GET /leads/export — Download CSV (filtered)

### Lead Schema

| Field | Type | Values |
|-------|------|--------|
| `name` | string | — |
| `email` | string | — |
| `status` | enum | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | enum | `Website`, `Instagram`, `Referral` |

## Roles & Permissions

| Action | Admin | Sales User |
|--------|-------|------------|
| Create lead | ✅ | ✅ |
| View all leads | ✅ | Own only |
| Edit any lead | ✅ | Own only |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ✅ (own) |
| View stats | ✅ | ✅ (own) |

## Security

- Helmet for HTTP headers
- CORS configured per CLIENT_URL
- Rate limiting (200 req / 15 min)
- bcrypt password hashing (12 rounds)
- JWT in Authorization header
- Input validation via Zod on all endpoints
- Mongoose strict mode

## Demo Accounts

Create these via `/register` or seed them:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | password123 |
| Sales | sales@demo.com | password123 |

## Deployment

### Production Docker Compose
```bash
JWT_SECRET=your-production-secret docker-compose up -d
```

### Manual Production Build

**Backend:**
```bash
cd backend && npm run build && NODE_ENV=production node dist/server.js
```

**Frontend:**
```bash
cd frontend && npm run build
# Serve dist/ with nginx or any static host
```
