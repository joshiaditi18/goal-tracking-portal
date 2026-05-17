# In-House Goal Setting & Tracking Portal

Quick project guide, run commands, seed instructions, and demo credentials.

Prerequisites:
- Node.js 18+
- npm
- MongoDB Atlas or local MongoDB

Backend (server)

1. Copy backend environment template and set values:

```bash
cd backend
cp .env.example .env
# edit .env to set MONGO_URI and JWT_SECRET
```

2. Install and seed:

```bash
cd backend
npm install
npm run seed    # seeds demo data (creates admin/manager/employee users)
npm run dev
```

Frontend (client)

1. Copy frontend env example:

```bash
cd frontend
cp .env.example .env
```

2. Install and run dev server:

```bash
npm install
npm run dev
```

Demo credentials (seeded):

- Admin: admin@company.com / Admin@1234
- Manager 1: manager1@company.com / Manager1@1234
- Manager 2: manager2@company.com / Manager2@1234
- Employee: alice@company.com / Employee1@1234 (other employees as listed in seed output)

Files added/changed as part of finalization:
- `backend/seed.js` (full demo seed)
- `frontend/src/pages/admin/CycleManagement.jsx` (UI fixes)
- `frontend/src/api/admin.js` (exported `deleteUser`)
- `frontend/.env.example` (API URL template)

See `ARCHITECTURE.md` and `DEPLOYMENT.md` for architecture and deployment steps.
