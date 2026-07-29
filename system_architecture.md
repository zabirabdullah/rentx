# RentX — System Architecture

This document is the single source of truth for how the project is structured. Follow it
consistently so the codebase stays simple, modular, and easy to reason about. Update this
file whenever an architectural decision changes.

---

## 1. Project Overview

RentX is a platform where property owners list places for rent/sale (houses, offices,
commercial spaces, godowns, garages, ATM booths), tenants browse and request to rent them,
and companies offer supporting services (moving, cleaning, electrician, plumbing, painting).

**User roles:**

| Role   | Can do |
|--------|--------|
| Admin   | Manage users, approve/remove listings, oversee the platform |
| Owner   | Create/edit/delete property listings, respond to rental requests |
| Tenant  | Browse listings, request to rent, book services |
| Company | List services offered, respond to service requests, set rates |

---

## 2. Tech Stack

Keep the stack minimal — no tool is added unless it's needed.

- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access token), bcrypt for password hashing
- **File/image storage:** Cloud storage bucket (e.g. Cloudinary) — store only the URL in Mongo
- **Frontend:** React (separate app, consumes the REST API below)
- **Maps:** Google Maps / Mapbox API on the frontend, using `location` (lat/lng) stored per property

---

## 3. Folder Structure

Standard MVC-style layout. One responsibility per file.

```
/config
  db.js               → mongoose connection setup
  env.js              → loads/validates environment variables

/models
  userModel.js
  propertyModel.js
  companyProfileModel.js
  rentalRequestModel.js
  serviceRequestModel.js

/routes
  userRoutes.js
  authRoutes.js
  propertyRoutes.js
  companyRoutes.js
  rentalRequestRoutes.js
  serviceRequestRoutes.js

/controllers
  userController.js
  authController.js
  propertyController.js
  companyController.js
  rentalRequestController.js
  serviceRequestController.js

/middleware
  authMiddleware.js   → verifies JWT, attaches req.user
  roleMiddleware.js   → restricts route to specific roles (e.g. "owner", "admin")
  errorMiddleware.js  → central error handler

/utils
  costCalculator.js   → shared logic for service cost estimates
  asyncHandler.js      → wraps async route handlers to avoid repeated try/catch

server.js             → app entry point
```

**Rule of thumb:** Routes only wire up HTTP methods to controller functions. Controllers
hold the logic. Models only define schema/data shape. No business logic inside models or
routes.

---

## 4. Data Models

### 4.1 User (`userModel.js`)

Extends the existing schema with a password field and a `company` role, since Company is a
user type in this system too.

```js
{
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },       // bcrypt-hashed, never returned in responses
  phone:    { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["tenant", "owner", "company", "admin"],
    default: "tenant",
  },
  isVerified: { type: Boolean, default: false },
}
```

A `company` user gets an associated `CompanyProfile` document (below) rather than cramming
service-specific fields into the User model itself.

### 4.2 Property (renamed from `Flat` → `Property`)

The current `flatModel.js` only covers houses/apartments. Broaden `type` to cover every
listing category from the notes, and add the fields called out as universal (sale price,
GPS location) or category-specific (elevator).

```js
{
  ownerId:   { type: ObjectId, ref: "User", required: true },

  category: {
    type: String,
    required: true,
    enum: ["house", "office", "commercial_space", "godown", "garage", "atm_booth"],
  },

  address:  { type: String, required: true },
  holdingNo:{ type: String, required: true },
  area:     { type: Number, required: true },

  rentPrice: { type: Number, required: true },
  salePrice: { type: Number, required: false }, // only if the owner also allows sale

  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },

  images:      [{ type: String, required: true }],
  description: { type: String },
  isAvailable: { type: Boolean, required: true, default: true },

  // Optional / category-dependent — not every category needs every field
  name:     { type: String },              // e.g. building name
  storey:   { type: Number },
  position: { type: String },
  elevator: { type: Boolean, default: false },
  bedroom:  { type: Number },
  bathroom: { type: Number },
  balcony:  { type: Number },
}
```

Keep category-specific validation (e.g. "bedroom is required if category is house") inside
the **controller**, not the schema — this keeps the schema simple and avoids Mongoose
conditional-required complexity.

### 4.3 CompanyProfile (`companyProfileModel.js`)

```js
{
  userId:      { type: ObjectId, ref: "User", required: true },
  businessName:{ type: String, required: true },
  servicesOffered: [{
    type: String,
    enum: ["moving", "cleaning", "electrician", "plumbing", "painting"],
  }],
  baseRates: {
    type: Map,
    of: Number, // e.g. { moving: 500, cleaning: 200 }
  },
  description: { type: String },
}
```

### 4.4 RentalRequest (`rentalRequestModel.js`)

Tenant → Owner request to rent a listed property.

```js
{
  propertyId: { type: ObjectId, ref: "Property", required: true },
  tenantId:   { type: ObjectId, ref: "User", required: true },
  ownerId:    { type: ObjectId, ref: "User", required: true },
  message:    { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending",
  },
}
```

### 4.5 ServiceRequest (`serviceRequestModel.js`)

Tenant/Owner → Company request for moving, cleaning, etc. Matches the fields already
sketched in the notes for moving/cleaning.

```js
{
  requesterId: { type: ObjectId, ref: "User", required: true },
  companyId:   { type: ObjectId, ref: "User", required: true }, // must have role "company"
  serviceType: {
    type: String,
    enum: ["moving", "cleaning", "electrician", "plumbing", "painting"],
    required: true,
  },

  fromAddress: { type: String },   // moving only
  toAddress:   { type: String },   // moving only
  scheduledDate: { type: Date, required: true },

  rooms:              { type: Number },
  storey:             { type: Number },
  elevatorAvailable:  { type: Boolean, default: false },
  specialCareItems:   [{ type: String }],
  specialNote:        { type: String },

  estimatedCost: { type: Number }, // from utils/costCalculator.js
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
}
```

All models use `{ timestamps: true }`, matching the existing convention.

---

## 5. API Routes

REST, resource-based, one router file per resource. All non-public routes go through
`authMiddleware`; role-restricted ones also go through `roleMiddleware`.

```
POST   /api/auth/register        Public
POST   /api/auth/login           Public

GET    /api/users                Admin
GET    /api/users/:id            Logged-in user (self) or Admin
PUT    /api/users/:id            Logged-in user (self) or Admin

GET    /api/properties           Public (browse/search/filter)
GET    /api/properties/:id       Public
POST   /api/properties           Owner
PUT    /api/properties/:id       Owner (own listing only)
DELETE /api/properties/:id       Owner (own listing only) or Admin

GET    /api/companies            Public (browse companies by service type)
POST   /api/companies            Company (create own profile)
PUT    /api/companies/:id        Company (own profile only)

POST   /api/rental-requests           Tenant
GET    /api/rental-requests/my        Tenant or Owner (their own requests)
PUT    /api/rental-requests/:id       Owner (approve/reject)

POST   /api/service-requests          Tenant or Owner
GET    /api/service-requests/my       Requester or Company
PUT    /api/service-requests/:id      Company (confirm/complete) or requester (cancel)
```

---

## 6. Auth & Authorization

- `POST /api/auth/login` issues a JWT containing `{ id, role }`.
- `authMiddleware` verifies the token and attaches `req.user`.
- `roleMiddleware(["owner", "admin"])` checks `req.user.role` against an allowed list and
  rejects with `403` otherwise.
- Ownership checks (e.g. "can only edit your own listing") happen inside the controller by
  comparing `req.user.id` to the document's `ownerId`/`requesterId`.

---

## 7. Coding Conventions

- One model = one file. One router = one file. No mixing.
- Controllers return `res.status(code).json({...})`; never let raw Mongoose errors leak to
  the client — always pass through `errorMiddleware`.
- Use `asyncHandler` to wrap controller functions instead of repeating `try/catch` everywhere.
- Keep validation logic in controllers, not scattered across routes.
- Environment variables (DB URI, JWT secret, cloud storage keys) always go through `config/env.js`,
  never hardcoded.
- Favor small, named functions over large inline logic blocks.

---

## 8. Planned Features (not yet built, keep architecture room for these)

- **Real-time map** — frontend consumes `location` field on `Property` to render pins.
- **Cost calculator** — `utils/costCalculator.js` takes serviceType + parameters (rooms,
  distance, storey, elevator) and returns an `estimatedCost`; used by `serviceRequestController.js`.
- **Event booking** — likely a future `EventBookingRequest` model, structurally similar to
  `RentalRequest`.
- **Notifications** — email/SMS on request status change; wire in as a separate `utils/notify.js`
  rather than embedding notification logic in controllers.

---

## 9. Migration Notes (from current code)

- `models/flatModel.js` → rename to `models/propertyModel.js`; rename model name `Flat` → `Property`.
- `type` field renamed to `category`, enum expanded to all six listing categories.
- `userModel.js` needs a `password` field added and `"company"` added to the `role` enum
  before auth can be implemented.
- `userRoutes.js` currently creates users directly via `POST /api/users` with no password —
  this should move to `POST /api/auth/register` once auth is added, with password hashing
  via bcrypt in the controller.
