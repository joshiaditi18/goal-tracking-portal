# Deployment Guide

## Environment templates

Backend (`backend/.env.example`):

```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/inhouse-goals?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=8h
```

Frontend (`frontend/.env.example`):

```
VITE_API_URL=https://your-backend-url.com/api
```

## Deploy Frontend to Vercel

1. Connect Git repository to Vercel.
2. Set environment variable `VITE_API_URL` in project settings.
3. Build command: `npm run build`. Output directory: `dist`.

## Deploy Backend to Render

1. Create a Web Service on Render using the `backend` folder.
2. Set environment variables from `backend/.env.example` in Render's dashboard.
3. Start command: `npm run start` (or `npm run dev` for staging with `NODE_ENV=development`).

## MongoDB Atlas

1. Create a free cluster on MongoDB Atlas.
2. Create database user and whitelist your app IPs or use 0.0.0.0/0 for demo.
3. Use the connection string as `MONGO_URI` in backend `.env`.

## Notes
- Ensure CORS and secure cookies are configured correctly for production domains.
- When deploying API behind TLS, set `secure=true` for cookie and `NODE_ENV=production`.
