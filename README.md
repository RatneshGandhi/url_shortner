# 🔗 URL Shortener API

A RESTful URL shortener backend built with **Express.js**, **PostgreSQL**, and **Drizzle ORM**. Supports user authentication via JWT, URL shortening with custom or auto-generated codes, and redirection.

---

## ✨ Features

- **User Authentication** — Signup & login with salted HMAC-SHA256 password hashing and JWT tokens
- **Shorten URLs** — Create short links with auto-generated (nanoid) or custom short codes
- **Redirect** — Visit a short code to get redirected to the original URL
- **User-Scoped URLs** — Each user can view and manage only their own shortened URLs
- **Delete URLs** — Authenticated users can delete their own shortened URLs
- **Input Validation** — Request payloads validated with Zod schemas
- **Dockerized Database** — PostgreSQL runs via Docker Compose for easy setup

---

## 🛠️ Tech Stack

| Layer          | Technology                                                     |
| -------------- | -------------------------------------------------------------- |
| Runtime        | [Node.js](https://nodejs.org/)                                 |
| Framework      | [Express.js v5](https://expressjs.com/)                        |
| Database       | [PostgreSQL 16](https://www.postgresql.org/)                   |
| ORM            | [Drizzle ORM](https://orm.drizzle.team/)                       |
| Authentication | [JSON Web Tokens (JWT)](https://github.com/auth0/node-jsonwebtoken) |
| Validation     | [Zod](https://zod.dev/)                                       |
| ID Generation  | [nanoid](https://github.com/ai/nanoid)                        |
| Package Manager| [pnpm](https://pnpm.io/)                                      |
| Containerization| [Docker Compose](https://docs.docker.com/compose/)            |

---

## 📁 Project Structure

```
URL Shortner/
├── index.js                    # App entry point — Express setup & middleware
├── package.json
├── docker-compose.yml          # PostgreSQL container config
├── drizzle.config.js           # Drizzle Kit config for migrations
├── .env                        # Environment variables (not committed)
├── .gitignore
│
├── db/
│   └── index.js                # Drizzle database connection
│
├── models/
│   ├── index.js                # Barrel export for all models
│   ├── user.models.js          # Users table schema (Drizzle)
│   └── url.models.js           # URLs table schema (Drizzle)
│
├── routes/
│   ├── user.routes.js          # POST /user/signup, POST /user/login
│   └── url.routes.js           # POST /shorten, GET /codes, DELETE /:shortCode, GET /:shortCode
│
├── middleware/
│   └── auth.middleware.js      # JWT extraction & authentication guard
│
├── services/
│   ├── user.services.js        # getUserByEmail query
│   └── newUser.services.js     # addNewUser insert
│
├── utils/
│   ├── hash.js                 # HMAC-SHA256 password hashing with salt
│   └── token.js                # JWT creation & verification
│
└── validation/
    ├── request.validation.js   # Zod schemas for signup, login, shorten
    └── token.validation.js     # Zod schema for JWT payload
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v10+)
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/RatneshGandhi/url_shortner.git
cd url_shortner
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgres://postgres:admin@localhost:5432/postgres
JWT_SECRET=your_jwt_secret_here
```

### 4. Start the Database

```bash
docker compose up -d
```

This spins up a PostgreSQL 16 container on port `5432`.

### 5. Run Database Migrations

```bash
npx drizzle-kit push
```

This creates the `users` and `urls` tables based on the Drizzle schema.

### 6. Start the Server

```bash
pnpm dev
```

The server starts on `http://localhost:8000` (or the port defined in `.env`).

---

## 📡 API Endpoints

### Authentication

#### `POST /user/signup`

Register a new user.

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "secret"
}
```

**Response** `200`:
```json
{
  "message": "sucess",
  "userId": "uuid-here"
}
```

---

#### `POST /user/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secret"
}
```

**Response** `200`:
```json
{
  "message": "eyJhbGciOiJIUzI1NiIs..."
}
```

> Use the returned token in the `Authorization` header for protected routes:
> ```
> Authorization: Bearer <token>
> ```

---

### URL Management (🔒 Requires Authentication)

#### `POST /shorten`

Shorten a URL.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "url": "https://www.example.com/very/long/url",
  "code": "mycode"
}
```

> `code` is optional. If omitted, a random 6-character code is generated.

**Response** `200`:
```json
{
  "id": "uuid-here",
  "shortCode": "mycode",
  "targetURL": "https://www.example.com/very/long/url"
}
```

---

#### `GET /codes`

Get all shortened URLs for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response** `200`:
```json
{
  "codes": [
    {
      "id": "uuid",
      "shortCode": "mycode",
      "targetURL": "https://www.example.com/very/long/url",
      "userId": "uuid",
      "createdAt": "2026-02-14T00:00:00.000Z",
      "updatedAt": null
    }
  ]
}
```

---

#### `DELETE /:shortCode`

Delete a shortened URL owned by the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response** `200`:
```json
{
  "message": "Deleted successfully"
}
```

---

### Redirection (🌐 Public)

#### `GET /:shortCode`

Redirects to the original target URL.

**Response:** `302` redirect to the target URL.

If the short code is invalid:
```json
{
  "error": "Invalid error"
}
```

---

## 🗄️ Database Schema

### `users` Table

| Column       | Type          | Constraints                |
| ------------ | ------------- | -------------------------- |
| `id`         | UUID          | Primary Key, auto-generated|
| `first_name` | VARCHAR(200)  | NOT NULL                   |
| `last_name`  | VARCHAR(200)  | Nullable                   |
| `email`      | VARCHAR(220)  | UNIQUE, NOT NULL           |
| `password`   | TEXT          | NOT NULL (hashed)          |
| `salt`       | TEXT          | NOT NULL                   |
| `created_at` | TIMESTAMP     | NOT NULL, default now      |
| `updated_at` | TIMESTAMP     | Auto-updated               |

### `urls` Table

| Column       | Type          | Constraints                        |
| ------------ | ------------- | ---------------------------------- |
| `id`         | UUID          | Primary Key, auto-generated        |
| `code`       | VARCHAR(225)  | UNIQUE, NOT NULL                   |
| `target_url` | TEXT          | NOT NULL                           |
| `user_id`    | UUID          | Foreign Key → `users.id`, NOT NULL |
| `created_at` | TIMESTAMP     | NOT NULL, default now              |
| `updated_at` | TIMESTAMP     | Auto-updated                       |

---

## 🔒 Authentication Flow

1. **Signup** — Password is hashed using HMAC-SHA256 with a random salt. The hash and salt are stored in the database.
2. **Login** — The provided password is hashed with the user's stored salt and compared. On success, a JWT containing the user's `id` is returned.
3. **Protected Routes** — The `authentication` middleware extracts and verifies the JWT from the `Authorization: Bearer <token>` header, attaching the decoded payload to `req.user`. The `ensureAuthenticated` guard rejects requests without a valid user.

---

## 📜 License

ISC

---

## 👤 Author

**Ratnesh Gandhi** — [GitHub](https://github.com/RatneshGandhi)