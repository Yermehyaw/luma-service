# Luma

**Customer Service for the Digital Economy**

Luma is an online customer delivery and intelligence platform designed to connect the customer journey with internal operations of a company. It utilizes social media, smart queues, online payments, document verification, and collaboration across teams. 

---

## Terminology (Clarification of Key Terms)
To ensure seamless collaboration and understanding across the project, we adhere to the following definitions:

*   **Luma:** The name of this platform/product.
*   **Businesses (or Tenants):** These are *our* direct clients (e.g., Banks, Hospitals, Universities) who purchase Luma either via the SaaS tier or Enterprise model.
*   **Customers (or End-Users):** These are the clients of the *Businesses* (e.g., the bank account holder, the student, the patient) who interact with Luma's booking portals, digital tickets, and document verification flows.
*   **Staff:** Employees of the *Businesses* who use the Luma Ops Console, BranchConnect, or Social Studio to serve *Customers*.
*   **Management / Admin:** High-level executives of the *Businesses* who use the Luma Intelligence Dashboard to monitor metrics across all their branches.

---

## Project Architecture

Luma is built on a scalable, modern Monorepo architecture designed for multi-tenancy, data privacy, and AI integration.

The repository is split into two primary ecosystems:

### 1. Frontend: Next.js (App Router)
Located in the `frontend/` directory, this is the client-facing application.
*   **Framework:** Next.js (React) using the modern App Router.
*   **Styling:** Tailwind CSS + shadcn/ui.
*   **Architecture:** Feature-Sliced Design. Business logic is isolated in `src/features/`, while `src/app/` solely handles routing.
*   **Multi-Tenancy:** Next.js Edge Middleware handles custom subdomain routing (e.g., routing `acme-bank.luma.com` to the correct internal tenant views) while maintaining a single, DRY codebase.

### 2. Backend: FastAPI + PostgreSQL
Located in the `backend/` directory, this serves as the powerful API and AI engine.
*   **Framework:** FastAPI (Python). Chosen for native AI integration, high performance (async), and automatic OpenAPI documentation.
*   **Database:** PostgreSQL (using SQLAlchemy/SQLModel). Enforces strict relational integrity and multi-tenancy (via Tenant IDs and Row-Level Security).
*   **Real-time:** Redis is used for WebSocket Pub/Sub to power live queue updates.
*   **AI Strategy:** HuggingFace `transformers` for local, lightweight Natural Language Processing (Sentiment Analysis, Intent Classification), ensuring data privacy for institutional clients.

---

## Directory Structure

```text
luma_2.0/
├── frontend/               # Next.js Application
│   ├── src/app/            # App Router (Routing & Middleware)
│   ├── src/features/       # Domain Logic (Queue, Social Studio, Docs)
│   └── src/components/     # Shared UI Components
│
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── main.py         # Application Entrypoint
│   │   ├── routers/        # API Endpoints
│   │   ├── models/         # Database Models & Pydantic Schemas
│   │   └── core/           # Security, Config, AI pipelines
│   └── requirements.txt
│
└── frontend_old/           # Legacy React Prototype (For Reference)
```
