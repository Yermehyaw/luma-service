# LUNA — Customer Service for the Digital Economy

LUNA is an online customer service delivery and intelligence platform designed to satisfy customers with ease and allow businesses to serve them better by connecting them with the necessary services rendered by the company's internal operations.

---

## Next.js Multi-Tenant Frontend Architecture

The frontend is built as **One Next.js App Router application** capable of serving:
1. **Luma Marketing Website** (`app/(marketing)`)
2. **Luma SaaS Platform App** (`app/(platform)`)
3. **Tenant Customer Portals** (`app/[tenantId]/(customer)`)
4. **Tenant Staff Operations Consoles** (`app/[tenantId]/(staff)`)

### 6 Core Modules
1. **Social Studio:** Social media management dashboard tied to AI sentiment analysis and smart replies.
2. **Smart Queue/Bookings:** Timed digital tickets, live wait estimates, and queue tracking.
3. **Document Verification:** Pre-clearance portal where customers upload required documents for AI OCR verification.
4. **Payments:** Deeply integrated financial routing linking transactions to queue bookings.
5. **Branch Connect:** Internal collaboration feed for staff across locations to share strategies.
6. **LUNA Intelligence Dashboard:** Executive management center aggregating data across all modules.

---

## Directory Structure

```text
src/
├── app/
│   ├── (marketing)/                # Luma Marketing Website (Home, Company, Institutions, Features, Pricing)
│   ├── (platform)/                 # Luma SaaS Admin Console (Dashboard, Organizations, Billing, Login)
│   └── tenant/[tenantId]/          # Dynamic Multi-Tenant Application Routes
│       ├── (customer)/             # Customer Portal (Book Queue, Track Ticket, Document Verification)
│       └── staff/                  # Staff Operations Portal (Ops Console, Social Studio, Customers, Branches, Services, Analytics, Settings)
├── features/                       # Modular Feature Architecture (Queue, Ticketing, Social, Verification, Analytics)
├── components/                     # Layouts, Navigation, Shared Brand UI
├── lib/                            # API Client, Tenant Engine, Feature Flags, Permissions, Auth
├── mock/                           # Decoupled Mock Repositories Data
└── middleware.ts                   # Subdomain host resolution & route rewriter
```

---

## Local Development & Live Demo

Start the development server:
```bash
npm run dev
```

Visit in browser:
- Marketing Site: [http://localhost:3000](http://localhost:3000)
- Platform SaaS App: [http://localhost:3000/platform/dashboard](http://localhost:3000/platform/dashboard)
- Tenant Customer App (Acme Bank): [http://localhost:3000/tenant/acme-bank](http://localhost:3000/tenant/acme-bank)
- Tenant Staff Console (Acme Bank): [http://localhost:3000/tenant/acme-bank/staff/ops-console](http://localhost:3000/tenant/acme-bank/staff/ops-console)
- Tenant Customer App (City Hospital): [http://localhost:3000/tenant/city-hospital](http://localhost:3000/tenant/city-hospital)
