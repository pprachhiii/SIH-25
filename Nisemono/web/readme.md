Overview

The Web Application is the browser-based frontend, built with Next.js + TailwindCSS, providing both user and admin interfaces.

It communicates with the Django API, Node microservices, and AI Service through REST/GraphQL APIs.

Responsibilities
User Interface

User registration & authentication.

Dashboards for interacting with AI, blockchain, and notifications.

Real-time updates (via WebSockets/long-polling).

Admin Interface

Access at /admin.

Provides a secure CRUD interface for managing all databases (Users, Transactions, Notifications, AI logs).

Role-based authentication (only admin accounts can access).

Integrated with Django API for DB operations.

Tech Stack

Next.js (React SSR/SSG)

TailwindCSS (UI styling)

React Query / Axios (data fetching)

TypeScript (recommended)

Jest + React Testing Library (tests)

Vercel / Docker (deployment)

Folder Structure
web/
│── README.md
│── package.json
│── next.config.js
│── public/                       # Static assets
│
│── src/
│   ├── pages/
│   │   ├── index.tsx              # Landing page
│   │   ├── dashboard.tsx          # User dashboard
│   │   ├── admin/                 # Admin panel routes
│   │   │   ├── index.tsx          # Admin dashboard
│   │   │   ├── users.tsx          # CRUD for users
│   │   │   ├── transactions.tsx   # CRUD for blockchain txns
│   │   │   ├── notifications.tsx  # Manage notifications
│   │   │   └── ai-logs.tsx        # View AI service logs
│   │   └── api/                   # API proxy routes (optional)
│   │
│   ├── components/                # Shared UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── CRUDTable.tsx
│   │
│   ├── layouts/
│   │   ├── UserLayout.tsx
│   │   └── AdminLayout.tsx
│   │
│   ├── hooks/                     # Custom React hooks
│   │   └── useAuth.ts
│   │
│   ├── lib/                       # API clients, helpers
│   │   ├── apiClient.ts
│   │   └── config.ts
│   │
│   ├── styles/                    # Global CSS
│   │   └── globals.css
│   │
│   └── store/                     # State management
│       └── userStore.ts
│
└── tests/        


User-facing web app → / , /dashboard, etc.

Admin panel → /admin, with its own layout & access control.