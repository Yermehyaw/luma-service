# LUNA FRONTEND — MULTI-TENANT NEXT.JS ARCHITECTURE

## 1. Executive Summary

Luma is architected as **One Next.js App Router application** capable of serving:
1. **Luma Marketing Website** (`app/(marketing)`)
2. **Luma SaaS Platform App** (`app/(platform)`)
3. **Tenant Customer Portals** (`app/[tenantId]/(customer)`)
4. **Tenant Staff Operations Consoles** (`app/[tenantId]/(staff)`)

All tenant organizations (Banks, Hospitals, Telecoms, Universities, Government Identity Hubs) utilize the exact same reusable UI components. Tenant-specific branding, feature flags, navigation items, and data rules are driven dynamically by tenant configuration.

---

## 2. Directory Structure

```text
src/
├── app/
│   ├── (marketing)/                # Luma Marketing Website
│   │   ├── page.tsx                # Homepage
│   │   ├── company/                # About & Mission
│   │   ├── institutions/           # Directory of live branches
│   │   ├── features/               # Platform modules overview
│   │   └── pricing/                # SaaS Plans
│   │
│   ├── (platform)/                 # Luma SaaS Admin Platform
│   │   ├── login/                  # Multi-tenant admin authentication
│   │   ├── dashboard/              # Global SaaS platform metrics & tenant overview
│   │   ├── organizations/          # Tenant provisioning & feature entitlements
│   │   └── billing/                # MRR & subscriptions
│   │
│   ├── tenant/                     # Development Routing (/tenant/[tenantId])
│   │   └── [tenantId]/
│   │       ├── page.tsx            # Customer Landing Page
│   │       ├── book-queue/         # Timed ticket booking
│   │       ├── track/              # Live ticket queue tracking
│   │       ├── verify/             # Home document pre-clearance
│   │       │
│   │       └── staff/              # Staff Operations Portal
│   │           ├── ops-console/    # Counter call-next & live triage
│   │           ├── social-studio/  # AI sentiment care workstation
│   │           ├── customers/      # Customer CRM directory
│   │           ├── branches/       # Branch location manager
│   │           ├── services/       # Service catalog manager
│   │           ├── analytics/      # Executive queue performance radar
│   │           └── settings/       # Branding engine & feature flags
│   │
│   ├── layout.tsx                  # Global App Router Layout & Fonts
│   ├── loading.tsx                 # Universal loading indicator
│   ├── error.tsx                   # Universal error boundary
│   └── not-found.tsx               # 404 handler
│
├── features/                       # Self-Contained Feature Modules
│   ├── queue-management/           # Queue items, live queue hook, controls
│   ├── ticketing/                  # Ticket creation & status tracking
│   ├── social-studio/              # Social broadcasts & AI sentiment care
│   ├── verification/               # AI OCR document verification
│   ├── analytics/                  # Wait time charts & performance cards
│   ├── tenant-management/          # Tenant switcher & provisioning
│   ├── tenant-branding/            # CSS variable injection engine
│   └── authentication/             # Mock Auth repository & role switching
│
├── components/
│   ├── layouts/                    # Marketing, Platform, Customer, Staff layouts
│   ├── navigation/                 # TenantSidebar, StaffHeader, CustomerNavbar
│   └── shared/                     # LumaMark, LumaLogo, FeatureGate, PermissionGate
│
├── lib/
│   ├── api-client.ts               # Shared API client for future FastAPI integration
│   ├── tenant.ts                   # Tenant resolution engine & repository
│   ├── tenant-context.tsx          # Tenant React Context & useTenant hook
│   ├── tenant-branding.ts          # CSS variable injector
│   ├── feature-flags.ts            # Feature flags & FeatureGate
│   ├── permissions.ts              # User permissions & PermissionGate
│   ├── auth.ts                     # AuthRepository interface & MockAuthRepository
│   └── utils.ts                    # Classname merge, date formatters, ticket code generators
│
├── mock/                           # Decoupled Mock Repositories Data
│   ├── tenants.ts                  # Acme Bank, City Hospital, Luma Telecom, etc.
│   ├── users.ts                    # Super Admin, Tenant Owner, Staff, Customer
│   ├── queues.ts                   # Live branch queue states
│   ├── tickets.ts                  # Pre-booked & called tickets
│   └── social.ts                   # Social posts & sentiment DMs
│
└── middleware.ts                   # Subdomain host resolution & route rewriter
```

---

## 3. Multi-Tenant Engine & Subdomain Resolution

The application uses `src/middleware.ts` to inspect the incoming `Host` header:
- **`luma.com`** → Marketing site (`app/(marketing)`)
- **`app.luma.com`** → SaaS platform console (`app/(platform)`)
- **`acme-bank.luma.com`** → Rewrites to `/tenant/acme-bank`
- **`acme-bank.luma.com/staff`** → Rewrites to `/tenant/acme-bank/staff`
- **`localhost:3000/tenant/acme-bank`** → Supported directly for local development.

---

## 4. Tenant Branding & CSS Variables Engine

Branding parameters (`primaryColor`, `secondaryColor`, `accentColor`, `backgroundColor`, `textColor`) are injected dynamically as custom CSS variables onto the container:

```css
:root {
  --tenant-primary: #0057B8;
  --tenant-secondary: #002F6C;
  --tenant-accent: #00A3E0;
  --tenant-bg: #F4F8FC;
  --tenant-text: #0B1D3A;
}
```

Components consume these variables (e.g., `bg-[var(--tenant-primary)]`), ensuring brand transformation occurs instantly without duplicating code.

---

## 5. Feature Flags & Permission Engine

Features (e.g., `queue`, `social`, `verification`, `analytics`, `appointments`) are gated via `FeatureGate`:

```tsx
<FeatureGate feature="social">
  <SocialFeed />
</FeatureGate>
```

Navigation items in `TenantSidebar` automatically filter out disabled modules.

---

## 6. Repository Pattern & Future FastAPI Integration

UI components consume repository interfaces:
- `QueueRepository` → `MockQueueRepository`
- `TicketRepository` → `MockTicketRepository`
- `TenantRepository` → `MockTenantRepository`
- `AuthRepository` → `MockAuthRepository`

To connect to a future FastAPI backend:
Replace `MockQueueRepository` with `FastAPIQueueRepository` in `queue-repository.ts`. The UI components, pages, and layouts require **zero changes**.
