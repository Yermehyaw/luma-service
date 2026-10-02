# LUNA Backend — My Plan

Written by the backend engineer. This is me thinking out loud about what I want to
build, in what order, and what I still need to know. It's allowed to change — I'll
update it as we go, same as `backend/app/models/README.md`.

---

## 1. Where I actually am right now

_This was written on day one and is now out of date. Kept because the gap between
this and section 9 is the honest measure of how much got done. For the current state,
read section 9._

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

- **Branch is `Asher`.** I push there. `main` is not mine to touch. *(Confirmed: this
  merges to `main` later, so I keep migrations linear and conflict-cheap.)*
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
- **Tests come with the code, not after.** Unit tests for every piece of business logic
  I write, from Phase 0 onward. One command runs them all. "Done" means the test
  passes, not that the code looks right.
- **Plain strings for status fields, not Postgres enums.** Confirmed — it's an MVP and
  we want the flexibility to add states without a migration. I lose DB-level protection
  against bad data, so status values get validated in the service layer and tested
  there. That's the trade, made on purpose.
- **Ticket numbers are opaque.** `LM-H2JK` style, never sequential. A customer must not
  be able to infer their position in the queue or the size of the business's traffic
  from their ticket number — we promise a time-based service level, not a number that
  leaks volume.

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
- **Test infrastructure, in this phase, not later** — `pytest`, `pytest-asyncio`,
  `httpx` async client, and a fixture setup so pure unit tests need no running Postgres
- First real unit tests: `/health` healthy vs. degraded, the DB ping, settings
  resolution, and the config/CORS wiring

**Exit criteria:** `alembic upgrade head` on a clean Postgres, server boots, `/health`
returns healthy against a real database, `pytest` runs green in one command, and I can
do it all again from scratch by following my own notes.

### Phase 1 — Data model integrity
Turn the sketch into a schema I'd defend in review.

- **Customer model** — next per `models/README.md`. Right now `Ticket.customer_name` is
  a loose string, so a ticket belongs to nobody. This is the keystone, and Ansee
  confirmed auth is mandatory, so a ticket *must* resolve to an authenticated customer.
  The `business_id` is recorded on the customer at signup, because signup happens on the
  tenant's subdomain, not ours.
- Real `ForeignKey`s: `Branch → Business`, `Ticket → Branch/Service/Customer`
- `relationship()` accessors, sensible `ondelete` behavior
- Timestamps everywhere (`created_at`, `updated_at`)
- **Payment model** — the models README says the Ticket links to a `payment_id`. That
  means payments are in scope, not optional. ALATPay is Nigeria-only, which fits the
  Wema Bank / Hackaholics context.
- **Opaque ticket numbers** — `LM-H2JK` shape: business prefix, random non-sequential
  suffix. A separate `ticket_number` column, unique, indexed, distinct from the primary
  `id`. Sequential numbering is off the table — it leaks queue position and business
  volume, which breaks the wait-time promise we make. Generation logic gets unit tests:
  format, collision retry, prefix correctness, non-sequentiality across a batch.
- **Ticket status stays a plain string** — per Ansee, MVP flexibility beats DB-level
  constraint. Valid set: `booked → called → done`, plus `cancelled` / `no_show`.
  Validation lives in the service layer, and illegal transitions get tests. Trade
  accepted deliberately.

**Exit criteria:** no column named `*_id` that isn't a foreign key; schema reads
cleanly top to bottom; deleting a Business cleans up after itself; ticket numbers are
opaque and collision-tested; status values are covered by tests even though the DB won't
enforce them.

### Phase 2 — Real queue logic
Turn the two stubs into the module the README promises.

- `POST /api/queue/tickets` — creates a real ticket, returns `TicketResponse`, with an
  opaque number generated and collision-checked
- `GET /api/queue/tickets` — filter by business, branch, status, with pagination
- Status transitions with validation — you can't jump `done → called`
- Wait-time estimate from the tickets ahead in the queue
- Real Pydantic schemas that match the models (today `customer_email` is required in
  the schema but has no column — that bug ships nothing)
- Unit tests throughout: transition legality, wait-time math, ticket number generation,
  tenant filtering on the list endpoint

**Exit criteria:** a booking created through the API is queryable, transitionable, and
covered by tests I can run in one command.

### Phase 3 — Tenancy & auth
The part that decides whether this product is trustworthy.

- Clerk token verification (the `CLERK_PEM_PUBLIC_KEY` is already sitting in config,
  unused)
- `core/security.py` + a `get_current_user` dependency
- **Customer signup on the tenant subdomain** — the customer registers inside the
  business' branded space, so signup must capture and persist which `business_id` they're
  registering against. Clerk redirects back to the tenant subdomain, not the LUNA domain.
- **A separate `require_customer` gate from staff auth.** Staff and customers come
  through different doors. The UI lets a customer walk most of the booking flow before
  the wall, so the unauthenticated part of the flow (browsing services, checking
  availability) has to stay usable, while ticket completion and payments are hard-gated.
- **Tenant resolution:** derive `business_id` from the verified identity and the
  subdomain, never from the request body. If a client can POST their own `business_id`,
  isolation is fake. This is now non-negotiable given auth is mandatory.
- Row-Level Security policies as defense in depth
- Staff vs. Management vs. Customer role separation
- **Unit tests that prove the isolation** — tenant A gets 404/403 on tenant B's ticket,
  tenant B's services, and any future tenant-scoped resource. An actual test, not a code
  review argument.

**Exit criteria:** the isolation test suite passes — tenant A cannot reach tenant B's data
by any route, including by forging `business_id` in the body.

### Phase 4 — The demo modules (Smart Queue + Social Studio)

Ansee confirmed the demo is **Smart Queue** and **Social Studio**. Those two get depth.
The other four get honest stubs — a real model, a documented endpoint that says "not
built yet," and no pretending.

**Smart Queue — the realtime layer**
- Redis pub/sub over WebSockets for live wait times and queue position
- Live ticket status pushes so the customer page updates without polling
- Wait-time forecasting (the Pro tier promise) and accessibility priority lanes
- WebSocket auth — the socket is tenant-scoped too, or it's an isolation hole that
  bypasses every check the HTTP routes do
- Unit tests for the pub/sub channel naming, the broadcast payload shape, and the
  wait-time forecast math

**Social Studio — the full surface**
Scope per section 6 — this is the big one, and it's larger than I originally wrote.
- **Data model first, properly:** social accounts, posts, publish targets, inbound
  queries/comments, analyses. Designed as a set, not bolted on.
- **Multi-handle management** — all the business' accounts across platforms in one place
- **Cross-handle posting** — compose once, publish to several
- **Inbound query handling** — customer questions surface as a respondable queue, with
  AI-suggested replies
- **Sentiment + intent pipeline** — lightweight HuggingFace models, local, per the
  privacy story. Auto-triage so complaints don't sit unread.
- **Trend surfacing, content-idea generation, growth analytics** — the credit system
  behind idea generation per the Basic/Pro tiers
- Unit tests for the pipeline: sentiment classification, intent mapping, credit
  accounting, and the suggestion path

**Honest stubs for the rest** — Document Verification, Payments, BranchConnect,
Intelligence Dashboard. Models and endpoint contracts documented, implementations
deferred. Payments at minimum needs the ALATPay transaction model to exist (Phase 1) and
the gate that stops an unauthenticated customer from completing a purchase.

### Phase 5 — Hardening
Rate limiting, structured logging, OpenAPI cleanup, background workers, deployment.

---

## 5. Answers from Ansee — locked in

Ansee answered the open questions on 1 Oct. These are decisions now, not assumptions.
I rewrote the affected phases to match.

### 5.1 Auth: account required, signup happens on the tenant's subdomain

**No guest booking.** A customer cannot complete a booking without an account. The
important nuance, though — the UI is *deliberately* allowed to let them walk a long way
into the flow before the wall. They pick a service, pick a slot, fill in details, and
get blocked at the key step (around payments) to create an account.

That ordering is a product decision, and it changes my backend work:

- The account is created on the **business' customer service subdomain**, not on the LUNA
  landing page. So a bank customer signs up inside the bank's branded space. Clerk
  handles auth; the tenant context comes from the subdomain, and I must make sure
  signup records which `business_id` the customer is registering against.
- The gate is a real gate, so I need a clean, well-defined "this request requires an
  authenticated customer" path — a `require_customer` dependency separate from staff
  auth, because customers and staff authenticate through different doors.
- I should make the pre-auth portion of the flow cheap and guest-friendly where it
  genuinely is guest-friendly (browsing services, checking availability) so the funnel
  isn't punishing before it's supposed to be.

I raised this as "the biggest question" in the original plan. Resolved: auth is
mandatory, but it's a *late* gate, not an early one.

### 5.2 Demo modules: Smart Queue and Social Studio

Not all six. The demo is **Smart Queue** and **Social Studio**, which means those two get
depth and the rest get honest stubs. This reorders my plan — I'm no longer going
broad-and-shallow across everything and hoping something impresses. Two modules that
actually work beat six that return placeholder strings.

### 5.3 `Asher` merges into `main` later

Not yet merged, but it will be. So I don't get sloppy about migration history — linear
revisions, no rewriting, nothing that'll make the merge ugly. If a schema change lands
on both sides I need to be the one who resolves it.

### 5.4 Ticket numbering: opaque

`LM-H2JK` shape — business prefix plus a random, non-sequential suffix. The reasoning
matters as much as the format: a sequential number would let a customer work out they're
the 31st person in the queue, or that the business serves 400 people a day, or
extrapolate their own wait. We promise 11 minutes of service delivery; a ticket number
that leaks volume undermines the promise we're making. Non-sequential also means it
doesn't reset in a guessable pattern per day.

### 5.5 Postgres enums: staying with plain strings

MVP, flexibility over constraint. The cost is real — nothing stops a typo'd status from
landing in the DB — so status transitions get validated in the service layer with tests
covering the illegal moves. Recorded as a deliberate trade, not an oversight.

### 5.6 API contract ownership: ours

We control what the frontend calls, so I define the endpoints and document them as they
land rather than negotiating each one. The OpenAPI docs at `/docs` are the source of
truth, and I'll keep them clean enough to actually be useful.

---

## 6. Social Studio — the real scope

My original plan reduced this to "HuggingFace sentiment + intent pipeline." That was
wrong, and underselling it. Per Ansee, Social Studio is a full operational surface:

1. **One-place management of all the business' social media** — every handle the
   business owns, visible and manageable from a single place. Multiple platforms per
   business, not one.
2. **Posting across multiple handles** — compose once, publish to several. One
   business, many accounts, and the staff member running it shouldn't have to log into
   four different native dashboards.
3. **Trend surfacing** — what's moving in their space, surfaced in-product.
4. **Content-idea generation** — the AI-assisted idea engine, with the credit system the
   Basic/Pro tiers describe (daily free credits, more purchasable).
5. **Growth analysis** — reach, engagement, follower movement over time, per handle and
   across the business.
6. **Customer query response** — actual inbound customer questions/comments surface as a
   queue to be answered. This is the operational half: staff need to *respond*, and
   quickly, or the complaint problem the README describes just moves into our inbox.
7. **Sentiment analysis** — lightweight local model, per the privacy story in the README.
8. **Intent classification** — so "I need a refund" and "what are your opening hours"
   don't sit in the same undifferentiated pile.

The through-line: 6 is where staff do the work, 7 and 8 are what make 6 possible at
speed (AI-suggested replies, auto-triage), 5 tells management whether any of it worked,
and 1–4 are the publishing machinery that creates the content customers respond to.

Structurally this is a bigger build than the queue module. I'm going to design the data
model for it properly rather than bolting it on — social accounts, posts, publish
targets, comments/queries, analyses — but I'll build the *working spine* first: accounts,
posts, inbound queries, sentiment, intents, and a real answer path. The generation and
trend pieces sit on top of that.

---

## 7. Unit tests, all the way through

Ansee was emphatic about this, and they're right. Testing is not a phase I get to at the
end of this — it's part of every phase from here.

What that means concretely:

- **Test infra in Phase 0**, alongside the foundation. Not after. `pytest`,
  `pytest-asyncio`, `httpx` for the async client, and a DB test setup that doesn't
  require a running Postgres for pure unit tests.
- **Business logic gets unit tests.** Status transition rules, opaque ticket number
  generation, wait-time calculation, sentiment/intent mapping, content credit accounting,
  tenant scoping of queries. These are the things that break silently.
- **The rule I'm holding myself to:** no function with a `if` in it that decides
  something the business cares about goes in without a test covering both branches.
- **One command runs everything.** Non-negotiable — if I can't verify the suite in one
  command, I don't get to say it works. `python -m pytest` from `backend/`, and
  `python -m pyflakes app tests` alongside it for dead imports. The pyflakes pass has
  already earned its place: it caught a missing `TYPE_CHECKING` import in the customer
  model that would have broken the relationship at runtime.

### Test layout, and why there are two kinds

- **`tests/test_*.py`** — pure unit tests. No database, no fixtures beyond mocks.
  Ticket number format, status transition rules, wait-time arithmetic, settings
  parsing. Fast, and they run anywhere.
- **`tests/integration/`** — real Postgres. Marked `integration` and `schema`. These
  are the tests that are actually worth the slow run, because what they verify cannot
  be faked: that foreign keys reject a bogus branch, that the unique index on
  `ticket_number` holds, that deleting a Business empties its whole subtree, and that
  tenant A gets a 404 on tenant B's ticket. A mocked ORM would happily pass all of
  those while the database disagreed.
- **Integration tests refuse to touch the dev database.** `conftest.py` raises at
  import if `TEST_DATABASE_URL` contains `luna_db`, because the suite drops every
  table on setup. Default is `luna_test_db`. That guard is the kind of thing that
  protects me at 2am and it costs three lines.
- Both kinds run under one `pytest` invocation. `pytest -m "not integration"` gives the
  fast loop when I'm only touching pure logic.

This supersedes the old "no tests exist, everything from here needs them" line in
section 8. The gap is being closed now, in Phase 0, and it closes from that point on.

---

## 8. Honest risks

- **Scope, now narrower but deeper.** The demo is Smart Queue + Social Studio, so I've
  dropped the ambition of touching all six. Two modules done properly, four honest
  stubs. The new risk is that Social Studio is *bigger than the queue module* once you
  count multi-handle publishing, growth analytics, trends, and the credit system. I
  could plausibly build a thin version of all eight Social Studio features and have none
  of them work well. I'd rather do the spine (accounts, posts, inbound queries,
  sentiment, intents, a real answer path) and let generation and trends be the
  visible gap.
- **No test suite exists today.** Phase 0 builds the harness and the first tests.
  Everything after that carries tests with it. The risk is speed in Phase 0 — writing
  the harness properly takes time I'd rather spend on features, and I'd be lying if I
  said I didn't feel that pull.
- **RLS is not optional for Enterprise.** The README promises data privacy and local
  deployment. If Phase 3 slips and we demo anyway, that's a known gap, not a surprise.
  Mitigation: tenant filtering in every query from Phase 2 onward, so RLS becomes
  defense in depth rather than the only line.
- **Plain strings for status is a real trade, not a free win.** Nothing in the DB stops
  `bokked`. Validation lives in the service layer, which means every write path has to go
  through it. If I add a bulk-update or admin endpoint later and skip the service layer,
  that's where bad data lands. I'll test the transitions, but the discipline is mine to
  hold.
- **Auth is a late gate but a hard one.** Letting customers browse before signup is
  deliberate, and it means I'm building an unauthenticated surface next to an
  authenticated one. That's exactly the shape where isolation bugs live. The
  isolation-test suite in Phase 3 is the answer, and it needs to cover the
  unauthenticated routes too — a public endpoint that leaks tenant data would be the
  worst bug in this codebase.
- **The AI models are a dependency risk.** `transformers` + `torch` in requirements is a
  heavy install and the model weights aren't in the repo. If the sentiment/intent
  pipeline can't run in the demo environment, Social Studio's most interesting half
  isn't demonstrable. I want the pipeline behind a clean interface with a deterministic
  fallback, so the module degrades instead of dying.

---

## 9. Where the backend actually is

Written after the first real build, so it's a status report and not a plan.

### Done and verified

- **Foundation (Phase 0, minus Alembic).** Real `/health` that pings Postgres and
  reports `degraded` rather than raising. CORS locked to a configured origin list.
  `DATABASE_ECHO` off by default. `__init__.py` everywhere. `.gitignore` and
  `.env.example` committed, `.env` local.
- **Data model (Phase 1).** `Business`, `Branch`, `Customer`, `Service`, `Ticket`,
  `Payment`, plus the Social Studio set (`SocialAccount`, `SocialPost`,
  `SocialPostTarget`, `SocialQuery`, `ContentCredit`). Real foreign keys throughout,
  `ondelete=CASCADE` from Business down, UUID string ids, database-populated
  timestamps, covering indexes on the actual read paths.
- **Opaque ticket numbers.** `SM-DDWN9` shape — configurable prefix per business, five
  random characters from an alphabet with `0/O/1/I/L` removed, uniqueness enforced by
  the database and retried at the service layer.
- **Status as plain strings, rules in code.** `booked → called → done`, plus
  `cancelled` and `no_show`, with terminal states that go nowhere. The trade Ansee
  asked for, with the validation cost paid in the service layer and covered by tests.
- **Smart Queue endpoints.** Create, list (filtered and paginated), fetch by number,
  transition status, wait estimate, and service listing/creation.
- **103 tests, all passing.** 66 unit, the rest against real Postgres. Plus a
  `pyflakes` pass, clean.

### Verified end to end, not just in tests

Ran the server and walked the customer flow: seeded a tenant, listed services, booked
two tickets, got `SM-DDWN9` back with "Any moment now" and `SM-PW85V` with "About 15
min" (correct — one ticket ahead), fetched by number, transitioned `booked → called`,
confirmed `called → booked` is rejected with a 409, and confirmed a different
`business_id` sees zero tickets.

### Deliberately not done

- **No Alembic.** Removed at Ansee's instruction. `app/create_tables.py` creates the
  schema from the models instead: idempotent, create-only, never drops or alters.
  Good enough for the MVP, and I don't pretend otherwise — it cannot evolve a schema,
  so the first time a column changes shape we'll need real migrations.
- **No auth.** `business_id` is still accepted from the request body. Every query
  filters on it and the isolation tests prove cross-tenant reads fail, but that is
  *filtering*, not *enforcement*. Until Phase 3, a client can lie about which business
  it is. This is the single most important gap between what exists and what the README
  promises.
- **No Social Studio endpoints.** The data model is designed and in the database, but
  nothing reads or writes it yet. Multi-handle posting, the sentiment/intent pipeline,
  trends, growth analytics and the credit system are all still ahead.
- **No Redis/WebSockets.** The queue is poll-only right now.
- **No Document Verification, BranchConnect, or Intelligence Dashboard.** Stubs at
  best.

### Open question that affects the wait-time display

The `format_countdown` output currently says "About 15 min" — a computed estimate
from tickets ahead times service duration. It is not a measured average, and it will
drift from reality on a busy day. The open question in section 10 is whether the "11
minutes" in the product promise is a target we display or a number we compute. If it's
a promise, the estimate needs to be calibrated against historical throughput or the UI
is making a claim we can't keep.

---

## 10. Still open

Smaller than it was, and none of these block the next piece of work:

- **Ticket number prefix** — resolved in the model's favour. `Business.ticket_prefix`
  is a column defaulting to `LM`, so a business can use its own initials without a
  code change. Already working; the seeded test business uses `AC` and `SM`.
- **Social platforms for the demo** — which handles does the demo business actually
  connect? Twitter/X and Instagram are the obvious pair. Affects how much of the
  publishing path is real API integration vs. simulated. **This is the one I'd like an
  answer to before starting Social Studio**, because the `SocialPlatform` enum and the
  credential storage both follow from it.
- **Wait-time accuracy** — see above. Target SLA or computed estimate? I lean toward
  computing it and labelling it an estimate, because a promise we can't measure is a
  support ticket generator.
- **Clerk instance** — is it provisioned, or do I build against a stub and wire the real
  keys later? Doesn't change the design, changes whether Phase 3 is verifiable.
- **Payments gate placement** — Ansee said the auth wall goes "prob before/after
  payments". Which side? Before payments is friendlier and loses some conversion;
  after payments means someone pays and then hits a wall, which is worse. I'd put it
  before, but it's your call and it changes the order I build the payment flow.

---

_Last updated: Phase 0 and Phase 1 done, Phase 2 endpoints working and verified
end-to-end. 103 tests passing. Alembic removed per instruction; `create_tables.py` in
its place. Branch: `Asher`, merging to `main` later._
