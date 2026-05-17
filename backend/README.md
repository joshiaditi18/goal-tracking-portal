# In-House Goal Setting & Tracking Portal - Backend

## Setup

1. Copy `.env.example` to `.env`
2. Fill in `MONGO_URI`, `JWT_SECRET`, and optional `PORT`
3. Install dependencies

```bash
cd backend
npm install
```

4. Seed sample users

```bash
npm run seed
```

5. Start server

```bash
npm run dev
```

## API Endpoints

- `POST /api/auth/login` - login and receive JWT
- `POST /api/auth/logout` - logout and clear token cookie
- `GET /api/auth/profile` - get current user profile
- `POST /api/admin/users` - admin-only user creation
- `GET /api/admin/users` - admin-only user list
- `GET /api/admin/users/:id` - admin-only read user
- `PUT /api/admin/users/:id` - admin-only update user
- `DELETE /api/admin/users/:id` - admin-only remove user

## Demo credentials

- Admin: `admin@company.com` / `Admin@1234`
- Manager: `manager@company.com` / `Manager@1234`
- Employee: `employee@company.com` / `Employee@1234`
