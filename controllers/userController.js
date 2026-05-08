const { User, Workout } = require('../models');

// GET /users — return all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// GET /users/:id — return one user with their workouts
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Workout }],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// POST /users — create a new user
const createUser = async (req, res, next) => {
  try {
    const { name, email, age, fitnessGoal } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Validation error', message: 'name and email are required.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Validation error', message: 'A user with this email already exists.' });
    }

    const user = await User.create({ name, email, age, fitnessGoal });
    res.status(201).json(user);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Validation error', message: err.errors.map(e => e.message).join(', ') });
    }
    next(err);
  }
};

// PUT /users/:id — update a user
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, email, age, fitnessGoal } = req.body;
    await user.update({ name, email, age, fitnessGoal });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// DELETE /users/:id — delete a user
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ message: `User ${req.params.id} deleted successfully.` });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
