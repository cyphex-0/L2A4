# RentNest 🏠 — Complete Implementation Plan

> **Purpose**: This document is a self-contained, exhaustive blueprint for a coding agent to implement the entire RentNest backend from scratch. Every requirement from both `README.md` and `RentNest.md` is addressed. The agent should execute this step-by-step without needing to re-read the original assignment files.

---

## 0 — Non-Negotiable Rules (MUST NOT Violate — Any Violation = 0 Marks)

> [!CAUTION]
> Violating **any** of the items below results in **0 marks**. The coding agent MUST treat these as hard constraints, not suggestions, throughout the entire implementation.

|  #  | Rule                             | Source            | How to Satisfy                                                                                                                                                                                                                                                                                        |
| :-: | -------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  1  | **API Documentation**            | README §Mandatory | Export a Postman Collection JSON covering **every** endpoint. Place it at `docs/RentNest.postman_collection.json`. Include example request bodies, headers, query params, and saved example responses (success + error). Publish via Postman Documenter for a public link.                            |
|  2  | **Consistent Error Responses**   | README §Mandatory | Every error thrown or returned anywhere in the app must follow the **exact** JSON shape: `{ "success": false, "message": "<human readable>", "errorDetails": <object or null> }`. Never return plain text errors, raw stack traces, or non-JSON bodies.                                               |
|  3  | **20 Meaningful Commits**        | README §Mandatory | Commit after each logical unit of work with descriptive messages (not "fix", "update", "wip"). The final repo must have **≥ 20** backend commits.                                                                                                                                                     |
|  4  | **Server-side Input Validation** | README §Mandatory | Use **Zod** for validation on **every** endpoint that accepts body/params/query. Return proper 400 errors with field-level details inside `errorDetails`.                                                                                                                                             |
|  5  | **Admin Credentials**            | README §Mandatory | Seed the database with a working admin account: email **`admin@rentnest.com`**, password **`RentNest#Admin2026`** (or generate your own strong password — just don't ship a trivially guessable one like `admin123`). Document these in the repo README. Verify they work on the **live** deployment. |
|  6  | **Real Payment Integration**     | README §Mandatory | Integrate **Stripe** for actual payment processing. **NO** fake/simulated/COD/pay-later flows. Include endpoints for creating payment intents/sessions, confirming payments, and tracking payment status. Use Stripe **test/sandbox mode** keys.                                                      |
|  7  | **No Plagiarism**                | README §Important | All code must be original.                                                                                                                                                                                                                                                                            |
|  8  | **No Frontend Required**         | README §Key Rules | Backend-only. Test via Postman/Thunder Client.                                                                                                                                                                                                                                                        |
|  9  | **Exactly 3 Fixed Roles**        | RentNest §Roles   | Tenant, Landlord, Admin. User selects role at registration. Admin cannot self-register.                                                                                                                                                                                                               |

**Payment provider decision (locked in):** This project uses **Stripe** exclusively. Stripe is used for its cleaner sandbox/test-mode flow and no merchant verification needed. Do not implement SSLCommerz alongside it.

---

## 1 — Tech Stack (Fixed by README — Do Not Deviate)

| Layer            | Technology               | Notes                                                                                                 |
| ---------------- | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| Runtime          | **Node.js**              | LTS version                                                                                           |
| Framework        | **Express.js**           | REST API                                                                                              |
| Language         | **TypeScript**           | Strict mode (`"strict": true`). README says "recommended" — treat as required for code quality marks. |
| Database         | **PostgreSQL**           | Hosted on free tier: Neon, Supabase, or Railway                                                       |
| ORM              | **Prisma**               | Schema, migrations, seed script — all required                                                        |
| Auth             | **JWT**                  | Access tokens with `jsonwebtoken`                                                                     |
| Validation       | **Zod**                  | Schema-level validation on all endpoints                                                              |
| Payments         | **Stripe**               | `stripe` npm package, real sandbox/test-mode                                                          |
| Password Hashing | **bcrypt**               | `bcryptjs` npm package                                                                                |
| Env Management   | **dotenv**               | `.env` for secrets                                                                                    |
| HTTP Security    | **helmet**               | Basic security headers                                                                                |
| CORS             | **cors**                 | Open, since no frontend origin is fixed                                                               |
| Logging          | **morgan**               | Dev format for debugging during development                                                           |
| Rate Limiting    | **express-rate-limit**   | On `/api/auth/login` and `/api/auth/register` (nice-to-have, cheap to add)                            |
| Deployment       | **Vercel** or **Render** | Live API URL required. Render recommended for Express+Prisma apps.                                    |

---

## 2 — Project Structure

```
rentnest-backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                    # Seeds admin + categories + sample data
├── src/
│   ├── app.ts                     # Express app setup, middleware wiring, routes
│   ├── server.ts                  # Entry point, listen on PORT
│   ├── config/
│   │   ├── index.ts               # Validated env vars (Zod), constants
│   │   └── stripe.ts              # Stripe SDK initialization
│   ├── middleware/
│   │   ├── auth.ts                # JWT verification middleware (verifyJWT)
│   │   ├── authorize.ts           # Role-based access control
│   │   ├── validateRequest.ts     # Generic Zod schema validator middleware
│   │   ├── globalErrorHandler.ts  # Centralized error handler → structured JSON
│   │   └── notFound.ts            # 404 handler → structured JSON
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts    # Zod schemas
│   │   ├── user/
│   │   │   ├── user.routes.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.validation.ts
│   │   ├── property/
│   │   │   ├── property.routes.ts
│   │   │   ├── property.controller.ts
│   │   │   ├── property.service.ts
│   │   │   └── property.validation.ts
│   │   ├── category/
│   │   │   ├── category.routes.ts
│   │   │   ├── category.controller.ts
│   │   │   ├── category.service.ts
│   │   │   └── category.validation.ts
│   │   ├── rental/
│   │   │   ├── rental.routes.ts
│   │   │   ├── rental.controller.ts
│   │   │   ├── rental.service.ts
│   │   │   └── rental.validation.ts
│   │   ├── payment/
│   │   │   ├── payment.routes.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.service.ts
│   │   │   └── payment.validation.ts
│   │   ├── review/
│   │   │   ├── review.routes.ts
│   │   │   ├── review.controller.ts
│   │   │   ├── review.service.ts
│   │   │   └── review.validation.ts
│   │   └── admin/
│   │       ├── admin.routes.ts
│   │       ├── admin.controller.ts
│   │       ├── admin.service.ts
│   │       └── admin.validation.ts
│   ├── errors/
│   │   ├── AppError.ts            # Custom error class with statusCode + errorDetails
│   │   └── handleZodError.ts      # Zod error formatter
│   ├── utils/
│   │   ├── sendResponse.ts        # Standardized success response helper
│   │   ├── catchAsync.ts          # Wraps async controllers, forwards errors to next()
│   │   └── pick.ts                # Query param picker utility
│   └── types/
│       └── index.d.ts             # Express Request augmentation (req.user)
├── docs/
│   └── RentNest.postman_collection.json
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md                      # Admin creds, setup instructions, live URL, docs link
```

**Rationale:** A "module per domain" structure (controller/service/routes/validation colocated) makes the 20-commit history naturally granular and keeps grading easy to trace.

---

## 3 — Database Schema (Prisma)

`RentNest.md` lists 6 required tables (Users, Properties, Categories, RentalRequests, Payments, Reviews) but leaves exact fields to the implementer. Below is the concrete schema.

### 3.1 Enums

```prisma
enum Role {
  TENANT
  LANDLORD
  ADMIN
}

enum PropertyStatus {
  AVAILABLE
  RENTED
  MAINTENANCE
}

enum RentalStatus {
  PENDING
  APPROVED
  REJECTED
  ACTIVE       // After payment confirmed
  COMPLETED    // After move-out / landlord marks complete
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
}

enum PaymentProvider {
  STRIPE
}
```

### 3.2 Models

#### User

```prisma
model User {
  id             String          @id @default(uuid())
  name           String
  email          String          @unique
  password       String          // bcrypt hashed, NEVER returned in responses
  role           Role
  phone          String?
  address        String?
  profileImage   String?
  isBanned       Boolean         @default(false)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  properties     Property[]      // Landlord's listings
  rentalRequests RentalRequest[] // Tenant's requests
  reviews        Review[]
  payments       Payment[]
}
```

#### Category

```prisma
model Category {
  id          String     @id @default(uuid())
  name        String     @unique   // Apartment, House, Studio, Condo, etc.
  description String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  properties  Property[]
}
```

#### Property

```prisma
model Property {
  id            String          @id @default(uuid())
  title         String
  description   String
  location      String
  address       String
  rent          Decimal         @db.Decimal(10, 2)  // Monthly rent amount — Decimal, not Float, to avoid floating-point rounding errors on money
  bedrooms      Int
  bathrooms     Int
  area          Float           // sq ft
  amenities     String[]        // Array of amenity strings e.g. ["wifi","parking"]
  images        String[]        // Array of image URLs
  status        PropertyStatus  @default(AVAILABLE)
  categoryId    String
  landlordId    String
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  category       Category        @relation(fields: [categoryId], references: [id])
  landlord       User            @relation(fields: [landlordId], references: [id])
  rentalRequests RentalRequest[]
  reviews        Review[]

  @@index([location])
  @@index([rent])
}
```

#### RentalRequest

```prisma
model RentalRequest {
  id            String        @id @default(uuid())
  tenantId      String
  propertyId    String
  moveInDate    DateTime
  moveOutDate   DateTime
  message       String?       // Optional message from tenant
  status        RentalStatus  @default(PENDING)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  tenant        User          @relation(fields: [tenantId], references: [id])
  property      Property      @relation(fields: [propertyId], references: [id])
  payment       Payment?

  @@index([status])
}
```

#### Payment

```prisma
model Payment {
  id              String          @id @default(uuid())
  transactionId   String          @unique  // Stripe payment intent/session ID
  rentalRequestId String          @unique
  tenantId        String
  amount          Decimal         @db.Decimal(10, 2)  // Decimal, not Float — avoids floating-point rounding errors on money
  method          String          // "card", "bank_transfer", etc.
  provider        PaymentProvider // STRIPE
  status          PaymentStatus   @default(PENDING)
  paidAt          DateTime?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  rentalRequest   RentalRequest   @relation(fields: [rentalRequestId], references: [id])
  tenant          User            @relation(fields: [tenantId], references: [id])
}
```

#### Review

```prisma
model Review {
  id            String    @id @default(uuid())
  rating        Int       // 1-5, enforce in validation layer
  comment       String
  tenantId      String
  propertyId    String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  tenant        User      @relation(fields: [tenantId], references: [id])
  property      Property  @relation(fields: [propertyId], references: [id])

  @@unique([tenantId, propertyId]) // One review per tenant per property
}
```

### 3.3 Seed Script (`prisma/seed.ts`)

The seed script **MUST**:

1. Create admin user: `admin@rentnest.com` / `RentNest#Admin2026` (bcrypt hashed), role `ADMIN`. Read the password from an env var (e.g. `SEED_ADMIN_PASSWORD`) rather than hardcoding it in source, so it isn't sitting in plaintext in git history.
2. Create default property categories: `Apartment`, `House`, `Studio`, `Condo`, `Duplex`, `Villa`
3. Create 2+ sample landlords, 2+ sample tenants with sample properties
4. Optionally create at least one full rental → payment → review chain so the grader can immediately see data

**Verification for this section:**

- [ ] `npx prisma migrate dev` runs clean, migration files committed
- [ ] `npx prisma db seed` populates all required data
- [ ] Admin login works immediately after seeding
- [ ] `RentalRequest.status` and `Payment.status` transitions are only changed through service functions (protects against status-tampering)

---

## 4 — Standardized Response Format

### 4.1 Success Response (`utils/sendResponse.ts`)

```json
{
  "success": true,
  "message": "Properties retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  },
  "data": { ... }
}
```

- `meta` is optional, included only for paginated results.

### 4.2 Error Response (MANDATORY FORMAT — `{ success, message, errorDetails }`)

```json
{
  "success": false,
  "message": "Validation error",
  "errorDetails": {
    "issues": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

- `errorDetails` is an object or `null` — never omitted from the shape.
- Every `throw` in services/controllers must use `AppError` (custom error class). No raw `Error` objects may escape to the client.

---

## 5 — Middleware Implementation Details

### 5.1 Auth Middleware (`auth.ts`)

```
1. Extract token from Authorization header: "Bearer <token>"
2. If no token → 401 { success: false, message: "You are not authorized", errorDetails: null }
3. Verify token with jwt.verify()
4. Find user by decoded userId from DB
5. If user not found → 401
6. If user isBanned === true → 403 "Your account has been banned"
   (Re-check ban status on EVERY request, not just login — needed because Admin can ban mid-session)
7. Attach user to req.user = { userId, role, email, name }
8. Call next()
```

### 5.2 Role Authorization Middleware (`authorize.ts`)

```
authorize(...roles: Role[])
1. Return middleware that checks if req.user.role is in allowed roles
2. If not → 403 "You do not have permission to perform this action"
```

### 5.3 Validation Middleware (`validateRequest.ts`)

```
validateRequest(schema: { body?: ZodSchema, params?: ZodSchema, query?: ZodSchema })
1. Validate req.body / req.params / req.query against provided Zod schemas
2. If validation fails → format errors into field-level issues and throw 400 with errorDetails
3. Replace req.body/params/query with parsed (sanitized) data
4. Call next()
```

- Validate **path params** too (e.g. `:id` must be a valid UUID) to avoid Prisma throwing malformed-input errors.
- Apply validation middleware on the route definition, e.g.:
  ```ts
  router.post(
    "/",
    verifyJWT,
    authorize("TENANT"),
    validateRequest(createRentalRequestSchema),
    rentalController.create,
  );
  ```

### 5.4 Global Error Handler (`globalErrorHandler.ts`)

```
1. Catch ALL errors thrown anywhere in the app
2. Determine error type:
   - ZodError → format into field-level issues, status 400
   - Prisma known errors (P2002 unique constraint → 409, P2025 not found → 404, etc.)
   - AppError (custom) → use status and message from error
   - JWT errors (TokenExpiredError, JsonWebTokenError) → 401
   - Unknown → 500 "Internal server error"
3. ALWAYS respond with: { success: false, message, errorDetails }
4. In development (NODE_ENV=development): include stack trace in errorDetails
5. In production: exclude stack traces, never leak internals
```

- Must be registered **last**, after all routes.

### 5.5 Not Found Handler (`notFound.ts`)

```
1. Catch any request that doesn't match any route
2. Return 404: { success: false, message: "API endpoint not found", errorDetails: null }
```

- Registered right before the global error handler.

### 5.6 catchAsync (`utils/catchAsync.ts`)

- Wraps every async controller so thrown errors / rejected promises are forwarded to `next(err)` instead of crashing the process or hanging the request.

---

## 6 — API Implementation: Endpoint-by-Endpoint

### 6.1 Authentication Module

#### POST `/api/auth/register`

- **Access**: Public
- **Validation** (Zod):
  - `name`: string, min 2 chars, required
  - `email`: valid email format, required
  - `password`: string, min 6 chars, required
  - `role`: enum `TENANT` | `LANDLORD`, required (**ADMIN cannot self-register** — reject with 400)
  - `phone`: optional string
  - `address`: optional string
- **Logic**:
  1. Check if email already exists → 409 Conflict
  2. Hash password with bcrypt (salt rounds: 12)
  3. Create user in DB
  4. Generate JWT
  5. Return user data (exclude password field) + JWT token
- **Business Rules**:
  - Registration with `role: "ADMIN"` must return a 400 validation error (prevents privilege escalation)
  - Admin accounts are only created via seed script

#### POST `/api/auth/login`

- **Access**: Public
- **Validation** (Zod):
  - `email`: valid email, required
  - `password`: string, required
- **Logic**:
  1. Find user by email → 404 if not found
  2. Check if user is banned → 403 "Your account has been banned"
  3. Compare password with bcrypt → 401 if mismatch
  4. Generate JWT (payload: `{ userId, role, email }`, expiry: `7d` configurable via env)
  5. Return user data (exclude password) + token

#### GET `/api/auth/me`

- **Access**: Authenticated (any role)
- **Logic**: Return current user from `req.user` (populated by auth middleware), password stripped

---

### 6.2 Property Module (Public)

#### GET `/api/properties`

- **Access**: Public
- **Query Params** (all optional, validated by Zod):
  - `location`: string (partial match / case-insensitive `contains`)
  - `minPrice`: number
  - `maxPrice`: number
  - `categoryId`: string (filter by category)
  - `bedrooms`: number
  - `amenities`: comma-separated string
  - `page`: number (default: 1)
  - `limit`: number (default: 10, max: 100)
  - `sortBy`: string (default: `createdAt`)
  - `sortOrder`: `asc` | `desc` (default: `desc`)
- **Logic**:
  1. Build Prisma `where` clause dynamically from query params
  2. For public view: **only show `AVAILABLE` properties**
  3. Include category name and landlord name in response
  4. Return paginated results with `meta` object

#### GET `/api/properties/:id`

- **Access**: Public
- **Validation**: `id` must be valid UUID
- **Logic**:
  1. Find property by id, include category, landlord (name, email), reviews (with tenant name)
  2. Return 404 if not found

#### GET `/api/categories`

- **Access**: Public
- **Logic**: Return all categories

---

### 6.3 Landlord Management Module

> All endpoints require `LANDLORD` role.

#### POST `/api/landlord/properties`

- **Access**: Authenticated + LANDLORD
- **Validation** (Zod):
  - `title`: string, min 5, max 200, required
  - `description`: string, min 20, required
  - `location`: string, required
  - `address`: string, required
  - `rent`: positive number, required
  - `bedrooms`: positive integer, required
  - `bathrooms`: positive integer, required
  - `area`: positive number, required
  - `amenities`: array of strings, optional (default: [])
  - `images`: array of URL strings, optional (default: [])
  - `categoryId`: valid UUID, required
- **Logic**:
  1. Verify categoryId exists → 404 if not
  2. Create property with `landlordId` set to `req.user.userId`
  3. Return created property

#### PUT `/api/landlord/properties/:id`

- **Access**: Authenticated + LANDLORD
- **Validation**: Same fields as create, but all optional (partial update)
- **Logic**:
  1. Find property by id → 404 if not found
  2. Verify ownership: `property.landlordId === req.user.userId` → 403 if not owner
  3. Update and return

#### DELETE `/api/landlord/properties/:id`

- **Access**: Authenticated + LANDLORD
- **Logic**:
  1. Find property → 404 if not found
  2. Verify ownership → 403 if not owner
  3. Check for active rental requests → 400 if active rentals exist
  4. Delete property (or soft delete)
  5. Return success message

#### GET `/api/landlord/requests`

- **Access**: Authenticated + LANDLORD
- **Logic**:
  1. Find all rental requests where property belongs to this landlord
  2. Include tenant info and property info
  3. Support pagination and filtering by status
  4. Return results

#### PATCH `/api/landlord/requests/:id`

- **Access**: Authenticated + LANDLORD
- **Validation** (Zod):
  - `status`: enum `APPROVED` | `REJECTED`, required
- **Logic**:
  1. Find rental request → 404 if not found
  2. Verify the property belongs to this landlord → 403
  3. Verify request is currently `PENDING` → 400 if already processed
  4. Update status
  5. On approve: do **NOT** mark ACTIVE yet — that happens after payment confirmation (per RentNest.md status flow diagram)
  6. Return updated request

#### PATCH `/api/landlord/requests/:id/complete`

- **Access**: Authenticated + LANDLORD
- **Logic**:
  1. Find rental request → 404
  2. Verify the property belongs to this landlord → 403
  3. Verify request is currently `ACTIVE` → 400 if not active
  4. Update status to `COMPLETED`
  5. Return updated request
- **Rationale**: RentNest.md's flow shows `ACTIVE → COMPLETED` but provides no explicit endpoint for this transition. Without it, reviews (which require `COMPLETED` status) are unreachable. This endpoint closes that gap.

---

### 6.4 Rental Request Module

#### POST `/api/rentals`

- **Access**: Authenticated + TENANT
- **Validation** (Zod):
  - `propertyId`: valid UUID, required
  - `moveInDate`: valid future date, required
  - `moveOutDate`: valid date, must be after moveInDate, required
  - `message`: optional string, max 500 chars
- **Logic**:
  1. Verify property exists and is `AVAILABLE` → 404/400
  2. Check tenant doesn't already have a PENDING/APPROVED/ACTIVE request for same property → 409
  3. Create rental request with status `PENDING`
  4. Return created request

#### GET `/api/rentals`

- **Access**: Authenticated (TENANT sees own requests; LANDLORD sees requests for own properties)
- **Query Params**: `status`, `page`, `limit`
- **Logic**: Filter by user role (server-side `req.user.id`, never trust client-supplied tenantId) and return paginated results with property details

#### GET `/api/rentals/:id`

- **Access**: Authenticated
- **Logic**:
  1. Find rental request → 404
  2. Verify the requester is the tenant who made it OR the landlord who owns the property → 403
  3. Return with property and payment details

---

### 6.5 Payment Module (Stripe)

> [!IMPORTANT]
> **This is a MANDATORY section.** Simulated/fake payments = 0 marks. No endpoint or admin action can directly set `Payment.status = COMPLETED` without going through the Stripe verification step.

**Setup:**

- `npm install stripe`
- `config/stripe.ts` initializes `new Stripe(process.env.STRIPE_SECRET_KEY)`
- All Stripe secret keys live in `.env`, never hardcoded, `.env` is git-ignored, `.env.example` documents required keys

#### POST `/api/payments/create`

- **Access**: Authenticated + TENANT
- **Validation** (Zod):
  - `rentalRequestId`: valid UUID, required
- **Logic**:
  1. Find rental request → 404
  2. Verify it belongs to the requesting tenant → 403
  3. Verify rental status is `APPROVED` → 400 "Rental must be approved before payment"
  4. Check no existing completed payment for this rental → 409
  5. Get the property rent amount (Prisma returns `rent` as a `Decimal` object — convert with `Number(rent)` before doing arithmetic)
  6. Call **Stripe API**: `stripe.paymentIntents.create({ amount: Math.round(Number(rent) * 100), currency: 'usd', metadata: { rentalRequestId, tenantId } })`
  7. Create Payment record in DB with `status: PENDING`, `transactionId = paymentIntent.id`
  8. Return `{ clientSecret: paymentIntent.client_secret, paymentId: payment.id }`

#### POST `/api/payments/confirm`

- **Access**: Authenticated + TENANT
- **Implementation**: Manual confirmation endpoint (primary approach):
  - Accepts `{ paymentId }` or `{ stripePaymentIntentId }`
  - Retrieves payment intent from Stripe API, checks its status
  - If `succeeded`: update Payment status to `COMPLETED`, set `paidAt = now`, update RentalRequest status to `ACTIVE`
  - If `failed` or other: update Payment status to `FAILED`
- **Rationale**: Webhooks are hard to trigger deterministically in local/sandboxed testing. This endpoint gives a reliable manual "confirm" call for grading verification.

#### POST `/api/payments/webhook` (Optional but recommended)

- **Access**: Public (Stripe calls this)
- **CRITICAL — raw body wiring**: Stripe's signature verification (`stripe.webhooks.constructEvent`) needs the _unparsed_ raw request body, not JSON. In `app.ts`:
  1. Register this specific route with its own `express.raw({ type: 'application/json' })` middleware: `app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookController);`
  2. Register that line **before** the app-wide `app.use(express.json())` call for all other routes. Order matters here — if the global JSON parser runs first (because it was `app.use()`'d earlier and matches this path too), it will have already consumed and parsed the stream, and the raw body will be empty by the time this route's handler runs.
  3. A common layout: define the webhook route (with its raw-body middleware) immediately after creating the `app`, then apply `express.json()` afterward for everything else.
- **Logic**:
  1. Verify webhook signature with `stripe.webhooks.constructEvent` using `STRIPE_WEBHOOK_SECRET`
  2. Handle `payment_intent.succeeded`: update Payment status to `COMPLETED`, `paidAt = now`, RentalRequest status to `ACTIVE`
  3. Handle `payment_intent.payment_failed`: update Payment status to `FAILED`

#### GET `/api/payments`

- **Access**: Authenticated + TENANT
- **Logic**: Return all payments for the logged-in tenant, including rental request and property details. Support pagination.

#### GET `/api/payments/:id`

- **Access**: Authenticated + TENANT (must be their payment)
- **Logic**: Return payment details with associated rental request and property info

**Payment hard constraints:**

- [ ] `RentalRequest.status` only becomes `ACTIVE` after a verified Stripe payment
- [ ] Payment status transitions happen only through Stripe verification, never by direct client input
- [ ] Use Stripe **test/sandbox mode** keys — document for grader to use test card `4242 4242 4242 4242`

---

### 6.6 Review Module

#### POST `/api/reviews`

- **Access**: Authenticated + TENANT
- **Validation** (Zod):
  - `propertyId`: valid UUID, required
  - `rating`: integer, min 1, max 5, required
  - `comment`: string, min 10, max 1000, required
- **Logic**:
  1. Verify property exists → 404
  2. Verify tenant has a `COMPLETED` rental for this property → 403 "You can only review after a completed rental"
  3. Check tenant hasn't already reviewed this property → 409 (enforced by `@@unique([tenantId, propertyId])`)
  4. Create review
  5. Return created review

---

### 6.7 Admin Module

> All endpoints require `ADMIN` role.

#### GET `/api/admin/users`

- **Access**: Authenticated + ADMIN
- **Query Params**: `role`, `isBanned`, `search` (name/email), `page`, `limit`
- **Logic**: Return all users (excluding password field), paginated, with filters

#### PATCH `/api/admin/users/:id`

- **Access**: Authenticated + ADMIN
- **Validation** (Zod):
  - `isBanned`: boolean, required
- **Logic**:
  1. Find user → 404
  2. Prevent banning other admins → 403
  3. Prevent self-ban → 400
  4. Update `isBanned` status
  5. Banning immediately invalidates the user's ability to authenticate (checked in `verifyJWT` on every request — see §5.1)
  6. Return updated user

#### GET `/api/admin/properties`

- **Access**: Authenticated + ADMIN
- **Logic**: Return ALL properties (including non-available), paginated, with landlord and category info

#### GET `/api/admin/rentals`

- **Access**: Authenticated + ADMIN
- **Logic**: Return ALL rental requests, paginated, with tenant, property, and payment info

#### Admin Category Management (Required — RentNest.md lists "manage categories" under Admin permissions)

- **POST `/api/admin/categories`** — Create category (name, description). Validation: name required, unique.
- **PUT `/api/admin/categories/:id`** — Update category
- **DELETE `/api/admin/categories/:id`** — Delete category (only if no properties currently use it, else 400)

---

## 7 — Role-Based Access Control Matrix

| Endpoint Group                        |             Tenant             |           Landlord            |          Admin           |
| ------------------------------------- | :----------------------------: | :---------------------------: | :----------------------: |
| Browse properties/categories (public) |               ✅               |              ✅               |            ✅            |
| Create/edit/delete own property       |               ❌               |         ✅ (own only)         | ✅ (any, for moderation) |
| Submit rental request                 |               ✅               |              ❌               |            ❌            |
| Approve/reject rental request         |               ❌               |   ✅ (own properties only)    |            ✅            |
| Mark rental as completed              |               ❌               |   ✅ (own properties only)    |            ✅            |
| Make payment                          |     ✅ (own request only)      |              ❌               |            ❌            |
| View payment history                  |            ✅ (own)            | ✅ (own properties' payments) |         ✅ (all)         |
| Leave review                          | ✅ (own completed rental only) |              ❌               |            ❌            |
| Ban/unban users                       |               ❌               |              ❌               |            ✅            |
| View all users/properties/rentals     |               ❌               |              ❌               |            ✅            |
| Manage categories                     |               ❌               |              ❌               |            ✅            |

---

## 8 — Input Validation Details (Per Module)

Every module gets a `*.validation.ts` file with Zod schemas. Every POST/PUT/PATCH route **must** have a validation middleware attached. The agent should grep routes files to confirm none are missing `validateRequest(...)`.

| Module                  | Schema                     | Key Rules                                                                             |
| ----------------------- | -------------------------- | ------------------------------------------------------------------------------------- |
| Auth - Register         | `registerSchema`           | name required min 2, email valid, password min 6, role enum TENANT/LANDLORD only      |
| Auth - Login            | `loginSchema`              | email valid, password required                                                        |
| Property - Create       | `createPropertySchema`     | title min 5 max 200, description min 20, location required, rent > 0, categoryId UUID |
| Property - Update       | `updatePropertySchema`     | Same fields, all optional (partial update)                                            |
| Property - Query        | `propertyQuerySchema`      | location string, minPrice/maxPrice number, page/limit positive int                    |
| Rental - Create         | `createRentalSchema`       | propertyId UUID, moveInDate future date, moveOutDate after moveInDate                 |
| Rental - Approve/Reject | `updateRentalStatusSchema` | status enum APPROVED/REJECTED                                                         |
| Payment - Create        | `createPaymentSchema`      | rentalRequestId UUID                                                                  |
| Payment - Confirm       | `confirmPaymentSchema`     | paymentId or stripePaymentIntentId                                                    |
| Review - Create         | `createReviewSchema`       | propertyId UUID, rating int 1-5, comment min 10 max 1000                              |
| Admin - Ban/Unban       | `updateUserStatusSchema`   | isBanned boolean                                                                      |
| Admin - Category        | `createCategorySchema`     | name required unique, description optional                                            |
| Params                  | `uuidParamSchema`          | `:id` must be valid UUID (apply to all `:id` routes)                                  |

---

## 9 — Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@host:5432/rentnest

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Bcrypt
BCRYPT_SALT_ROUNDS=12
```

- Provide a `.env.example` with all keys (no values) for documentation.
- `config/index.ts` (or `config/env.ts`) validates presence of all required env vars at boot using Zod. **Fail fast** with a clear console error if any are missing (prevents mysterious 500s post-deploy).

---

## 10 — Commit Strategy (≥ 20 Commits)

> [!IMPORTANT]
> The coding agent MUST make incremental commits with descriptive messages. Each commit should be a real, working increment.

|  #  | Commit Message                                                            | Scope                                                 |
| :-: | ------------------------------------------------------------------------- | ----------------------------------------------------- |
|  1  | `chore: initialize project with TypeScript and Express`                   | package.json, tsconfig, .gitignore, initial server.ts |
|  2  | `chore: add Prisma and configure database connection`                     | prisma init, schema stub                              |
|  3  | `feat: define complete Prisma schema with all models and enums`           | All models, enums, relations, indexes                 |
|  4  | `feat: run initial Prisma migration`                                      | Migration files                                       |
|  5  | `feat: create seed script with admin user, categories, and sample data`   | prisma/seed.ts                                        |
|  6  | `feat: add global error handler, AppError class, and catchAsync utility`  | errors/, globalErrorHandler                           |
|  7  | `feat: add standardized response utilities (sendResponse, pick)`          | utils/                                                |
|  8  | `feat: implement JWT auth middleware and role-based authorize middleware` | middleware/auth.ts, authorize.ts                      |
|  9  | `feat: add Zod validation middleware`                                     | middleware/validateRequest.ts                         |
| 10  | `feat: implement user registration endpoint with validation`              | auth module register                                  |
| 11  | `feat: implement login and get-me endpoints`                              | auth module login + me                                |
| 12  | `feat: implement public property listing with filters and pagination`     | property module GET                                   |
| 13  | `feat: implement public property details and categories endpoints`        | property/:id, categories                              |
| 14  | `feat: implement landlord property CRUD (create, update, delete)`         | landlord property endpoints                           |
| 15  | `feat: implement rental request submission and retrieval`                 | rental module                                         |
| 16  | `feat: implement landlord approve/reject rental requests`                 | landlord request management                           |
| 17  | `feat: implement landlord mark rental as completed`                       | landlord complete endpoint                            |
| 18  | `feat: integrate Stripe payment — create intent endpoint`                 | payment create                                        |
| 19  | `feat: implement payment confirmation and history endpoints`              | payment confirm + GET                                 |
| 20  | `feat: implement review creation with completed-rental guard`             | review module                                         |
| 21  | `feat: implement admin user management (list, ban/unban)`                 | admin module users                                    |
| 22  | `feat: implement admin property and rental oversight endpoints`           | admin property/rental                                 |
| 23  | `feat: implement admin category management (CRUD)`                        | admin categories                                      |
| 24  | `feat: add 404 handler, CORS, helmet, morgan, rate limiting`              | middleware finalization                               |
| 25  | `docs: add Postman collection, project README with admin credentials`     | docs/, README                                         |
| 26  | `chore: add .env.example and deployment configuration`                    | Final cleanup                                         |

---

## 11 — API Documentation (Postman Collection)

The exported Postman collection **MUST** include:

1. **Organized folders**: Auth, Properties (Public), Landlord, Rentals, Payments, Reviews, Admin
2. **Environment variables**: `{{baseUrl}}`, `{{token}}`, `{{adminToken}}`, `{{landlordToken}}`, `{{tenantToken}}`
3. **For each endpoint**:
   - Complete URL with path/query parameters
   - Request body examples (where applicable)
   - Authorization header setup (`Bearer {{token}}`)
   - Description of what the endpoint does
   - Saved example responses (success + at least one error case)
4. **Pre-request scripts** (recommended): Auto-set token after login
5. **Publish** via Postman Documenter for a public `documenter.getpostman.com` link
6. **Export** raw collection JSON into `docs/RentNest.postman_collection.json` in the repo

**Cross-check:** Walk the docs top-to-bottom and confirm every implemented route is documented and every documented route is implemented (no drift).

---

## 12 — README.md for the Repository

The repo README must include:

```markdown
# RentNest Backend API 🏠

## Live URL

https://rentnest-api.onrender.com (or Vercel URL)

## Admin Credentials

- Email: admin@rentnest.com
- Password: RentNest#Admin2026

## Tech Stack

- Node.js, Express, TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- Stripe Payment Integration (test/sandbox mode)
- Zod Validation

## Setup Instructions

1. Clone the repo
2. npm install
3. Copy .env.example to .env and fill in values
4. npx prisma migrate dev
5. npx prisma db seed
6. npm run dev

## API Documentation

[Postman Collection](link-to-postman-documenter)

## Stripe Test Card

Use `4242 4242 4242 4242` with any future expiry and any CVC for test payments.
```

---

## 13 — Deployment Checklist

- [ ] Choose **Render** (recommended) or Vercel; provision Postgres (Neon/Supabase/Render Postgres)
- [ ] Push code to GitHub
- [ ] Set **all** env vars in the hosting dashboard (never commit `.env`) — **including `SEED_ADMIN_PASSWORD`**, since the seed script reads the admin password from this env var rather than hardcoding it; forgetting to set it will make the production seed either fail or fall back to an unintended default
- [ ] Run `prisma migrate deploy` (not `migrate dev`) as part of the build/start command in production
- [ ] Run seed script against production DB so admin credentials work on the live URL (confirm it used the value from `SEED_ADMIN_PASSWORD`, not a stray local default)
- [ ] Confirm CORS/HTTPS works from a plain `curl`/Postman call to the live URL
- [ ] Verify live API responds correctly — test admin login on live URL
- [ ] Verify API docs URL is accessible

---

## 14 — Testing & Verification Plan (Do This Before Submission)

### 14.1 Automated Checks

```bash
# 1. TypeScript compilation check
npx tsc --noEmit

# 2. Prisma schema validation
npx prisma validate

# 3. Run database migration
npx prisma migrate dev --name init

# 4. Seed the database
npx prisma db seed

# 5. Start the server
npm run dev
```

### 14.2 Manual Endpoint Verification (Postman)

| Endpoint                            | Test Case                       | Expected                              |
| ----------------------------------- | ------------------------------- | ------------------------------------- |
| POST /api/auth/register             | Valid tenant registration       | 201 + user data + token               |
| POST /api/auth/register             | Duplicate email                 | 409 error response                    |
| POST /api/auth/register             | Missing fields                  | 400 with field-level errors           |
| POST /api/auth/register             | Role = ADMIN                    | 400 validation error                  |
| POST /api/auth/login                | Valid credentials               | 200 + token                           |
| POST /api/auth/login                | Wrong password                  | 401 error                             |
| POST /api/auth/login                | Banned user                     | 403 error                             |
| GET /api/auth/me                    | With valid token                | 200 + user data (no password)         |
| GET /api/auth/me                    | No token                        | 401 error                             |
| GET /api/properties                 | No filters                      | 200 + paginated list (AVAILABLE only) |
| GET /api/properties                 | With location filter            | 200 + filtered results                |
| GET /api/properties/:id             | Valid ID                        | 200 + property details with reviews   |
| GET /api/properties/:id             | Invalid ID                      | 404 error                             |
| GET /api/categories                 | —                               | 200 + category list                   |
| POST /api/landlord/properties       | Valid property (as landlord)    | 201 + property                        |
| POST /api/landlord/properties       | As tenant                       | 403 error                             |
| PUT /api/landlord/properties/:id    | Own property                    | 200 + updated                         |
| PUT /api/landlord/properties/:id    | Other's property                | 403 error                             |
| DELETE /api/landlord/properties/:id | Own property, no active rentals | 200 + deleted                         |
| POST /api/rentals                   | Valid request (as tenant)       | 201 + rental request                  |
| POST /api/rentals                   | Duplicate pending request       | 409 error                             |
| GET /api/rentals                    | Tenant's own requests           | 200 + list                            |
| PATCH /api/landlord/requests/:id    | Approve (pending request)       | 200 + approved                        |
| PATCH /api/landlord/requests/:id    | Already processed request       | 400 error                             |
| POST /api/payments/create           | Approved rental                 | 200 + clientSecret                    |
| POST /api/payments/create           | Non-approved rental             | 400 error                             |
| POST /api/payments/confirm          | Valid payment                   | 200 + completed                       |
| GET /api/payments                   | Tenant's payments               | 200 + list                            |
| GET /api/payments/:id               | Own payment                     | 200 + details                         |
| POST /api/reviews                   | After completed rental          | 201 + review                          |
| POST /api/reviews                   | Without completed rental        | 403 error                             |
| POST /api/reviews                   | Duplicate review                | 409 error                             |
| GET /api/admin/users                | As admin                        | 200 + user list                       |
| GET /api/admin/users                | As tenant                       | 403 error                             |
| PATCH /api/admin/users/:id          | Ban user                        | 200 + banned                          |
| PATCH /api/admin/users/:id          | Ban another admin               | 403 error                             |
| GET /api/admin/properties           | As admin                        | 200 + all properties                  |
| GET /api/admin/rentals              | As admin                        | 200 + all rentals                     |
| POST /api/admin/categories          | Create category                 | 201 + category                        |
| DELETE /api/admin/categories/:id    | Category with properties        | 400 error                             |
| GET /nonexistent                    | Any                             | 404 structured error                  |

### 14.3 Critical Flow Verifications

1. **Error format spot-check:** Intentionally trigger 400, 401, 403, 404, 409, 500 and confirm ALL use the exact `{ success, message, errorDetails }` shape.

2. **Payment end-to-end dry run:**
   - Tenant registers → browses property → submits request
   - Landlord approves request
   - Tenant creates payment session → complete payment with Stripe test card `4242 4242 4242 4242`
   - Confirm payment → `RentalRequest.status` flips to `ACTIVE`
   - Payment history shows `COMPLETED`

3. **Review flow:**
   - Landlord marks rental as `COMPLETED` via `/api/landlord/requests/:id/complete`
   - Tenant leaves review → success
   - Tenant attempts duplicate review → 409 rejected

4. **Ban flow:**
   - Admin bans a tenant mid-session
   - Banned tenant's existing JWT is rejected on next request (403), not just blocked at login

5. **Deployment smoke test:** Hit the **live** deployed URL for: register, login, get properties, admin login, docs URL — confirm all work.

6. **Docs cross-check:** Walk docs top-to-bottom, confirm every route is documented and every documented route is implemented.

7. **Commit count check:** `git log --oneline | wc -l` ≥ 20, and skim messages for descriptiveness.

---

## 15 — Final Submission Checklist (Must Match README §What to Submit)

- [ ] Backend GitHub Repo URL (≥20 meaningful commits, `.env.example` present, no secrets committed)
- [ ] Live API URL (Render/Vercel), verified reachable at submission time
- [ ] API Documentation link (Postman Documenter link)
- [ ] Admin Email: `admin@rentnest.com` + Password: `RentNest#Admin2026` (verified working against **live** deployment)

---

## 16 — Summary: Marks Distribution → Sections of This Plan

| Marks Category (README)     | Weight | Covered In                                                     |
| --------------------------- | :----: | -------------------------------------------------------------- |
| API Design & Documentation  |  20%   | §6 (endpoints), §11 (Postman), §14.6 (cross-check)             |
| Database Design & Schema    |  20%   | §3 (full Prisma schema + seed)                                 |
| Commit History              |  10%   | §10 (26-commit strategy)                                       |
| Error Handling & Validation |  10%   | §4 (response format), §5 (middleware), §8 (validation details) |
| Core Functionality          |  20%   | §6 (all endpoints), §7 (RBAC matrix)                           |
| Payment Integration         |  10%   | §6.5 (Stripe integration)                                      |

---

## 17 — Summary of All Deliverables

|  #  | Deliverable                                                           | Status                                     |
| :-: | --------------------------------------------------------------------- | ------------------------------------------ |
|  1  | Working backend API with all endpoints                                | Required                                   |
|  2  | PostgreSQL database with Prisma schema                                | Required                                   |
|  3  | Seed script (admin + categories + sample data)                        | Required                                   |
|  4  | JWT authentication + role-based access                                | Required                                   |
|  5  | Zod validation on all endpoints                                       | Required                                   |
|  6  | Stripe payment integration (real, not simulated)                      | Required                                   |
|  7  | Consistent error response format `{ success, message, errorDetails }` | Required                                   |
|  8  | 20+ meaningful commits                                                | Required                                   |
|  9  | Postman collection covering all endpoints                             | Required                                   |
| 10  | Live deployed API URL                                                 | Required                                   |
| 11  | Project README with admin credentials                                 | Required                                   |
| 12  | Admin category management (CRUD)                                      | Required (Admin permission in RentNest.md) |
| 13  | Pagination + filtering on list endpoints                              | Included                                   |
| 14  | Landlord mark-rental-complete endpoint                                | Included (enables review flow)             |
| 15  | Stripe webhook for payment confirmation                               | Optional bonus                             |
| 16  | Rate limiting on auth routes                                          | Optional bonus                             |
| 17  | Env var validation at boot                                            | Optional bonus                             |

---

> [!IMPORTANT]
> **Coding Agent Instructions**: Follow this plan section-by-section. After each logical unit of work, make a git commit with the corresponding message from Section 10. Never deviate from the error response format. Never skip input validation. Always verify ownership before mutations. Always check role permissions. Every Zod validation schema must be applied as middleware on the route definition — no endpoint should accept unvalidated input.
