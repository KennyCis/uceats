# UCEats - Backend API 

The server-side application for UCEats, built with Node.js and Express. It handles business logic, database connections, real-time communication, and payment processing.

##  Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Real-Time:** Socket.io (Bi-directional communication)
- **Authentication:** JWT (JSON Web Tokens) & Google OAuth 2.0
- **Payments:** Stripe API
- **Logging:** Morgan (Access logs generation)
- **Documentation:** Swagger UI

##  Project Structure

- `src/controllers`: Logic for requests (Auth, Products, Orders, Stats).
- `src/models`: Mongoose Schemas (Data strict structure).
- `src/routes`: API Endpoints definitions.
- `src/config`: Configuration files (DB, Mailer).
- `logs/`: Server access logs (generated automatically by Morgan).

##  Setup & Installation

1. **Install Dependencies:**
   ```bash
   npm install