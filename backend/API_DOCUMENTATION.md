# FarmLink API Documentation

This document outlines the standard API response formats, validation, error handling, security, database structure, testing strategies, logging, folder architecture, and deployment protocols for the FarmLink backend.

---

## 1. Standard API Response Format

All API responses follow a predictable structure to simplify frontend integration.

### Success Response Structure
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message typically used for mutations"
}
```

### Error Response Structure
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [ ... ] 
  }
}
```
*Note: `details` is typically populated with validation error specifics.*

### HTTP Status Codes Explained
- **200 OK**: Request succeeded, typically for GET/PUT/PATCH.
- **201 Created**: Resource successfully created, typically for POST.
- **400 Bad Request**: Validation error or malformed request.
- **401 Unauthorized**: Missing or invalid authentication token.
- **403 Forbidden**: Authenticated, but lacks required permissions (RBAC).
- **404 Not Found**: The requested resource does not exist.
- **429 Too Many Requests**: Rate limit exceeded.
- **500 Internal Server Error**: Unexpected backend failure.

### Example JSON Responses

**Successful Product Creation (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": "e3b0c442-989b-464c-8b88-1a5c68128334",
    "name": "Organic Tomatoes",
    "price": 1200,
    "farmerId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdAt": "2026-02-28T01:00:00Z"
  },
  "message": "Product created successfully."
}
```

**Validation Error on Registration (400 Bad Request)**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters long"
      }
    ]
  }
}
```

---

## 2. Validation Layer

The API uses **Zod** as its primary validation strategy to enforce strict type safety and validate the shape of incoming requests before they hit the controllers.

### Example Validation Schemas

**Registration Schema (`registerSchema.ts`)**
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["FARMER", "CUSTOMER"]).default("CUSTOMER")
  })
});
```

**Product Creation Schema (`createProductSchema.ts`)**
```typescript
import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    price: z.number().positive("Price must be greater than 0"),
    description: z.string().optional()
  })
});
```

### How Validation Errors Are Handled
Validation middleware intercepts requests. If validation fails, a `ZodError` is caught and passed to the global error handler, which formats it into the standard `400 Bad Request` template containing the `details` array of specific field errors.

---

## 3. Error Handling Strategy

### Global Error Handler Middleware
All routes bubble unhandled exceptions up to `src/middlewares/errorHandler.ts`. This middleware ensures that internal server errors are safely suppressed from the client (in production) while providing formatted, consistent responses.

### Custom Error Classes
We utilize custom error classes (extending `Error`) such as `AppError`, `NotFoundError`, and `UnauthorizedError` to allow controllers to explicitly define the HTTP status code and error code to be returned.

### Prisma Error Handling
Prisma errors are intercepted in the service layer or the global error handler:
- **P2002**: Unique Constraint Violation (e.g., Email already exists) -> Maps to `409 Conflict`.
- **P2025**: Record Not Found -> Maps to `404 Not Found`.

---

## 4. Security Section

### Password Hashing
Passwords are unconditionally hashed before persistence using **bcrypt** with a salt round of `10`.

### JWT Implementation
- **Structure**: The payload typically contains `{ userId, role }`.
- **Access Token Expiry**: Tokens are short-lived (e.g., `15m` - `1h`).
- **Refresh Token Strategy**: *(Recommended Design)* Secure HTTP-Only cookies should store a long-lived refresh token (e.g., `7d`). When the access token expires, the client calls a `/refresh` endpoint to obtain a new access token without needing to re-login. The refresh token should be tracked in the database to allow for remote revocation.

### Role-Based Access Control (RBAC)
Middleware `requireRole(['FARMER'])` verifies the `role` attached to the decoded JWT payload to restrict endpoints (e.g., only Farmers can access `POST /products`).

### Rate Limiting
`express-rate-limit` is applied globally in `app.ts` to prevent brute-force and DDoS attacks. A typical configuration is 100 requests per 15 minutes per IP.

---

## 5. Database Documentation

The system uses **PostgreSQL** with **Prisma ORM**.

### Core Prisma Models
- **User**: Represents clients (Customers and Farmers).
- **Product**: Represents items listed by Farmers.
- **Order**: Represents a purchase linking a Customer to a Product.
- **Chat & Message**: Represents the entity-relationship for real-time socket communication.
- **Notification**: Alerts tied to specific users.

### Relationships
- **User (Farmer) 1:n Product**: A farmer can have many listed products.
- **User (Customer) 1:n Order**: A customer can place many orders.
- **Product 1:n Order**: A product can be tied to many orders globally.
- **Chat 1:n Message**: A chat instance contains many messages.

### Constraints & Indexes
- `@unique` constraint on `User.email` to prevent duplicate accounts.
- By default, Prisma creates indexes on foreign keys (`farmerId`, `customerId`, `productId`) to optimize join queries.

### Migration Strategy
Database schema changes are applied using `npx prisma migrate dev` in development to create migration files out of `schema.prisma`. In deployment pipelines, `npx prisma migrate deploy` is used to apply the pending SQL scripts against the production database without resetting data.

---

## 6. Testing Section

### Approach
- **Unit Testing**: Focuses on `services` and `utils` to guarantee core business logic (e.g., password hashing correctness, discount calculations if applicable) using frameworks like **Jest**. Services should use mocked Prisma clients.
- **Integration Testing**: Tests flow from `routes` > `controllers` > `services` > `database` using **Supertest**, targeting a dedicated test database container.

### Example Test Case (Jest + Supertest)
```typescript
describe('POST /api/auth/register', () => {
  it('should successfully register a new customer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Customer',
        email: 'test@example.com',
        password: 'password123',
        role: 'CUSTOMER'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
  });
});
```

### Postman Collection
A Postman collection with environments (`development`, `production`) managing predefined variables (`{{baseUrl}}`, `{{token}}`) should be exported and maintained in the repository for developer onboarding and endpoint verification.

---

## 7. Logging and Monitoring

### Logging Strategy
**Winston** is configured as the primary logger, replacing raw `console.log`.
- Outputs JSON logs in production (`console` transport).
- Outputs colorized, human-readable strings in development.

### Request Logging Middleware
A custom middleware (or `morgan` piped to winston) logs every incoming request (`METHOD /path`) along with the execution time (`ms`) and response status.

### Production Monitoring Suggestions
- **APM**: Integrate an Application Performance Monitoring tool like DataDog, New Relic, or Sentry to track request latency and catch unhandled exceptions.
- **Health Checks**: A highly available `/api/health` endpoint verifies database connectivity and system uptime for Load Balancers to poll.

---

## 8. Folder Structure Explanation

Based on **Clean Architecture**:

```text
backend/
├── prisma/             # Database schema and migrations
├── src/
│   ├── config/         # App-wide configurations (e.g., logger, cors)
│   ├── middlewares/    # Express middlewares (auth, error handler, validation)
│   ├── modules/        # Feature-based clean architecture modules
│   │   ├── auth/       # Each module contains:
│   │   │   ├── authRoutes.ts       # Route definitions
│   │   │   ├── authController.ts   # HTTP handling & logic mapping
│   │   │   └── authService.ts      # Core business logic / DB operations
│   │   ├── products/
│   │   └── ...
│   ├── socket/         # Socket.io initialization and event handlers
│   ├── utils/          # Shared helper functions
│   ├── app.ts          # Express application setup
│   └── server.ts       # Server entry point
```

---

## 9. Deployment Documentation

### Environment Variables (.env)
Critical configs that must not be committed to source control:
- `DATABASE_URL`: Full Postgres connection string.
- `JWT_SECRET` & `JWT_EXPIRES_IN`: Secrets and durations.
- `CLOUDINARY_*`: Image bucket credentials.
- `NODE_ENV`: Should be `production` during runtime, enabling optimized behaviors in Express.

### Docker (Optional but Recommended)
A two-stage `Dockerfile` should be used to build the TypeScript output and discard `devDependencies` for a minimal production image footprint.

### CI/CD Overview
A typical GitHub Actions pipeline logic:
1. **Push to `main`**: Trigger workflow.
2. **Build & Test**: Run `npm run build` and `npm test` on a temporary Postgres instance.
3. **Deploy**: If successful, push image to registry / trigger server pull.
4. **Migrate**: Run `npx prisma migrate deploy` during the startup command sequence of the newly deployed container to ensure database sync.
