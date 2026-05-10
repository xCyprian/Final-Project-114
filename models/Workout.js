const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Workout = sequelize.define('Workout', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  workoutDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'workouts',
  timestamps: true,
});

module.exports = Workout;
