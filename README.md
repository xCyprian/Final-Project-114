# Fitness Tracker API

## About

The Fitness Tracker API is a RESTful backend application built to solve the common problem of tracking personal fitness progress in a structured and accessible way. Many fitness enthusiasts struggle to keep consistent records of their workout sessions — what exercises they did, how many sets and reps they completed, and how their performance changes over time. This application provides a complete backend solution to manage that data programmatically.

The API allows users to be registered with a fitness goal (such as weight loss, muscle gain, or endurance). Each user can log multiple workout sessions, and each workout can contain multiple exercises — along with performance details like sets, reps, and weight lifted. This design reflects the real-world structure of a training program: a person follows a plan, performs workouts, and tracks individual exercises within each session.

The application is designed following REST principles, using proper HTTP methods and status codes for all operations. It follows the MVC (Model-View-Controller) architectural pattern to keep concerns separated and the codebase maintainable. All database credentials are managed securely through environment variables, and the API includes thorough input validation and error handling so that clients always receive clear, descriptive JSON responses — whether a request succeeds or fails.

This project was built using the Node.js ecosystem with Express.js as the web framework, Sequelize ORM for database interaction, and MySQL as the relational database. It demonstrates one-to-many (User → Workouts) and many-to-many (Workouts ↔ Exercises) database relationships, custom middleware for logging and error handling, and a clean MVC folder structure suitable for a real-world production API.

---

## Tech Stack

| Technology   | Version  | Purpose                          |
|--------------|----------|----------------------------------|
| Node.js      | 20.x     | JavaScript runtime environment   |
| Express.js   | 4.19.x   | Web framework and routing        |
| Sequelize    | 6.37.x   | ORM for database interaction     |
| MySQL        | 8.x      | Relational database              |
| dotenv       | 16.4.x   | Environment variable management  |
| mysql2       | 3.9.x    | MySQL driver for Node.js         |

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/fitness-tracker-api.git
cd fitness-tracker-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fitness_tracker
DB_USER=root
DB_PASS=yourpassword
PORT=3000
```

### 4. Create the Database

In MySQL, create the database:

```sql
CREATE DATABASE fitness_tracker;
```

### 5. Start the Server

```bash
npm start
```

Sequelize will automatically create all tables on startup. You should see:

```
Database connected and synced.
Server running on http://localhost:3000
```

---

## Database Schema

### `users` table

| Column      | Type         | Constraints                                                         |
|-------------|--------------|---------------------------------------------------------------------|
| id          | INTEGER      | PRIMARY KEY, AUTO INCREMENT                                         |
| name        | VARCHAR(100) | NOT NULL                                                            |
| email       | VARCHAR(150) | NOT NULL, UNIQUE                                                    |
| age         | INTEGER      | nullable                                                            |
| fitnessGoal | ENUM         | `weight_loss`, `muscle_gain`, `endurance`, `general_fitness`; NOT NULL |
| createdAt   | DATETIME     | auto-managed by Sequelize                                           |
| updatedAt   | DATETIME     | auto-managed by Sequelize                                           |

### `workouts` table

| Column          | Type         | Constraints                          |
|-----------------|--------------|--------------------------------------|
| id              | INTEGER      | PRIMARY KEY, AUTO INCREMENT          |
| title           | VARCHAR(150) | NOT NULL                             |
| notes           | TEXT         | nullable                             |
| durationMinutes | INTEGER      | NOT NULL                             |
| workoutDate     | DATEONLY     | NOT NULL                             |
| userId          | INTEGER      | FOREIGN KEY → users.id, NOT NULL     |
| createdAt       | DATETIME     | auto-managed                         |
| updatedAt       | DATETIME     | auto-managed                         |

### `exercises` table

| Column      | Type         | Constraints                                                                   |
|-------------|--------------|-------------------------------------------------------------------------------|
| id          | INTEGER      | PRIMARY KEY, AUTO INCREMENT                                                   |
| name        | VARCHAR(100) | NOT NULL, UNIQUE                                                              |
| muscleGroup | ENUM         | `chest`, `back`, `legs`, `shoulders`, `arms`, `core`, `cardio`, `full_body`   |
| description | TEXT         | nullable                                                                      |
| difficulty  | ENUM         | `beginner`, `intermediate`, `advanced`; default `beginner`                    |
| createdAt   | DATETIME     | auto-managed                                                                  |
| updatedAt   | DATETIME     | auto-managed                                                                  |

### `workout_exercises` table (junction)

| Column    | Type    | Constraints                             |
|-----------|---------|-----------------------------------------|
| id        | INTEGER | PRIMARY KEY, AUTO INCREMENT             |
| workoutId | INTEGER | FOREIGN KEY → workouts.id               |
| exerciseId| INTEGER | FOREIGN KEY → exercises.id              |
| sets      | INTEGER | nullable                                |
| reps      | INTEGER | nullable                                |
| weightKg  | FLOAT   | nullable                                |
| notes     | VARCHAR | nullable                                |

---

## Relationship Diagram (ER Diagram)

```
+----------+          +------------+          +--------------------+
|  users   |          |  workouts  |          |  workout_exercises |
+----------+          +------------+          +--------------------+
| id (PK)  |1       M | id (PK)    |1       M | id (PK)            |
| name     |----------| userId(FK) |----------| workoutId (FK)     |
| email    |          | title      |          | exerciseId (FK)    |
| age      |          | notes      |          | sets               |
| fitness  |          | duration   |          | reps               |
| Goal     |          | workoutDate|          | weightKg           |
+----------+          +------------+          | notes              |
                                              +--------------------+
                                                        |M
                                                        |
                                                        |1
                                              +-----------+
                                              | exercises |
                                              +-----------+
                                              | id (PK)   |
                                              | name      |
                                              | muscle    |
                                              | Group     |
                                              | difficulty|
                                              +-----------+

Relationships:
- User 1 ──< Workouts M   (one-to-many)
- Workout M >──< Exercise M  (many-to-many via workout_exercises)
```

---

## API Reference

### Users

| Method | Path             | Request Body                              | Response              |
|--------|------------------|-------------------------------------------|-----------------------|
| GET    | /api/users       | —                                         | Array of user objects |
| GET    | /api/users/:id   | —                                         | User + workouts       |
| POST   | /api/users       | `{ name, email, age?, fitnessGoal? }`    | Created user (201)    |
| PUT    | /api/users/:id   | Any updatable fields                      | Updated user          |
| DELETE | /api/users/:id   | —                                         | Success message       |

### Exercises

| Method | Path                 | Request Body                                  | Response               |
|--------|----------------------|-----------------------------------------------|------------------------|
| GET    | /api/exercises       | —                                             | Array of exercises     |
| GET    | /api/exercises/:id   | —                                             | Single exercise        |
| POST   | /api/exercises       | `{ name, muscleGroup, description?, difficulty? }` | Created exercise (201) |
| PUT    | /api/exercises/:id   | Any updatable fields                          | Updated exercise       |
| DELETE | /api/exercises/:id   | —                                             | Success message        |

### Workouts

| Method | Path                                   | Request Body                                              | Response                  |
|--------|----------------------------------------|-----------------------------------------------------------|---------------------------|
| GET    | /api/workouts                          | —                                                         | All workouts + user info  |
| GET    | /api/workouts/:id                      | —                                                         | Workout + user + exercises|
| POST   | /api/workouts                          | `{ title, durationMinutes, workoutDate, userId, notes? }` | Created workout (201)     |
| PUT    | /api/workouts/:id                      | Any updatable fields                                      | Updated workout           |
| DELETE | /api/workouts/:id                      | —                                                         | Success message           |
| POST   | /api/workouts/:id/exercises            | `{ exerciseId, sets?, reps?, weightKg?, notes? }`         | Workout with exercises (201)|
| DELETE | /api/workouts/:id/exercises/:exerciseId| —                                                         | Success message           |

---

## Error Responses

| Status | When it occurs                                   | JSON Structure                                              |
|--------|--------------------------------------------------|-------------------------------------------------------------|
| 400    | Missing required fields or validation failure    | `{ "error": "Validation error", "message": "..." }`        |
| 404    | Record not found by ID                           | `{ "error": "User/Workout/Exercise not found" }`            |
| 404    | Route does not exist                             | `{ "error": "Route not found", "message": "Cannot GET ..." }`|
| 500    | Unexpected server error                          | `{ "error": "Internal Server Error", "message": "..." }`   |

---

## Project Structure

```
fitness-tracker-api/
├── index.js                   # App entry point
├── package.json
├── .env.example
├── .gitignore
├── config/
│   └── database.js            # Sequelize connection
├── models/
│   ├── index.js               # Associations
│   ├── User.js
│   ├── Workout.js
│   ├── Exercise.js
│   └── WorkoutExercise.js     # Junction model
├── controllers/
│   ├── userController.js
│   ├── workoutController.js
│   └── exerciseController.js
├── routes/
│   ├── users.js
│   ├── workouts.js
│   └── exercises.js
├── middleware/
│   ├── logger.js              # Request logger
│   ├── notFound.js            # 404 handler
│   └── errorHandler.js        # Global error handler
└── docs/
    └── postman_collection.json
```
