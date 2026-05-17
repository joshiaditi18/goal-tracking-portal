# Hackathon Demo Checklist

## What to demo (priority order)
- Login as Admin and open Admin Dashboard.
- Navigate to Cycle Management and show active cycle.
- Create a new cycle and activate it.
- Login as Manager and show Team Review and Shared Goals handling.
- Login as Employee and create/submit goal sheets.
- Show quarterly check-ins and progress charts.

## Sequence
1. Start backend and frontend locally (see commands below).
2. Seed database (one-time): run `cd backend && npm run seed`.
3. Admin flow: login -> cycles -> user management.
4. Manager flow: login -> shared goals -> team review -> approve goals.
5. Employee flow: login -> draft goals -> submit -> check status.

## Test cases
- Login with seeded credentials.
- Create cycle with valid dates; validate order.
- Create shared goal and assign employees; verify weightage sum.
- Submit goal sheet and approve as manager; verify status propagation.

## Fallback if internet fails
- Use local MongoDB and set MONGO_URI to mongodb://localhost:27017/inhouse-goals.
- Run backend and frontend locally; demo UI flows with seeded local data.

## Commands
```
cd backend && npm install
cd frontend && npm install
cd backend && npm run seed
cd backend && npm run dev
cd frontend && npm run dev
```
