# RentNest Backend — Codebase Audit & Final Checklist

> **Purpose**: Run through this document **after** the coding agent has implemented `implementation.md`, and **before** you submit. It is a verification pass, not a build plan — every item here should be checkable by running a command, hitting an endpoint, or reading a specific file. Section numbers in brackets (e.g. `[§6.5]`) refer back to the corresponding section in `implementation.md`.
>
> Work top to bottom. Do not skip a section because an earlier one passed — several of the zero-marks rules (§0 of the implementation plan) fail silently if only spot-checked.

---

## How to use this document

- [x] checkboxes = pass/fail, check off only after you've actually verified it (run the command / hit the endpoint), not because "it should work."
- Where a command is given, paste its actual output into your own notes if it fails, so you can hand a precise bug report to the coding agent instead of "payments are broken."
- If any item in **Section 1 (Zero-Marks Audit)** fails, stop and fix it before continuing — everything downstream assumes these hold.

---

## 1. Zero-Marks Audit `[§0]`

These map 1:1 to README's mandatory requirements. A single failure here caps the grade at 0 regardless of how good the rest of the code is.

|  #  | Rule                                                              | How to verify                                                                                                                      |                                                      Pass?                                                      |
| :-: | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------: | --- |
|  1  | API docs cover every endpoint                                     | Open the Postman collection / Swagger UI, count endpoints, compare against `routes/` files — every route must appear on both sides |                                                       [x]                                                       |
|  2  | Every error response is `{ success, message, errorDetails }`      | Run the error-format spot-check in §4 below across 400/401/403/404/409/500                                                         |                                                       [x]                                                       |
|  3  | ≥ 20 meaningful commits                                           | `git log --oneline                                                                                                                 | wc -l`on the backend repo ≥ 20; skim`git log --oneline` for descriptive messages (no bare "fix"/"wip"/"update") | [x] |
|  4  | Input validation on every endpoint that accepts body/query/params | `grep -rL "validate(" src/modules/*/*.routes.ts` — should return **zero** files (every routes file uses the validation middleware) |                                                       [x]                                                       |
|  5  | Working admin credentials                                         | Log in with the admin email/password against the **live** URL, not localhost, and confirm `GET /api/auth/me` returns role `ADMIN`  |                                                       [x]                                                       |
|  6  | Real Stripe payment integration, no fake/simulated payments       | Run the full payment dry run in §8 below (and the payment rows of §7) with a real Stripe test-mode card                            |                                                       [x]                                                       |
|  7  | No plagiarism                                                     | Self-attestation — code is your own / your agent's original output                                                                 |                                                       [x]                                                       |
|  8  | No frontend required                                              | Confirm repo contains no frontend framework/build (React/Vue/etc.) unless intentionally added for your own testing                 |                                                       [x]                                                       |
|  9  | Exactly 3 fixed roles, selected at registration                   | Attempt to register with `role: "ADMIN"` → must be rejected with 400                                                               |                                                       [x]                                                       |

---

## 2. Tech Stack Audit `[§1]`

| Item                                | Check                                                                                        | Pass? |
| ----------------------------------- | -------------------------------------------------------------------------------------------- | :---: |
| TypeScript strict mode              | `tsconfig.json` has `"strict": true`                                                         |  [x]  |
| Prisma + PostgreSQL                 | `prisma/schema.prisma` exists, `datasource db { provider = "postgresql" }`                   |  [x]  |
| JWT auth                            | `jsonwebtoken` in `package.json` dependencies                                                |  [x]  |
| Zod validation                      | `zod` in `package.json` dependencies, used in every `*.validation.ts`                        |  [x]  |
| Stripe only (no SSLCommerz)         | `grep -ri sslcommerz src/ prisma/` returns nothing                                           |  [x]  |
| bcrypt password hashing             | `bcrypt` or `bcryptjs` in dependencies; no plaintext passwords anywhere in seed/service code |  [x]  |
| `.env` not committed                | `.gitignore` includes `.env`; `git log --all --full-history -- .env` returns nothing         |  [x]  |
| `.env.example` present and complete | Every key referenced in `config/` appears in `.env.example` with no real values              |  [x]  |

---

## 3. Database Schema Audit `[§3]`

```bash
npx prisma validate          # schema is syntactically valid
npx prisma migrate dev       # migrations apply cleanly on a fresh DB
npx prisma db seed           # seed runs without error
npx prisma studio            # visually inspect tables/relations
```

| Check                                                                                                                                                                        | Pass? |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---: |
| All 6 core tables exist: User, Category, Property, RentalRequest, Payment, Review                                                                                            |  [x]  |
| `Property.rent` and `Payment.amount` are `Decimal(10,2)`, **not** `Float` (money precision)                                                                                  |  [x]  |
| `Review` has `@@unique([tenantId, propertyId])` — one review per tenant per property                                                                                         |  [x]  |
| `RentalRequest.status` enum includes at minimum: `PENDING, APPROVED, REJECTED, ACTIVE, COMPLETED`                                                                            |  [x]  |
| Seed creates: 1 admin, default categories, 2+ landlords, 2+ tenants, sample properties                                                                                       |  [x]  |
| Admin password in seed is read from `process.env.SEED_ADMIN_PASSWORD`, not hardcoded in `seed.ts` source                                                                     |  [x]  |
| No status field (`RentalRequest.status`, `Payment.status`, `User.isBanned`) can be set directly from a client-supplied request body — trace each service function to confirm |  [x]  |

---

## 4. Error Handling & Response Format Audit `[§4, §5]`

Run each of these against your **local or deployed** API and confirm the JSON shape exactly matches `{ "success": false, "message": "...", "errorDetails": ... }`.

| Trigger                                                 | Method                                              |                 Expected status                  | Pass? |
| ------------------------------------------------------- | --------------------------------------------------- | :----------------------------------------------: | :---: |
| Hit a route that doesn't exist (`GET /api/nonexistent`) | any                                                 |                       404                        |  [x]  |
| POST to any endpoint with a missing required field      | e.g. `POST /api/auth/register` with no `email`      |                       400                        |  [x]  |
| Register with an email that already exists              | `POST /api/auth/register` (duplicate)               |                       409                        |  [x]  |
| Call a protected route with no `Authorization` header   | any auth-required route                             |                       401                        |  [x]  |
| Call a role-restricted route with the wrong role        | e.g. tenant calling `POST /api/landlord/properties` |                       403                        |  [x]  |
| Force an unhandled exception (temporarily, for testing) | any route                                           | 500, but still valid JSON, process doesn't crash |  [x]  |

For every row above, also confirm:

- [x] `errorDetails` is present in the payload (object, array, or explicit `null` — never omitted).
- [x] No raw stack trace or Prisma error object leaks through in production mode (`NODE_ENV=production`).

---

## 5. Input Validation Audit `[§6, §8]`

```bash
# Confirm every routes file references the validation middleware
grep -rL "validate(" src/modules/*/*.routes.ts
```

This command should print **nothing**. If it prints a filename, that module has at least one unvalidated route.

| Endpoint class                           | Test                      | Expected                         | Pass? |
| ---------------------------------------- | ------------------------- | -------------------------------- | :---: |
| Negative/zero price on property creation | `rent: -100`              | 400 with field-level message     |  [x]  |
| Invalid email format on register/login   | `email: "not-an-email"`   | 400                              |  [x]  |
| Rating outside 1–5 on review             | `rating: 7`               | 400                              |  [x]  |
| Non-UUID `:id` param on any detail route | `GET /api/properties/123` | 400, not a raw Prisma cast error |  [x]  |
| Wrong-type enum value                    | e.g. `role: "SUPERUSER"`  | 400                              |  [x]  |

---

## 6. Role-Based Access Control Audit `[§7]`

Walk this table with three actual accounts (one per role), not just by reading the code.

| Action                           |         Tenant          |     Landlord      |  Admin   |
| -------------------------------- | :---------------------: | :---------------: | :------: |
| Browse properties/categories     |           ✅            |        ✅         |    ✅    |
| Create/edit/delete own property  |        ❌ (403)         |    ✅ own only    |  ✅ any  |
| Edit another landlord's property |            —            |     ❌ (403)      |    ✅    |
| Submit rental request            |           ✅            |     ❌ (403)      | ❌ (403) |
| Approve/reject rental request    |        ❌ (403)         | ✅ own properties |    ✅    |
| Mark rental completed            |        ❌ (403)         | ✅ own properties |    ✅    |
| Make payment                     |     ✅ own request      |     ❌ (403)      | ❌ (403) |
| Leave review                     | ✅ own completed rental |     ❌ (403)      | ❌ (403) |
| Ban/unban users                  |        ❌ (403)         |     ❌ (403)      |    ✅    |
| Manage categories                |        ❌ (403)         |     ❌ (403)      |    ✅    |

- [x] Every ❌ cell above was actually tested and returned 403 (not 401, not a silent 200).
- [x] Banning a user mid-session invalidates their **existing** JWT on the next request (not just blocks future logins).

---

## 7. Full API Endpoint Test Matrix

This is the exhaustive pass — every single endpoint in the plan, tested with every relevant role, both success and failure paths, with the exact response shape checked each time. Section 6 above was a spot-check; this is the complete sweep. Do this with a real Postman run (or an automated test script) against your **actual running API**, not by reading the code and assuming it's correct.

**For every row below, check three things, not just the status code:**

1. **Status code** matches the "Expected" column.
2. **Success shape**: `{ "success": true, "message": "...", "data": {...} }` (plus `"meta"` for paginated list endpoints).
3. **Error shape**: `{ "success": false, "message": "...", "errorDetails": ... }` — and that the `data` returned on success actually contains the fields you'd expect (e.g. a created property really has an `id`, a login response really has a `token`, a password field is never present anywhere).

### 7.1 Authentication Module

| Method | Endpoint             | Actor                  | Test case                         |                              Expected                              | Pass? |
| ------ | -------------------- | ---------------------- | --------------------------------- | :----------------------------------------------------------------: | :---: |
| POST   | `/api/auth/register` | Public                 | Valid tenant registration         |       201, `data.token` + `data.user` (no `password` field)        |  [x]  |
| POST   | `/api/auth/register` | Public                 | Valid landlord registration       |                                201                                 |  [x]  |
| POST   | `/api/auth/register` | Public                 | `role: "ADMIN"`                   |             400, `errorDetails` names the `role` field             |  [x]  |
| POST   | `/api/auth/register` | Public                 | Duplicate email                   |                                409                                 |  [x]  |
| POST   | `/api/auth/register` | Public                 | Missing `email`                   |                                400                                 |  [x]  |
| POST   | `/api/auth/register` | Public                 | Missing `password`                |                                400                                 |  [x]  |
| POST   | `/api/auth/register` | Public                 | Invalid email format              |                                400                                 |  [x]  |
| POST   | `/api/auth/register` | Public                 | Password shorter than minimum     |                                400                                 |  [x]  |
| POST   | `/api/auth/login`    | Public                 | Correct email + password          |                     200, `data.token` present                      |  [x]  |
| POST   | `/api/auth/login`    | Public                 | Wrong password                    |                                401                                 |  [x]  |
| POST   | `/api/auth/login`    | Public                 | Nonexistent email                 | 404 (or 401 — confirm the plan's chosen code is used consistently) |  [x]  |
| POST   | `/api/auth/login`    | Public                 | Banned user's correct credentials |                                403                                 |  [x]  |
| GET    | `/api/auth/me`       | Any authenticated role | Valid token                       |                200, `data` has no `password` field                 |  [x]  |
| GET    | `/api/auth/me`       | Public                 | No `Authorization` header         |                                401                                 |  [x]  |
| GET    | `/api/auth/me`       | Any                    | Expired or malformed token        |                                401                                 |  [x]  |

### 7.2 Properties & Categories (Public)

| Method | Endpoint              | Actor  | Test case                                              |                        Expected                         | Pass? |
| ------ | --------------------- | ------ | ------------------------------------------------------ | :-----------------------------------------------------: | :---: |
| GET    | `/api/properties`     | Public | No filters                                             |   200, `data` is an array, `meta` has pagination info   |  [x]  |
| GET    | `/api/properties`     | Public | `?location=` filter                                    |                 200, results all match                  |  [x]  |
| GET    | `/api/properties`     | Public | `?minPrice=&maxPrice=` filter                          |                200, results within range                |  [x]  |
| GET    | `/api/properties`     | Public | `?categoryId=` filter                                  |            200, results all in that category            |  [x]  |
| GET    | `/api/properties`     | Public | Confirm `RENTED`/`UNAVAILABLE` properties are excluded |                    200, none present                    |  [x]  |
| GET    | `/api/properties`     | Public | `?page=2&limit=5`                                      |  200, correct slice returned, `meta.page` reflects it   |  [x]  |
| GET    | `/api/properties/:id` | Public | Valid existing id                                      | 200, includes category + landlord (name only) + reviews |  [x]  |
| GET    | `/api/properties/:id` | Public | Non-UUID id                                            |                           400                           |  [x]  |
| GET    | `/api/properties/:id` | Public | Valid UUID, nonexistent property                       |                           404                           |  [x]  |
| GET    | `/api/categories`     | Public | —                                                      |                200, array of categories                 |  [x]  |

### 7.3 Landlord Management Module

| Method | Endpoint                              | Actor    | Test case                                   |                  Expected                   | Pass? |
| ------ | ------------------------------------- | -------- | ------------------------------------------- | :-----------------------------------------: | :---: |
| POST   | `/api/landlord/properties`            | Landlord | Valid property payload                      |  201, `data.landlordId` matches the caller  |  [x]  |
| POST   | `/api/landlord/properties`            | Tenant   | Same valid payload                          |                     403                     |  [x]  |
| POST   | `/api/landlord/properties`            | Landlord | Missing required field (e.g. `title`)       |                     400                     |  [x]  |
| POST   | `/api/landlord/properties`            | Landlord | Nonexistent `categoryId`                    |                     404                     |  [x]  |
| POST   | `/api/landlord/properties`            | Landlord | Negative `rent`                             |                     400                     |  [x]  |
| PUT    | `/api/landlord/properties/:id`        | Landlord | Own property, partial update                |        200, updated fields reflected        |  [x]  |
| PUT    | `/api/landlord/properties/:id`        | Landlord | Another landlord's property                 |                     403                     |  [x]  |
| PUT    | `/api/landlord/properties/:id`        | Landlord | Nonexistent property id                     |                     404                     |  [x]  |
| DELETE | `/api/landlord/properties/:id`        | Landlord | Own property, no active rentals             |                     200                     |  [x]  |
| DELETE | `/api/landlord/properties/:id`        | Landlord | Own property, has an active rental          |                     400                     |  [x]  |
| DELETE | `/api/landlord/properties/:id`        | Landlord | Another landlord's property                 |                     403                     |  [x]  |
| GET    | `/api/landlord/requests`              | Landlord | Own properties' requests                    | 200, only requests on own properties appear |  [x]  |
| GET    | `/api/landlord/requests`              | Tenant   | —                                           |                     403                     |  [x]  |
| PATCH  | `/api/landlord/requests/:id`          | Landlord | Approve a `PENDING` request on own property |          200, `status: "APPROVED"`          |  [x]  |
| PATCH  | `/api/landlord/requests/:id`          | Landlord | Reject a `PENDING` request                  |          200, `status: "REJECTED"`          |  [x]  |
| PATCH  | `/api/landlord/requests/:id`          | Landlord | Request already processed (not `PENDING`)   |                     400                     |  [x]  |
| PATCH  | `/api/landlord/requests/:id`          | Landlord | Request on a property they don't own        |                     403                     |  [x]  |
| PATCH  | `/api/landlord/requests/:id/complete` | Landlord | Request currently `ACTIVE`, own property    |         200, `status: "COMPLETED"`          |  [x]  |
| PATCH  | `/api/landlord/requests/:id/complete` | Landlord | Request not yet `ACTIVE`                    |                     400                     |  [x]  |
| PATCH  | `/api/landlord/requests/:id/complete` | Landlord | Another landlord's property                 |                     403                     |  [x]  |

### 7.4 Rental Request Module

| Method | Endpoint           | Actor    | Test case                                  |                Expected                | Pass? |
| ------ | ------------------ | -------- | ------------------------------------------ | :------------------------------------: | :---: |
| POST   | `/api/rentals`     | Tenant   | Valid request on an `AVAILABLE` property   |        201, `status: "PENDING"`        |  [x]  |
| POST   | `/api/rentals`     | Tenant   | Duplicate pending request on same property |                  409                   |  [x]  |
| POST   | `/api/rentals`     | Tenant   | Property not `AVAILABLE`                   |                  400                   |  [x]  |
| POST   | `/api/rentals`     | Landlord | —                                          |                  403                   |  [x]  |
| POST   | `/api/rentals`     | Tenant   | `moveInDate` in the past                   |                  400                   |  [x]  |
| GET    | `/api/rentals`     | Tenant   | Own requests only                          | 200, no other tenants' requests appear |  [x]  |
| GET    | `/api/rentals`     | Landlord | Requests for own properties                |                  200                   |  [x]  |
| GET    | `/api/rentals/:id` | Tenant   | Own request                                |                  200                   |  [x]  |
| GET    | `/api/rentals/:id` | Tenant   | Someone else's request                     |                  403                   |  [x]  |
| GET    | `/api/rentals/:id` | Landlord | Request on own property                    |                  200                   |  [x]  |

### 7.5 Payment Module (Stripe)

| Method | Endpoint                | Actor                   | Test case                                     |                                Expected                                 | Pass? |
| ------ | ----------------------- | ----------------------- | --------------------------------------------- | :---------------------------------------------------------------------: | :---: |
| POST   | `/api/payments/create`  | Tenant                  | Own request, status `APPROVED`                |   200, `data.clientSecret` (or checkout URL) present, real Stripe id    |  [x]  |
| POST   | `/api/payments/create`  | Tenant                  | Request not yet `APPROVED`                    |                                   400                                   |  [x]  |
| POST   | `/api/payments/create`  | Tenant                  | Someone else's request                        |                                   403                                   |  [x]  |
| POST   | `/api/payments/create`  | Tenant                  | Payment already exists for this request       |                                   409                                   |  [x]  |
| POST   | `/api/payments/confirm` | Tenant                  | Valid payment, Stripe status `succeeded`      | 200, `Payment.status` → `COMPLETED`, `RentalRequest.status` → `ACTIVE`  |  [x]  |
| POST   | `/api/payments/confirm` | Tenant                  | Stripe status `failed`                        | 200 response but `Payment.status` → `FAILED` (not silently `COMPLETED`) |  [x]  |
| POST   | `/api/payments/webhook` | Stripe (public, signed) | Valid signed `payment_intent.succeeded` event |                             200, DB updated                             |  [x]  |
| POST   | `/api/payments/webhook` | Anyone (unsigned)       | Forged/unsigned payload                       |                       400/401, DB **not** updated                       |  [x]  |
| GET    | `/api/payments`         | Tenant                  | Own payment history                           |                         200, only own payments                          |  [x]  |
| GET    | `/api/payments/:id`     | Tenant                  | Own payment                                   |                                   200                                   |  [x]  |
| GET    | `/api/payments/:id`     | Tenant                  | Another tenant's payment                      |                                   403                                   |  [x]  |

### 7.6 Review Module

| Method | Endpoint       | Actor    | Test case                               | Expected | Pass? |
| ------ | -------------- | -------- | --------------------------------------- | :------: | :---: |
| POST   | `/api/reviews` | Tenant   | Rental for this property is `COMPLETED` |   201    |  [x]  |
| POST   | `/api/reviews` | Tenant   | Rental not yet `COMPLETED`              |   403    |  [x]  |
| POST   | `/api/reviews` | Tenant   | Already reviewed this property          |   409    |  [x]  |
| POST   | `/api/reviews` | Tenant   | `rating` outside 1–5                    |   400    |  [x]  |
| POST   | `/api/reviews` | Landlord | —                                       |   403    |  [x]  |

### 7.7 Admin Module

| Method | Endpoint                    | Actor           | Test case                               |                   Expected                   | Pass? |
| ------ | --------------------------- | --------------- | --------------------------------------- | :------------------------------------------: | :---: |
| GET    | `/api/admin/users`          | Admin           | —                                       | 200, array, no `password` field on any user  |  [x]  |
| GET    | `/api/admin/users`          | Tenant/Landlord | —                                       |                     403                      |  [x]  |
| PATCH  | `/api/admin/users/:id`      | Admin           | Ban a tenant                            |            200, `isBanned: true`             |  [x]  |
| PATCH  | `/api/admin/users/:id`      | Admin           | Unban a previously banned user          |            200, `isBanned: false`            |  [x]  |
| PATCH  | `/api/admin/users/:id`      | Admin           | Ban another admin                       |                     403                      |  [x]  |
| PATCH  | `/api/admin/users/:id`      | Admin           | Ban self                                |                     400                      |  [x]  |
| GET    | `/api/admin/properties`     | Admin           | —                                       | 200, includes non-`AVAILABLE` properties too |  [x]  |
| GET    | `/api/admin/rentals`        | Admin           | —                                       |        200, all rentals platform-wide        |  [x]  |
| POST   | `/api/admin/categories`     | Admin           | Valid new category                      |                     201                      |  [x]  |
| POST   | `/api/admin/categories`     | Admin           | Duplicate category name                 |                     409                      |  [x]  |
| POST   | `/api/admin/categories`     | Landlord        | —                                       |                     403                      |  [x]  |
| PUT    | `/api/admin/categories/:id` | Admin           | Valid update                            |                     200                      |  [x]  |
| DELETE | `/api/admin/categories/:id` | Admin           | Category with no properties attached    |                     200                      |  [x]  |
| DELETE | `/api/admin/categories/:id` | Admin           | Category with properties still attached |                     400                      |  [x]  |

### 7.8 Cross-cutting checks across every row above

- [x] Every single row above was actually executed against a running instance of the API — not inferred from reading the controller code.
- [x] No endpoint returns a 200/201 on what should be a failure case (the most common false-pass: an ownership check that's missing, so any logged-in user can edit any resource).
- [x] No endpoint returns a 500 on what should be a clean 400/403/404 (the most common sign of a missing `try/catch` or a missing `catchAsync` wrapper).
- [x] Every list endpoint (`GET /api/properties`, `/api/rentals`, `/api/payments`, `/api/admin/users`, etc.) was tested with **zero results** (e.g. brand-new filter with no matches) to confirm it returns `data: []` and not an error.
- [x] Every endpoint that returns a `User` object anywhere (directly or nested, e.g. `property.landlord`) was checked field-by-field to confirm `password` never appears.

---

## 8. Payment Integration Audit (Stripe) `[§6.5]`

This is the highest-scrutiny section — simulated/fake payments are an automatic zero.

**End-to-end dry run:**

1. [x] Register a tenant, browse properties, submit a rental request.
2. [x] Log in as the landlord who owns that property, approve the request → status becomes `APPROVED`.
3. [x] As the tenant, call `POST /api/payments/create` → confirm a `Payment` row is created with `status: PENDING` and a real Stripe `transactionId`/`client_secret`.
4. [x] Complete the payment using Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC.
5. [x] Confirm via `POST /api/payments/confirm` (or webhook) → `Payment.status` becomes `COMPLETED`, `paidAt` is set, and `RentalRequest.status` flips to `ACTIVE`.
6. [x] `GET /api/payments` and `GET /api/payments/:id` reflect the completed payment.

**Structural checks:**

- [x] `Payment.amount` and `Property.rent` are `Decimal`, not `Float`.
- [x] The webhook route (if implemented) uses `express.raw({ type: 'application/json' })` and is wired **before** the global `express.json()` middleware — confirm by sending a raw test webhook payload with `stripe trigger payment_intent.succeeded` (Stripe CLI) or a manual signed request, and check it isn't silently failing signature verification.
- [x] No code path lets `Payment.status` or `RentalRequest.status` become `COMPLETED`/`ACTIVE` without going through actual Stripe verification (grep for any place these fields are set and confirm each is preceded by a Stripe API call or webhook signature check).
- [x] Stripe keys are read from `process.env`, never hardcoded, and the keys in use are **test/sandbox mode** (`sk_test_...`), not live keys.

---

## 9. Security Audit

| Check                                                                                                                                                                                               |                           Pass?                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------: | --- |
| Passwords are bcrypt-hashed (cost factor 10–12), never returned in any API response                                                                                                                 |                            [x]                             |
| JWT secret is a long random string from `.env`, not a placeholder like `"secret"`                                                                                                                   |                            [x]                             |
| Admin password is not `admin123` or similarly guessable — confirm the actual value used matches what's documented in your submission                                                                |                            [x]                             |
| `SEED_ADMIN_PASSWORD` env var is set in the **production** hosting dashboard, not just locally                                                                                                      |                            [x]                             |
| CORS is enabled but not left wide open to credentials with `*` origin if cookies/auth headers are involved (fine for a token-in-header setup, worth double-checking if you added cookie-based auth) |                            [x]                             |
| Rate limiting present on `/api/auth/login` and `/api/auth/register` (if implemented per the plan's optional recommendation)                                                                         |                            [x]                             |
| No secrets (API keys, DB URL, JWT secret) appear anywhere in git history — `git log -p                                                                                                              | grep -i "sk_test\|sk_live\|postgresql://"` returns nothing | [x] |

---

## 10. API Documentation Audit `[§9 / §11]`

- [x] Every endpoint in the routes files has a corresponding entry in the Postman collection / Swagger doc.
- [x] Every documented endpoint actually exists in the code (no drift in either direction).
- [x] Each documented endpoint includes: method, full path, auth requirement, example request body (where applicable), and at least one example response.
- [x] Postman collection includes environment variables for `{{baseUrl}}` and role-specific tokens.
- [x] The published docs link (Postman Documenter or `/api-docs`) is reachable from a fresh browser/incognito session — not just from your own logged-in Postman account.

---

## 11. Commit History Audit `[§10]`

```bash
git log --oneline | wc -l
git log --oneline
```

| Check                                                                                                                                             | Pass? |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | :---: |
| Total commit count ≥ 20                                                                                                                           |  [x]  |
| No single "add everything" commit that accounts for the majority of the diff                                                                      |  [x]  |
| Messages are descriptive (`feat: implement rental request submission`, not `update`, `fix`, `wip`, `asdf`)                                        |  [x]  |
| Commit history roughly follows the module-by-module sequence in `implementation.md` §10 (schema → auth → each feature → payments → docs → deploy) |  [x]  |

---

## 12. Deployment Audit `[§13]`

- [x] Live API URL is reachable right now (not "was working yesterday") — hit `GET /api/properties` and confirm a 200.
- [x] `prisma migrate deploy` (not `migrate dev`) was used for the production database.
- [x] Production database has been seeded, and the admin credentials work against the **live** URL.
- [x] All required env vars (including `SEED_ADMIN_PASSWORD`, `STRIPE_SECRET_KEY`, `JWT_SECRET`, `DATABASE_URL`) are set in the hosting dashboard.
- [x] API docs link is reachable and matches the deployed API, not a stale local version.
- [x] CORS/HTTPS works from an external tool (Postman, curl) hitting the live URL, not just from your own machine.

---

## 13. Final Submission Checklist (must match README §What to Submit exactly)

- [x] Backend GitHub repo URL — public or shared with the grader, ≥20 commits, `.env` absent, `.env.example` present
- [x] Live API URL — verified reachable at the moment of submission, not just at some earlier point
- [x] API documentation link — Postman Documenter link or live Swagger `/api-docs` URL, verified reachable
- [x] Admin email + password — verified working against the **live** deployment within the last hour before submitting
- [x] Nothing in the repo violates the "no frontend required" scope note (a stray `frontend/` folder isn't harmful, but isn't expected either)

---

## 14. Self-Score Estimate (sanity check against README's marks distribution)

Use this to catch a weak section before the grader does — not a guarantee of the actual grade.

| Marks Category              | Weight | Audit Sections to Re-check | Confident it's solid? |
| --------------------------- | :----: | -------------------------- | :-------------------: |
| API Design & Documentation  |  20%   | §10                        |          [x]          |
| Database Design & Schema    |  20%   | §3                         |          [x]          |
| Commit History              |  10%   | §11                        |          [x]          |
| Error Handling & Validation |  10%   | §4, §5                     |          [x]          |
| Core Functionality          |  20%   | §6, §7 (endpoint matrix)   |          [x]          |
| Payment Integration         |  10%   | §7 (payment rows), §8      |          [x]          |

If any row above is unchecked, that's the section to fix **before** submitting — not after.

---

> **Bottom line**: if every checkbox in Sections 1, 4, 5, 6, 7, and 8 is checked, you've cleared all six of README's zero-marks conditions. Everything else in this document affects the score within the remaining marks, not whether you get graded at all.
