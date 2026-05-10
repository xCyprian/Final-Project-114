const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Junction table for the many-to-many relationship between Workouts and Exercises
const WorkoutExercise = sequelize.define('WorkoutExercise', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  weightKg: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'workout_exercises',
  timestamps: false,
});

module.exports = WorkoutExercise;
