require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');

// Import models to register associations
require('./models');

// Middleware
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Routes
const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware
app.use(express.json());

// Custom logger middleware
app.use(logger);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Fitness Tracker API is running.' });
});

// 404 catch-all (must be after all routes)
app.use(notFound);

// Global error handler (must be last, must have 4 params)
app.use(errorHandler);

// Connect to DB and start server
sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('Database connected and synced.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  });
