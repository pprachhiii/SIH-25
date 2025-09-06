Overview

The AI Services module is responsible for handling all artificial intelligence and machine learning tasks for the system.
It acts as a standalone microservice that other backend services (Django API, Node blockchain, notifications, etc.) can call via REST or gRPC.

Currently, the AI layer is powered by Gemini GenAI for text generation, classification, and reasoning.

Responsibilities

Process AI-driven requests from the Django API or Node services.

Connect to Gemini GenAI API for:

Natural language understanding.

Content summarization, classification, and personalization.

Decision-making assistance (depending on your use case).

Expose AI functionality via REST API endpoints.

Maintain a queue-based pipeline for async AI tasks (optional).

Store AI logs (queries/responses) for debugging and audit.

Provide a layer of abstraction so frontend/backend developers don’t directly call Gemini, keeping flexibility to switch providers later.

Tech Stack

FastAPI (Python) – lightweight, async, good for microservices.

Gemini GenAI API – primary AI model provider.

PostgreSQL (optional) – store AI logs/history.

Redis (optional) – cache AI responses for performance.

API Endpoints (Planned)
Method	Endpoint	Description
POST	/ai/generate	Generate response from Gemini
POST	/ai/classify	Classify input data
POST	/ai/summarize	Summarize long text
POST	/ai/decision	Run AI-assisted decision workflow
GET	/ai/logs/:id	Fetch AI query/response logs
Workflow

A user interacts with frontend (web/mobile).

Frontend sends request → Django API or Node Service.

API forwards request to AI Services.

AI Services queries Gemini API.

Response is standardized, logged, and returned.



ai_services/
│── README.md
│── app/
│   ├── main.py              # FastAPI entrypoint
│   ├── routers/             # Endpoints
│   │   ├── generate.py
│   │   ├── classify.py
│   │   └── summarize.py
│   ├── services/            # AI logic & Gemini integration
│   │   ├── gemini_client.py
│   │   ├── cache_manager.py
│   │   └── logger.py
│   ├── models/              # Pydantic schemas
│   └── db/                  # Optional DB for logs
│
└── tests/                   # Unit tests for AI endpoints
