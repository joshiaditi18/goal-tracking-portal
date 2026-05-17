```mermaid
flowchart LR
  subgraph Frontend
    A[React + Vite + Tailwind] -->|API calls| B(Backend API)
  end

  subgraph Backend
    B --> C[Express + Controllers]
    C --> D[Mongoose Models]
  end

  subgraph Database
    D --> E[(MongoDB Atlas / MongoDB)]
  end

  Authentication -. JWT Cookie/Authorization Header .-> B

  subgraph Deployment
    F[Vercel / Render] --> A
    G[Node host (Render) / Docker] --> B
    H[MongoDB Atlas] --> E
  end

  style A fill:#f9fafb,stroke:#111827
  style B fill:#ffffff,stroke:#111827
  style E fill:#fef3c7,stroke:#92400e
```

Architecture overview:
- Frontend: React + Vite application serving UI, routes, and API calls via `axios`.
- Backend: Node.js + Express REST API with modular routes, controllers, services, and Mongoose models.
- Database: MongoDB (Atlas or self-hosted) storing users, departments, cycles, goals, shared goals, and check-ins.
- Auth: JWT-based tokens returned at login; backend `protect` middleware verifies tokens and `authorizeRoles` enforces RBAC.
- Deployment: Frontend deploys to static hosts (Vercel), backend to Node hosts (Render) with MongoDB Atlas as DB.
