# Rent-A-Car — Backend API

Node.js · Express · MongoDB · JWT Auth

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally **or** a MongoDB Atlas URI

### 2. Install & configure
```bash
cd rent-a-car-backend
npm install
cp .env.example .env   # then edit .env with your MONGO_URI and JWT_SECRET
```

### 3. Seed the database
```bash
npm run seed
```
This creates 3 users, 6 cars, and 2 sample bookings.

| Role     | Email                  | Password  |
|----------|------------------------|-----------|
| Admin    | admin@rentacar.com     | admin123  |
| Customer | alice@example.com      | alice123  |
| Customer | bob@example.com        | bob123    |

### 4. Start the server
```bash
npm run dev   # development (nodemon hot-reload)
npm start     # production
```

Server starts on **http://localhost:5000**

---

## Project Structure

```
src/
├── server.js              ← Entry point (DB connect + listen)
├── app.js                 ← Express app (middleware + routes)
├── config/
│   └── db.js              ← Mongoose connection
├── models/
│   ├── User.js            ← bcrypt password hashing
│   ├── Car.js             ← Car schema + text index
│   └── Booking.js         ← References Car + User
├── controllers/
│   ├── authController.js  ← register, login, getMe
│   ├── carController.js   ← CRUD + filters + stats
│   └── bookingController.js ← create, list, status update
├── routes/
│   ├── auth.js
│   ├── cars.js
│   └── bookings.js
├── middleware/
│   └── auth.js            ← protect + restrictTo
└── utils/
    ├── asyncHandler.js    ← Wraps async controllers
    ├── errorHandler.js    ← AppError class + global handler
    └── jwt.js             ← signToken / verifyToken
scripts/
└── seed.js                ← Database seeder
```

---

## API Reference

All protected routes require:
```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint            | Auth     | Body                          |
|--------|---------------------|----------|-------------------------------|
| POST   | /api/auth/register  | Public   | `{ name, email, password }`   |
| POST   | /api/auth/login     | Public   | `{ email, password }`         |
| GET    | /api/auth/me        | Required | —                             |

**Response (login / register):**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "_id": "...", "name": "...", "email": "...", "role": "customer" }
}
```

---

### Cars

| Method | Endpoint          | Auth          | Notes                              |
|--------|-------------------|---------------|------------------------------------|
| GET    | /api/cars         | Public        | `?category=SUV&status=available&search=bmw` |
| GET    | /api/cars/stats   | Admin only    | Returns fleet counts               |
| GET    | /api/cars/:id     | Public        |                                    |
| POST   | /api/cars         | Admin only    | Create car                         |
| PUT    | /api/cars/:id     | Admin only    | Update car                         |
| DELETE | /api/cars/:id     | Admin only    | Blocked if car has active booking  |

**Car body fields:**
```json
{
  "make": "Tesla", "model": "Model S", "year": 2023,
  "category": "Electric",
  "pricePerDay": 120, "status": "available",
  "seats": 5, "transmission": "Automatic",
  "mileage": 12000, "image": "https://..."
}
```

---

### Bookings

| Method | Endpoint                    | Auth       | Notes                           |
|--------|-----------------------------|------------|---------------------------------|
| GET    | /api/bookings               | Required   | Admin: all · Customer: own only |
| GET    | /api/bookings/:id           | Required   | Customer can only see their own |
| POST   | /api/bookings               | Required   | Customer creates booking        |
| PATCH  | /api/bookings/:id/status    | Admin only | `{ "status": "completed" }`     |

**Create booking body:**
```json
{
  "carId": "<mongoId>",
  "startDate": "2025-03-01",
  "endDate":   "2025-03-05"
}
```
Total price is calculated server-side from `days × car.pricePerDay`.  
The car's status is automatically updated to `rented`.

---

## Environment Variables

| Variable        | Default                              | Description               |
|-----------------|--------------------------------------|---------------------------|
| PORT            | 5000                                 | HTTP port                 |
| MONGO_URI       | mongodb://127.0.0.1:27017/rent-a-car | MongoDB connection string |
| JWT_SECRET      | —                                    | Secret for signing JWTs   |
| JWT_EXPIRES_IN  | 7d                                   | Token expiry              |
| CLIENT_URL      | http://localhost:5173                | Allowed CORS origin       |
| NODE_ENV        | development                          | Enables morgan logger     |
