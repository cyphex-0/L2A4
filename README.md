# RentNest Backend API

RentNest is a comprehensive backend service for a property rental platform, built with Node.js, Express, TypeScript, and Prisma (PostgreSQL).

## Features

- **Authentication & Authorization**: Secure JWT-based registration and login with role-based access control (ADMIN, LANDLORD, TENANT).
- **Property Management**: Landlords can create, update, and delete property listings. Tenants can browse properties with advanced filtering and pagination.
- **Rental Requests**: Tenants can submit rental requests. Landlords can approve, reject, and mark requests as completed.
- **Payments**: Integrated with Stripe for secure rental payments. Includes webhook handling for payment confirmation.
- **Reviews**: Tenants can leave reviews for properties they have successfully rented.
- **Admin Dashboard**: Admins can manage users (ban/unban) and oversee all properties and rental requests, as well as manage categories.

## Tech Stack

- **Node.js & Express**: Core application framework.
- **TypeScript**: Static typing for robust code.
- **Prisma & PostgreSQL**: Database ORM and relational data storage.
- **Zod**: Schema validation for incoming requests.
- **Stripe**: Payment processing.

## Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (see `.env.example`).
4. Run Prisma migrations and seed the database:
   ```bash
   npx prisma migrate dev
   npm run prisma:seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Admin Credentials

- **Email**: `admin@rentnest.com`
- **Password**: `RentNest#Admin2026`

## API Documentation

For full API documentation, please refer to the provided Postman collection located in the `docs` directory.
