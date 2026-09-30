# LUNA Backend — My Plan

Written by the backend engineer. This is me thinking out loud about what I want to
build, in what order, and what I still need to know. It's allowed to change — I'll
update it as we go, same as `backend/app/models/README.md`.

---

## 1. Where I actually am right now

Let me be honest about this, because pretending we're further along than we are will
only cost us time later.

The backend is a skeleton with a few bones. What exists:

- `app/main.py` — FastAPI app boots, CORS wide open, one router wired up
- `app/core/config.py` — settings load from `.env`
- `app/core/database.py` — async engine + `get_db` dependency
- `app/models/` — `Business`, `Branch`, `Service`, `Ticket`
- `app/schemas/queue.py` — `TicketCreate` / `TicketResponse`
- `app/routers/queue.py` — two routes that return "logic pending" strings

What that means in plain terms: **nothing persists yet.** No migrations, no
`create_all`, no foreign keys, no auth, no tests. The models are a good sketch of the
shape of the data, but they aren't load-bearing.

I'd rather say that now than in week three.

---

## 2. What I want to build

LUNA is B2B2C multi-tenant. A bank, a hospital, or a salon buys LUNA. Their customers
then book slots, upload documents, pay fees, and watch a live queue. The backend's job
is to be the trustworthy spine underneath all six modules: Social Studio, Smart
Queue/Bookings, Document Verification, Payments, BranchConnect, Intelligence
Dashboard.

The customer flow I am building toward, straight from the README:

> Customer picks a service → books a timed slot → uploads required docs → pays fees
> → tracks live queue time → gets called → leaves feedback.

If my API makes that flow awkward, I've built the wrong thing. That's the test I want
to hold every endpoint against.

### What "done" looks like to me

Not "the endpoint returns 200." It's:

- A customer can actually book, and the ticket survives a restart
- One tenant can never see another tenant's data, and I can prove it
- The DB schema is versioned in git, not just whatever I last ran
- I can tell you what broke, from the logs, without guessing

---

## 3. Rules I'm holding myself to

These are mine, not negotiable, so I stop relitigating them every PR:

- **Branch is `Asher`.** I push there. `main` is not mine to touch.
- **Commit style:** `[Add]: <thing>` / `[Update]: <thing>` / `[Fix]: <thing>` —
  matching what's already in the log.
- **Async or nothing.** `asyncpg`, `AsyncSession`, `async def` routes. No sync drivers
  sneaking back in.
- **Pydantic v2.** `from_attributes`, not `orm_mode`. That one's already burned once.
- **Multi-tenancy is enforced at the data layer, not in my discipline.** Every
  tenant-scoped query filters on `business_id`. Postgres Row-Level Security is the goal,
  not the fallback.
- **No secrets in git.** `.env` stays local, `.env.example` gets committed.
- **Schemas are separate from models.** Never return a raw ORM object.

---

## 4. The order I want to work in

### Phase 0 — Make it real *(foundation, blocks literally everything)*
Nothing above this line is worth building until this is done.

- Alembic wired up properly: `alembic.ini`, `migrations/`, async `env.py`
- An initial migration that creates the four existing tables
- Missing `__init__.py` in `app/`, `app/core/`, `app/schemas/`
- Drop `psycopg2-binary` (we're on `asyncpg`, it's just confusion)
- Real `/health` — actually pings the DB, returns `degraded` if it can't reach it
- CORS locked to configured origins
- `echo=True` off by default, behind a setting
- Python entries in `.gitignore`, plus `.env.example`

**Exit criteria:** `alembic upgrade head` on a clean Postgres, server boots, `/health`
returns healthy against a real database, and I can do it again from scratch by
following my own notes.

### Phase 1 — Data model integrity
Turn the sketch into a schema I'd defend in review.

- **Customer model** — next per `models/README.md`. Right now `Ticket.customer_name` is
  a loose string, so a ticket belongs to nobody. This is the keystone.
- Real `ForeignKey`s: `Branch → Business`, `Ticket → Branch/Service/Customer`
- `relationship()` accessors, sensible `ondelete` behavior
- Timestamps everywhere (`created_at`, `updated_at`)
- **Payment model** — the models README says the Ticket links to a `payment_id`. That
  means payments are in scope, not optional.
- Constraint Ticket's status to a real enum: `booked → called → done`, plus
  `cancelled` / `no_show`
- Postgres enums over bare strings, so bad data can't land

**Exit criteria:** no column named `*_id` that isn't a foreign key; schema reads
cleanly top to bottom; deleting a Business cleans up after itself.

### Phase 2 — Real queue logic
Turn the two stubs into the module the README promises.

- `POST /api/queue/tickets` — creates a real ticket, returns `TicketResponse`
- `GET /api/queue/tickets` — filter by business, branch, status, with pagination
- Status transitions with validation — you can't jump `done → called`
- Wait-time estimate from the tickets ahead in the queue
- Real Pydantic schemas that match the models (today `customer_email` is required in
  the schema but has no column — that bug ships nothing)
- Tests. I'm not claiming "done" on untested business rules.

**Exit criteria:** a booking created through the API is queryable, transitionable, and
covered by tests I can run in one command.

### Phase 3 — Tenancy & auth
The part that decides whether this product is trustworthy.

- Clerk token verification (the `CLERK_PEM_PUBLIC_KEY` is already sitting in config,
  unused)
- `core/security.py` + a `get_current_user` dependency
- **Tenant resolution:** derive `business_id` from the verified identity, never from
  the request body. If a client can POST their own `business_id`, isolation is fake.
- Row-Level Security policies as defense in depth
- Staff vs. Management vs. Customer role separation

**Exit criteria:** a test that proves tenant A gets a 404/403 on tenant B's ticket. Not
a code review argument — an actual test.

### Phase 4 — The other modules
Roughly ascending in how much I need to learn first:

1. **Document Verification** — upload, storage, status lifecycle
   (`Processing / Verified / Action Required / Rejected`), hooks for OCR
2. **Payments** — ALATPay integration, transaction linked to its ticket
3. **Smart Queue realtime** — Redis pub/sub over WebSockets for live wait times
4. **Social Studio** — HuggingFace sentiment + intent pipeline, the AI surface
5. **BranchConnect** — internal collaboration feed
6. **Intelligence Dashboard** — cross-module aggregation, the management view

### Phase 5 — Hardening
Rate limiting, structured logging, OpenAPI cleanup, background workers, deployment.

---

## 5. Assumptions I'm making — correct me

I'm building on these because the docs don't say, and I'd rather flag them than bury
them:

- **Auth is Clerk.** Inferred from `CLERK_PEM_PUBLIC_KEY` already in config.
- **Customers may be anonymous at booking time.** They can book as a guest and create
  a verified account later. This is why `customer_email` is marked "will be required
  soon" in the schema. If auth is mandatory from ticket one, say so — it changes
  `TicketCreate` and the whole auth order.
- **IDs are strings, UUIDs.** Already the pattern in the existing models; I'm keeping
  it rather than half-migrating.
- **ALATPay is Nigeria-only**, which matches the Wema Bank / Hackaholics context.

---

## 6. What I need from you

Blocking me:

1. **Can a customer book without an account?** (biggest one — gates Phase 3)
2. **Which module is the demo?** If it's Smart Queue, I reorder and go deep there
   first instead of broad.
3. **Is `Asher` merged into `main`, or does it diverge?** I want to know if I'm
   building on something that'll be rebased.

Not blocking, but I'd like answers:

4. Ticket numbering — sequential per branch (`A-014`) or opaque?
5. Do we keep Postgres enums, or stay on plain strings for portability?
6. Who owns the frontend API contract? I don't want us both inventing endpoints.

---

## 7. Honest risks

- **Scope.** Six modules is a lot. I want to be explicit that I will do Phase 0–2
  properly and stub or defer the rest, rather than half-build all six. Depth on one
  module beats shallow on six, every time.
- **RLS is not optional for Enterprise.** The README promises data privacy and local
  deployment. If we skip Phase 3 and demo anyway, that's a known gap, not a
  surprise.
- **No tests exist.** Everything I build from here needs them or the confidence is
  fake.

---

_Last updated: Phase 0 about to start. Branch: `Asher`._
