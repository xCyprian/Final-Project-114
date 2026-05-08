const { Exercise } = require('../models');

// GET /exercises — return all exercises
const getAllExercises = async (req, res, next) => {
  try {
    const exercises = await Exercise.findAll();
    res.json(exercises);
  } catch (err) {
    next(err);
  }
};

// GET /exercises/:id — return one exercise
const getExerciseById = async (req, res, next) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (err) {
    next(err);
  }
};

// POST /exercises — create a new exercise
const createExercise = async (req, res, next) => {
  try {
    const { name, muscleGroup, description, difficulty } = req.body;

    if (!name || !muscleGroup) {
      return res.status(400).json({ error: 'Validation error', message: 'name and muscleGroup are required.' });
    }

    const exercise = await Exercise.create({ name, muscleGroup, description, difficulty });
    res.status(201).json(exercise);
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Validation error', message: err.errors.map(e => e.message).join(', ') });
    }
    next(err);
  }
};

// PUT /exercises/:id — update an exercise
const updateExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    const { name, muscleGroup, description, difficulty } = req.body;
    await exercise.update({ name, muscleGroup, description, difficulty });
    res.json(exercise);
  } catch (err) {
    next(err);
  }
};

// DELETE /exercises/:id — delete an exercise
const deleteExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    await exercise.destroy();
    res.json({ message: `Exercise ${req.params.id} deleted successfully.` });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllExercises, getExerciseById, createExercise, updateExercise, deleteExercise };
