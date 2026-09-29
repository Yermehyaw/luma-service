# LUMA

**Customer Service for the Digital Economy**


LUMA is an online customer service delivery and intelligence platform designed to satisfy the customer with ease and allow businesses to serve them better by connecting them with the neccessary services rendered by the company's internal operations. Made thoughfully for businessses seeking to exploit the creator economy and get a space in the ranks of excellent customer service delivery. It includes social media management for growth hacking, smart queues and bookings, fast online payments, at-home document verification, and business-referrals of customers for collaboration across teams. The core philosophy of LUMA is that customer service should not be a series of disconnected hurdles and disatisying steps.

In short, LUMA is your business superpower for seamless customer service in the digital-creator economy.

---

## Terminologies (Clarification of Key Terms)
To ensure seamless collaboration and understanding across the project, we adhere to the following definitions:

*   **LUMA:** The name of this platform/product.
*   **Businesses (or Tenants):** These are *our* direct clients (e.g., service-provision businesses, small businesses, comapanies, banks, hospitals, universities etc) who purchase LUMA either via the SaaS tier or Enterprise model.
*   **Customers (or End-Users):** These are the clients of the *Businesses* (e.g., the bank account holder, the student, the patient) who interact with the businesses' booking portals, digital tickets, and document verification flows via the custom LUMA customer service delivery pages.
*   **Staff/Social Media Manager:** Employee(s) of the *Businesses* who use the LUMA Ops Console, BranchConnect, or Social Studio to serve *Customers*.
*   **Management / Admin:** High-level executives of the *Businesses* who use the LUMA Intelligence Dashboard to monitor metrics across all their branches.
* **Branch/Service Delivery Centre:** The bussiness location owned.

By saving the customer's time and energy while returning insights and customer delightsome-ness, LUMA allows for 24-hour round-the-clock and personal/tailored service delivery.


## Service Delivery / Business Model Tiers
The product utilizes a SaaS B2B2C model structured to capture value across all market segments—from local SMEs to massive national institutions.

### 1. Basic Tier (Freemium - Ideal for SMEs & Local Shops)
**Target:** Local clinics, salons, bakeries, and small service providers.
*   **Custom Landing Page:** A free, branded customer-facing page on a LUMA subdomain (`business.luma.com`).
*   **Smart Queue & Booking (Lite):** Basic digital appointments and queue management.
*   **Payments Integration:** Access to ALATPay processing (LUMA takes a micro-transaction fee).
*   **Social Studio (Lite):** Centralized inbox with basic sentiment flagging and free daily content-idea generation credits (More credits can be purchased or upgrde to a higher tier)
*   **Intelligence Dashboard (Lite):** Basic daily traffic and revenue metrics.
*   *Note: BranchConnect and Document Verification are locked behind a paywall*

### 2. Pro Tier (Growth - Ideal for Multi-branch Businesses)
**Target:** Regional hospital networks, retail chains, and medium-sized agencies.
*   **Everything in Basic, plus:**
*   **Social Studio (Pro):** Extra content generation credits, AI-generated reply suggestions and automated intent categorization using lightweight HuggingFace models.
*   **Advanced Smart Queue:** Real-time WebSocket updates, wait-time forecasting, and accessibility priority lanes.
*   **BranchConnect:** Unlocks the internal collaboration feed for staff across different locations to share strategies.
*   **Intelligence Dashboard (Pro):** Cross-branch analytics, staff performance metrics, and NLP-extracted customer complaint trends.

### 3. Enterprise Tier (Full-Scale Institution)
**Target:** Commercial banks, federal universities, and government parastatals.
*   **Everything in Pro, plus:**
*   **Document Pre-Clearance (Full Module):** Allows customers to upload IDs/transcripts for AI OCR and staff verification prior to physical visits.
*   **White-labeling & API Access:** Custom domain integration and API access to embed LUMA into their existing native mobile apps.
*   **Dedicated Infrastructure:** Enhanced data privacy, local deployment options, and dedicated account management.

## User Roles & The Flow
* Businesses (Our Clients): The institutions purchasing the LUMA SaaS/Enterprise tier.

* Customers (End-Users): Clients of the businesses.
  * The Flow: Customer selects a service (e.g., Business Account Opening) → Books a timed slot → Uploads required docs for pre-verification (if any) → Pays fees digitally → Tracks live queue time → Arrives exactly when called → Leaves feedback.

* Staff: Operational branch employees and social media handlers.
  * The Flow: Staff monitor the live queue via WebSockets → Review/approve pre-uploaded docs → Generates content for brand visibilty and handles omnichannel complaints in Social Studio with AI-suggested replies while generating social media content to boost visibility → Share successful operational tactics on BranchConnect.

* Management / Admin: Executives overseeing the institution.
  * The Flow: Management logs into the Intelligence Dashboard → Views real-time branch traffic, average wait times, and trending customer complaints (extracted via NLP) → Makes data-driven operational changes.


---

## Project Philosophy

### The Problem
Experiences in many institutions and businesses––especially "legacy" institutions like schools, banks, hospitals and large cooperations—are heavily fragmented. Such fragmentation is seen in:
- *Customers* wasting hours in physical waiting rooms and ranting online, discovering missing document requirements only after reaching a teller, and repeating the same complaints over and over across disjointed social media channels.
- *Staff* are overwhelmed by manual processeses, unstructured social media outrage, and lack of visibility into daily loads.
- *Management/Branches* operate in silos. If Branch A solves a severe operational bottleneck, Branch B never learns about it, leading to duplicated efforts and wasted resources and if a branch cant handle the needs of the customer there is a broken and usually uncoordeinated customer referral system.

Due to this customers often find themselves waiting in physical queues, unable to book services or appointments, discover document problems only after reaching a service delivery centre, make payments through separate channels, and repeatedly ask the same questions on social media. Meanwhile, different branches independently solve the same operational problems without sharing knowledge. 

### The Solution: One Connected Customer Service Delivery Experience
Technically, LUMA is a B2B2C multi-tenant SaaS platform that merges the entire customer journey of a business into a single, seamless digital ecosystem. It eliminates physical waiting rooms and broken booking services through smart queuing/booking, pre-clears documents (if any), integrates payments, and uses localized AI (HuggingFace mini-models) to turn customer interactions into intelligent, cross-branch and inter-team collaboration (especially for operational improvements) allowing businesses and organisations to deliver tailored and personalized customer service in the creator/digital economy. By provising one seamless interconnected site accssible by customers, customers can get served quickly and easily as  possible as near as the browser to as far as their social media feed. 

It  unifies pre-arrival logistics (booking, docs, payments) with post-arrival execution and staff intelligence, LUMA transforms fragmented customer friction into actionable operational insights.


#### The 6 Core Modules
1. **Social Studio:** A social media management dashboard tied to an AI service for analytics, content idea generation, and helping social media managers quickly resolve customer complaints. Uses lightweight AI models for rapid sentiment analysis, monitors customer questions, and trends, translating conversations into actionable insights.
2. **Smart Queue/Bookings:** The anti-waiting room. Features timed digital tickets, live wait estimates, and QR check-ins, powered by real-time WebSockets. Also plans to support SMS/WhatsApp messages with priority to persons with accesssibilty needs.
3. **Document Verification:** A pre-clearance portal where customers can upload required documents (IDs, transcripts, etc.) from home allowing staff (or simulated AI OCR) to flag issues before the customer ever visits the branch. The system provides immediate visual status (Verified, Processing, Action Required, Rejected) using the AI/OCR for preliminary verification.   
4. **Payments:** Deeply integrated financial routing (via ALATPay) so customers pay service fees upfront, linking the transaction directly to their queue/booking ticket.
5. **Branch Connect:** An internal collaboration feed where branch staff and teams share successful strategies, challenges, playbooks, fraud alerts, customer trends, and solutions, ensuring no branch has to solve an operational problem from scratch nor repeat one another's mistakes.
6. **LUMA Intelligence Dashboard:** A management command center that aggregates data across all modules—showing active queues, service demands, wait times, customer satisfaction trends, document verification statuses, and cross-branch analytics.



---

## Project Architecture

LUMA is built on a scalable, modern Monorepo architecture designed for multi-tenancy, data privacy, and AI integration.

The repository is split into two primary ecosystems:

### 1. Frontend: Next.js (App Router)
Located in the `frontend/` directory, this is the client-facing application.
*   **Framework:** Next.js (React) using the modern App Router.
*   **Styling:** Tailwind CSS + shadcn/ui.
*   **Architecture:** Feature-Sliced Design. Business logic is isolated in `src/features/`, while `src/app/` solely handles routing.
*   **Multi-Tenancy:** Next.js Edge Middleware handles custom subdomain routing (e.g., routing `acme-bank.LUMA.com` to the correct internal tenant views) while maintaining a single, DRY codebase.

### 2. Backend: FastAPI + PostgreSQL
Located in the `backend/` directory, this serves as the powerful API and AI engine.
*   **Framework:** FastAPI (Python). Chosen for native AI integration, high performance (async), and automatic OpenAPI documentation.
*   **Database:** PostgreSQL (using SQLAlchemy/SQLModel). Enforces strict relational integrity and multi-tenancy (via Tenant IDs and Row-Level Security).
*   **Real-time:** Redis is used for WebSocket Pub/Sub to power live queue updates.
*   **AI Strategy:** HuggingFace `transformers` for local, lightweight Natural Language Processing (Sentiment Analysis, Intent Classification), ensuring data privacy for institutional clients.

---

## Directory Structure

```text
LUMA_2.0/
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
├── ai/                     # Dedicated AI Development & Models
│   ├── notebooks/          # Jupyter notebooks for testing models
│   ├── models/             # Downloaded HuggingFace model weights
│   └── scripts/            # NLP processing and fine-tuning scripts
│
└── frontend_old/           # Legacy React Prototype (For Reference)
```

Built by **Team LUMA** for the **Hackaholics (Wema Bank)** hackathon.
