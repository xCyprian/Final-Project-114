const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fitnessGoal: {
    type: DataTypes.ENUM('weight_loss', 'muscle_gain', 'endurance', 'general_fitness'),
    allowNull: false,
    defaultValue: 'general_fitness',
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
