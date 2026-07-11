# RentNest 🏠 - Backend API

**RentNest** is a comprehensive backend service for a modern property rental platform. It provides a complete API for landlords to list properties, tenants to request rentals, and admins to oversee the entire platform. The backend is built with secure authentication, role-based access control, robust validation, and Stripe integration for payments.

---

## Live URL

https://l2a4-2.onrender.com

## Admin Credentials

- Email: admin@rentnest.com
- Password: RentNestAdmin2026

## Stripe Test Card

Use `4242 4242 4242 4242` with any future expiry and any CVC for test payments.
---

## 🛠️ Technology Stack
- **Framework**: Node.js & Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT & Bcryptjs
- **Payment Gateway**: Stripe

---

## ✨ Key Features

### 🏢 For Tenants:
- Secure registration and login.
- Browse and filter all available rental properties.
- Submit rental requests for desired properties.
- Make secure payments via Stripe upon request approval.
- Support for both manual payment confirmation and automatic Stripe Webhooks.
- Track payment history and rental status.
- Leave reviews for completed rentals.

### 🔑 For Landlords:
- Secure registration and login.
- Create, manage, update, and delete property listings.
- Approve or reject incoming rental requests.
- Mark active rentals as completed.

### 🛡️ For Admins:
- Comprehensive overview of all users, properties, and rental requests.
- Manage property categories.
- Moderate the platform by banning or unbanning users.
- Manage and override property details across the entire system.

---

## 🚀 Setup Instructions

Follow these instructions to run the project locally on your machine.

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd RentNest
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and configure the following variables. (You can also reference `.env.example` if available).

```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="30d"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="365d"
PORT=5000
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
BCRYPT_SALT_ROUNDS=12
SEED_ADMIN_EMAIL="admin@rentnest.com"
SEED_ADMIN_PASSWORD="RentNestAdmin2026"
```

### 4. Database Setup & Migrations
Run Prisma migrations to sync the database schema:
```bash
npx prisma migrate dev
```

### 5. Seed the Database
Seed the database to automatically create the default Admin account and initial Property Categories:
```bash
npx prisma db seed
```

### 6. Start the Server
Run the development server:
```bash
npm run dev
```
The server should now be running on `http://localhost:5000`.

---

## 👤 Admin Credentials
When you run the seed command, the system automatically creates a default Admin user:
- **Email**: `admin@rentnest.com`
- **Password**: `RentNestAdmin2026`

---

## 📂 API Documentation
The complete API documentation with sample request bodies and configurations is available as a Postman Collection. 

1. Navigate to the `docs/` folder in this repository.
2. Import the `RentNest.postman_collection.json` file into Postman.
3. Configure the `baseUrl` and `token` collection variables.
4. Test the endpoints!

---

## 🗄️ Database Models Overview
- **User**: Stores Tenant, Landlord, and Admin profiles, securely hashed passwords, and ban status.
- **Property**: Stores property details, rent, location, amenities, and its current status (`AVAILABLE`, `RENTED`, etc.).
- **Category**: Classifies properties (e.g., "Apartment", "Studio").
- **RentalRequest**: Tracks the lifecycle of a request from `PENDING` -> `APPROVED` -> `ACTIVE` -> `COMPLETED`.
- **Payment**: Tracks Stripe payment transactions linked to rental requests.
- **Review**: Stores tenant feedback and ratings for properties.
