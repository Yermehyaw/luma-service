# LUNA FRONTEND — MIGRATION DOCUMENTATION

## 1. Migration Overview

The legacy Vite SPA frontend has been transformed into a production-ready **Next.js App Router multi-tenant architecture**.

---

## 2. Route & Component Migration Mapping

| Legacy Vite Route | New Next.js App Router Route | Target Experience |
|---|---|---|
| `/` | `app/(marketing)/page.tsx` | Marketing Homepage |
| `/company` | `app/(marketing)/company/page.tsx` | Marketing Company Page |
| `/institutions` | `app/(marketing)/institutions/page.tsx` | Marketing Institutions Directory |
| `/book` | `app/tenant/[tenantId]/book-queue/page.tsx` | Tenant Customer Ticket Booking |
| `/track` | `app/tenant/[tenantId]/track/page.tsx` | Tenant Customer Ticket Tracking |
| `/verify` | `app/tenant/[tenantId]/verify/page.tsx` | Tenant Customer Document Verification |
| `/console` | `app/tenant/[tenantId]/staff/ops-console/page.tsx` | Tenant Staff Operations Console |
| `/login` | `app/(platform)/login/page.tsx` | SaaS Platform Admin Authentication |

---

## 3. Structural Enhancements

1. **Self-Contained Feature Architecture**:
   Refactored inline page logic into modular feature folders in `src/features/` (`queue-management`, `ticketing`, `social-studio`, `verification`, `analytics`, `tenant-management`).

2. **Decoupled Mock Repository Layer**:
   Extracted hardcoded mock objects into `src/mock/` with formal repository interfaces (`QueueRepository`, `TicketRepository`, `SocialRepository`, `AuthRepository`).

3. **Dynamic Tenant Switcher**:
   Added live tenant switching capability (`TenantSwitcher`) allowing instant testing of Acme Bank, City Hospital, Luma Telecom, Makerere University, and National Identity Civic Center.
