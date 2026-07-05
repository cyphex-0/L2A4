const fs = require('fs');

const collection = {
  "info": {
    "name": "RentNest API",
    "description": "API documentation for the RentNest property rental platform.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    }
  ],
  "item": []
};

const createRequest = (name, method, url, auth = false, body = null) => {
  const req = {
    "name": name,
    "request": {
      "method": method,
      "header": [],
      "url": {
        "raw": `{{baseUrl}}${url}`,
        "host": [
          "{{baseUrl}}"
        ],
        "path": url.split('/').filter(p => p !== '')
      }
    },
    "response": []
  };

  if (auth) {
    req.request.auth = {
      "type": "bearer",
      "bearer": [
        {
          "key": "token",
          "value": "{{token}}",
          "type": "string"
        }
      ]
    };
  }

  if (body) {
    req.request.body = {
      "mode": "raw",
      "raw": JSON.stringify(body, null, 2),
      "options": {
        "raw": {
          "language": "json"
        }
      }
    };
  }

  return req;
};

// 1. Auth Module
const authItem = {
  "name": "Auth",
  "item": [
    createRequest("Register Tenant", "POST", "/api/auth/register", false, { name: "Tenant", email: "tenant@example.com", password: "password", role: "TENANT" }),
    createRequest("Register Landlord", "POST", "/api/auth/register", false, { name: "Landlord", email: "landlord@example.com", password: "password", role: "LANDLORD" }),
    createRequest("Login", "POST", "/api/auth/login", false, { email: "tenant@example.com", password: "password" }),
    createRequest("Get Me", "GET", "/api/auth/me", true)
  ]
};

// 2. Properties (Public)
const propertiesItem = {
  "name": "Properties (Public)",
  "item": [
    createRequest("Get All Properties", "GET", "/api/properties", false),
    createRequest("Get Property By ID", "GET", "/api/properties/123", false)
  ]
};

// 3. Properties (Landlord)
const landlordPropertiesItem = {
  "name": "Properties (Landlord)",
  "item": [
    createRequest("Create Property", "POST", "/api/properties", true, { title: "House", description: "Nice", location: "City", address: "123 St", rent: 500, bedrooms: 2, bathrooms: 1, area: 100, amenities: ["Wifi"], images: [], categoryId: "cat_id" }),
    createRequest("Update Property", "PUT", "/api/properties/123", true, { title: "Updated House" }),
    createRequest("Delete Property", "DELETE", "/api/properties/123", true)
  ]
};

// 4. Categories
const categoriesItem = {
  "name": "Categories",
  "item": [
    createRequest("Get Categories", "GET", "/api/categories", false),
    createRequest("Create Category (Admin)", "POST", "/api/categories", true, { name: "Apartment" }),
    createRequest("Update Category (Admin)", "PUT", "/api/categories/123", true, { name: "Condo" }),
    createRequest("Delete Category (Admin)", "DELETE", "/api/categories/123", true)
  ]
};

// 5. Rentals
const rentalsItem = {
  "name": "Rentals",
  "item": [
    createRequest("Create Rental Request", "POST", "/api/rentals", true, { propertyId: "prop_id", moveInDate: "2024-01-01T00:00:00Z", moveOutDate: "2024-12-31T00:00:00Z" }),
    createRequest("Get Own Rentals", "GET", "/api/rentals", true),
    createRequest("Get Rental Requests (Landlord)", "GET", "/api/rentals/requests", true),
    createRequest("Update Rental Status (Landlord)", "PUT", "/api/rentals/123/status", true, { status: "APPROVED" }),
    createRequest("Complete Rental (Landlord)", "PUT", "/api/rentals/123/complete", true)
  ]
};

// 6. Payments
const paymentsItem = {
  "name": "Payments",
  "item": [
    createRequest("Create Payment Intent", "POST", "/api/payments/create-intent", true, { rentalRequestId: "req_id" }),
    createRequest("Get Payment History", "GET", "/api/payments/history", true),
    createRequest("Stripe Webhook", "POST", "/api/payments/webhook", false)
  ]
};

// 7. Reviews
const reviewsItem = {
  "name": "Reviews",
  "item": [
    createRequest("Create Review", "POST", "/api/reviews", true, { propertyId: "prop_id", rating: 5, comment: "Great place!" })
  ]
};

// 8. Admin
const adminItem = {
  "name": "Admin",
  "item": [
    createRequest("Get Users", "GET", "/api/admin/users", true),
    createRequest("Ban User", "PUT", "/api/admin/users/123/ban", true),
    createRequest("Unban User", "PUT", "/api/admin/users/123/unban", true),
    createRequest("Get All Properties", "GET", "/api/admin/properties", true),
    createRequest("Update Any Property", "PUT", "/api/admin/properties/123", true, { title: "Admin Update" }),
    createRequest("Delete Any Property", "DELETE", "/api/admin/properties/123", true),
    createRequest("Get All Rentals", "GET", "/api/admin/rentals", true)
  ]
};

collection.item.push(authItem, propertiesItem, landlordPropertiesItem, categoriesItem, rentalsItem, paymentsItem, reviewsItem, adminItem);

fs.writeFileSync('./docs/RentNest.postman_collection.json', JSON.stringify(collection, null, 2));
console.log('Collection generated!');
