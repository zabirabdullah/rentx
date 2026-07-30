# RentX — System Architecture

This document is the single source of truth for how the project is structured. Follow it consistently so the codebase stays simple, modular, and easy to reason about. Update this file whenever an architectural decision changes.

---

## 1. Project Overview

RentX is a platform where property owners list places for rent/sale (houses, offices, commercial spaces, godowns, garages, ATM booths), tenants browse and request to rent them, and companies offer supporting services (moving, cleaning, electrician, plumbing, painting).

**User roles:**

| Role   | Can do |
|--------|--------|
| Admin   | Manage users, approve/remove listings, review property reports, oversee platform |
| Owner   | Create/edit/delete property listings, respond to rental requests |
| Tenant  | Browse listings, request to rent, book services, report fake properties |
| Company | List services offered, quote service requests, update job statuses |

---

## 2. Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** Firebase Authentication (handles emails, passwords, and issues ID tokens). The backend uses `firebase-admin` to verify tokens. No passwords are ever stored in MongoDB.
- **File/image storage:** Cloud storage bucket (e.g. Cloudinary) — store only the URL in Mongo
- **Frontend:** React (consumes the REST API)
- **Maps:** React-Leaflet on the frontend, using `location` (lat/lng) stored per property. Advanced geospatial radius searches happen via backend calculations.

---

## 3. Folder Structure

Standard MVC-style layout. One responsibility per file.

```
/config
  db.js               → mongoose connection setup
  env.js              → loads/validates environment variables
  firebase.js         → initializes firebase-admin SDK

/models
  userModel.js
  propertyModel.js
  companyProfileModel.js
  rentalRequestModel.js
  serviceRequestModel.js
  reportModel.js
  notificationModel.js

/routes
  (One for each resource, e.g., userRoutes.js, propertyRoutes.js, etc.)

/controllers
  (One for each resource, handling business logic and Mongoose queries)

/middleware
  authMiddleware.js   → verifies Firebase ID token, attaches req.user
  roleMiddleware.js   → restricts route to specific roles (e.g. "owner", "admin")
  errorMiddleware.js  → central error handler

/utils
  asyncHandler.js     → wraps async route handlers to avoid repeated try/catch
  notify.js           → creates in-app Notification records in MongoDB for system alerts

server.js             → app entry point
```

---

## 4. Data Models

### 4.1 User (`userModel.js`)

Authentication is handled entirely by Firebase, so there is no `password` field in our database. We map the `firebaseUid` to our MongoDB document.

```js
{
  firebaseUid: { type: String, required: true, unique: true },
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  phone:    { type: String, required: true }, // Must be 11-digit BD number
  address:  { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["tenant", "owner", "company", "admin"],
    default: "tenant",
  },
  isVerified: { type: Boolean, default: false },
}
```

### 4.2 Property (`propertyModel.js`)

```js
{
  ownerId:   { type: ObjectId, ref: "User", required: true },
  category: {
    type: String, required: true,
    enum: ["house", "office", "commercial_space", "godown", "garage", "atm_booth"],
  },
  address:  { type: String, required: true },
  holdingNo:{ type: String, required: true },
  area:     { type: Number, required: true },
  rentPrice:{ type: Number, required: true },
  salePrice:{ type: Number, required: false },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  images:      [{ type: String, required: true }],
  description: { type: String },
  isAvailable: { type: Boolean, required: true, default: true },
  
  // Privacy feature: if false, owner phone is stripped from public API response
  showPhone:   { type: Boolean, default: false }, 

  // Category-dependent Fields
  name:     { type: String },              
  storey:   { type: Number, required: true },
  elevator: { type: Boolean, required: true, default: false },
  position: { type: String },
  bedroom:  { type: Number },
  bathroom: { type: Number },
  balcony:  { type: Number },
}
```

### 4.3 CompanyProfile (`companyProfileModel.js`)

```js
{
  userId:      { type: ObjectId, ref: "User", required: true },
  businessName:{ type: String, required: true },
  servicesOffered: [{
    type: String,
    enum: ["moving", "cleaning", "electrician", "plumbing", "painting"],
  }],
  baseRates: { type: Map, of: Number },
  description: { type: String },
}
```

### 4.4 RentalRequest (`rentalRequestModel.js`)

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

Supports a manual quotation workflow and highly detailed moving/cleaning parameters.

```js
{
  requesterId: { type: ObjectId, ref: "User", required: true },
  companyId:   { type: ObjectId, ref: "CompanyProfile", required: true },
  serviceType: { type: String, enum: ["moving", "cleaning", ...], required: true },

  // Moving specifics
  fromAddress: { type: String },
  toAddress:   { type: String },
  furnitureItems: [{ 
    name: String, 
    estimatedMassKg: Number, 
    size: String, // small/medium/large/oversized
    requiresStairs: Boolean, // if true, item is too big for elevator
    specialCare: Boolean 
  }],
  storey: { type: Number },
  elevatorAvailable: { type: Boolean, default: false },

  // Cleaning specifics
  numberOfRooms: { type: Number },
  spaceArea: { type: Number },

  scheduledDate: { type: Date, required: true },
  specialNote: { type: String },

  // Company response
  estimatedCost: { type: Number }, // Quoted by company based on params above
  companyNote: { type: String },

  status: {
    type: String,
    enum: ["pending", "quoted", "accepted", "in_progress", "completed", "cancelled"],
    default: "pending",
  },
}
```

### 4.6 Report (`reportModel.js`)

Allows users to flag fake/suspicious properties.

```js
{
  propertyId: { type: ObjectId, ref: "Property", required: true },
  reportedBy: { type: ObjectId, ref: "User", required: true },
  reason:     { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "reviewed", "dismissed", "action_taken"],
    default: "pending",
  },
  adminNote: { type: String },
}
```

### 4.7 Notification (`notificationModel.js`)

In-app notifications stored in the database for the dashboard notification bell.

```js
{
  userId: { type: ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  type: { type: String, enum: ["system", "rental_request", "service_request", "report"] },
  relatedId: { type: ObjectId },
}
```

---

## 5. API Routes

```
POST   /api/auth/sync                 Protected   Sync Firebase user with MongoDB

GET    /api/users                     Admin       List all users
GET    /api/users/:id                 Self/Admin  Get profile
PUT    /api/users/:id                 Self/Admin  Update profile

GET    /api/properties                Public      Browse (supports search, lat, lng, radius filters)
GET    /api/properties/:id            Public*     View single (*protectOptional hides unavailable)
POST   /api/properties                Owner       Create listing
PUT    /api/properties/:id            Owner       Update own listing
DELETE /api/properties/:id            Owner/Admin Delete listing

GET    /api/companies                 Public      Browse companies
GET    /api/companies/:id             Public      View company
POST   /api/companies                 Company     Create profile
PUT    /api/companies/:id             Company     Update own profile

POST   /api/rental-requests           Tenant      Request to rent
GET    /api/rental-requests/my        All         View own requests
PUT    /api/rental-requests/:id       All         Approve/reject/cancel

POST   /api/service-requests          All         Create service request
GET    /api/service-requests/my       All         View own requests
PUT    /api/service-requests/:id      All         Quote/accept/complete/cancel

POST   /api/reports                   Any User    Report a property
GET    /api/reports                   Admin       View reports
PUT    /api/reports/:id               Admin       Update report status

GET    /api/notifications             All         View my notifications
PUT    /api/notifications/read-all    All         Mark all as read
PUT    /api/notifications/:id/read    All         Mark single as read
```

---

## 6. Auth & Authorization (Firebase)

- **Login/Registration:** Handled entirely by the Firebase Client SDK on the frontend.
- **Token Verification:** The frontend passes the Firebase ID Token in the `Authorization: Bearer <token>` header. `authMiddleware` uses `firebase-admin` to decode this token and attaches the user document to `req.user`.
- **Syncing:** `POST /api/auth/sync` is called immediately after Firebase login/registration. It maps the Firebase UID to a MongoDB User. **Crucially, if MongoDB validation fails during first-time sync, the backend automatically executes `auth.deleteUser(uid)` to delete the Firebase user. This prevents "ghost accounts" from bricking the system.**
- **Roles:** `roleMiddleware(["owner", "admin"])` checks `req.user.role` against an allowed list and rejects with `403` otherwise.

---

## 7. Coding Conventions

- One model = one file. One router = one file. No mixing.
- Controllers return `res.status(code).json({...})`; never let raw Mongoose errors leak to the client — always pass through `errorMiddleware`.
- Use `asyncHandler` to wrap controller functions instead of repeating `try/catch` everywhere.
- Notifications are never hardcoded in controllers; always use `utils/notify.js` to insert alerts into the database.
