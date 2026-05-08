# Fitness Tracker API

A RESTful API for logging and managing personal workout data. Built with Node.js, Express, Sequelize, and MySQL.

---

## What It Does

Keeping track of workout progress manually is a pain. This API gives you a structured backend to manage users, workout sessions, and individual exercises — including performance details like sets, reps, and weight per session.

The data model mirrors how real training works: a user has a fitness goal, logs multiple workout sessions, and each session contains exercises with their own performance stats.

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| Node.js | 20.x | Runtime |
| Express.js | 4.19.x | Routing and middleware |
| Sequelize | 6.37.x | ORM |
| MySQL | 8.x | Database |
| dotenv | 16.4.x | Environment config |
| mysql2 | 3.9.x | MySQL driver |

---

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL 8+

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/fitness-tracker-api.git
cd fitness-tracker-api
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your database credentials in `.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fitness_tracker
DB_USER=root
DB_PASS=yourpassword
PORT=3000
```

### 3. Create the database

```sql
CREATE DATABASE fitness_tracker;
```

### 4. Start the server

```bash
npm start
```

Sequelize will handle table creation automatically. You should see:

```
Database connected and synced.
Server running on http://localhost:3000
```

---

## Database Schema

### users

| Column | Type | Notes |
|---|---|---|
| id | INTEGER | PK, auto increment |
| name | VARCHAR(100) | required |
| email | VARCHAR(150) | required, unique |
| age | INTEGER | optional |
| fitnessGoal | ENUM | `weight_loss`, `muscle_gain`, `endurance`, `general_fitness` |
| createdAt / updatedAt | DATETIME | managed by Sequelize |

### workouts

| Column | Type | Notes |
|---|---|---|
| id | INTEGER | PK, auto increment |
| title | VARCHAR(150) | required |
| notes | TEXT | optional |
| durationMinutes | INTEGER | required |
| workoutDate | DATEONLY | required |
| userId | INTEGER | FK → users.id |

### exercises

| Column | Type | Notes |
|---|---|---|
| id | INTEGER | PK, auto increment |
| name | VARCHAR(100) | required, unique |
| muscleGroup | ENUM | `chest`, `back`, `legs`, `shoulders`, `arms`, `core`, `cardio`, `full_body` |
| description | TEXT | optional |
| difficulty | ENUM | `beginner`, `intermediate`, `advanced` — default: `beginner` |

### workout_exercises (junction)

| Column | Type | Notes |
|---|---|---|
| id | INTEGER | PK |
| workoutId | INTEGER | FK → workouts.id |
| exerciseId | INTEGER | FK → exercises.id |
| sets | INTEGER | optional |
| reps | INTEGER | optional |
| weightKg | FLOAT | optional |
| notes | VARCHAR | optional |

### Relationships

```
User ──< Workouts         (one-to-many)
Workout >──< Exercise     (many-to-many via workout_exercises)
```

---

## API Reference

Base URL: `http://localhost:3000/api`

### Users

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/users` | — | Get all users |
| GET | `/users/:id` | — | Get a user with their workouts |
| POST | `/users` | `{ name, email, age?, fitnessGoal? }` | Create a user |
| PUT | `/users/:id` | Any updatable fields | Update a user |
| DELETE | `/users/:id` | — | Delete a user |

### Exercises

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/exercises` | — | Get all exercises |
| GET | `/exercises/:id` | — | Get a single exercise |
| POST | `/exercises` | `{ name, muscleGroup, description?, difficulty? }` | Create an exercise |
| PUT | `/exercises/:id` | Any updatable fields | Update an exercise |
| DELETE | `/exercises/:id` | — | Delete an exercise |

### Workouts

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/workouts` | — | Get all workouts with user info |
| GET | `/workouts/:id` | — | Get a workout with user and exercises |
| POST | `/workouts` | `{ title, durationMinutes, workoutDate, userId, notes? }` | Create a workout |
| PUT | `/workouts/:id` | Any updatable fields | Update a workout |
| DELETE | `/workouts/:id` | — | Delete a workout |
| POST | `/workouts/:id/exercises` | `{ exerciseId, sets?, reps?, weightKg?, notes? }` | Add an exercise to a workout |
| DELETE | `/workouts/:id/exercises/:exerciseId` | — | Remove an exercise from a workout |

---

## Error Handling

All errors return JSON with a consistent shape.

| Status | Cause | Response |
|---|---|---|
| 400 | Missing or invalid fields | `{ "error": "Validation error", "message": "..." }` |
| 404 | Resource not found | `{ "error": "User/Workout/Exercise not found" }` |
| 404 | Unknown route | `{ "error": "Route not found", "message": "Cannot GET ..." }` |
| 500 | Server error | `{ "error": "Internal Server Error", "message": "..." }` |

---

## Project Structure

```
fitness-tracker-api/
├── index.js
├── package.json
├── .env.example
├── config/
│   └── database.js
├── models/
│   ├── index.js           # Associations
│   ├── User.js
│   ├── Workout.js
│   ├── Exercise.js
│   └── WorkoutExercise.js
├── controllers/
│   ├── userController.js
│   ├── workoutController.js
│   └── exerciseController.js
├── routes/
│   ├── users.js
│   ├── workouts.js
│   └── exercises.js
├── middleware/
│   ├── logger.js
│   ├── notFound.js
│   └── errorHandler.js
└── docs/
    └── postman_collection.json
```
