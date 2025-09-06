Responsibilities

Provide common database models/schemas (where applicable).
Store utility functions (e.g., formatters, validators, crypto functions).
Centralize API contracts (OpenAPI/Swagger specs, GraphQL schemas, or TypeScript types).
Manage environment configs shared across services.
Provide logging & error handling wrappers for consistent observability.
Contain constants and enums used globally.
Store shared UI assets (icons, themes) for web/mobile if needed.



shared/
│── README.md               # Documentation for shared usage
│── configs/                # Common environment/config files
│   ├── db.config.js        # Database connection helpers (for Node.js)
│   ├── django_settings.py  # Shared Django configs (imported via settings.py)
│   └── env.example         # Environment variable template
│
│── utils/                  # Reusable functions/utilities
│   ├── validators.js
│   ├── formatters.js
│   └── crypto_utils.js
│
│── schemas/                # Shared API schemas / DTOs
│   ├── notification.schema.json
│   ├── user.schema.json
│   └── transaction.schema.json
│
│── middleware/             # Shared Express/Django middleware
│   ├── errorHandler.js
│   └── logger.js
│
│── constants/              # Project-wide constants/enums
│   ├── errorCodes.js
│   └── roles.js
│
└── docs/                   # API contracts, Swagger, GraphQL SDLs
    ├── openapi.yaml
    └── graphql.schema.graphql
