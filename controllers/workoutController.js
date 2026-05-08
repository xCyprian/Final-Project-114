const { Workout, User, Exercise, WorkoutExercise } = require('../models');

// GET /workouts — return all workouts with their owner
const getAllWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });
    res.json(workouts);
  } catch (err) {
    next(err);
  }
};

// GET /workouts/:id — return one workout with user and exercises
const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        {
          model: Exercise,
          through: { attributes: ['sets', 'reps', 'weightKg', 'notes'] },
        },
      ],
    });
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout);
  } catch (err) {
    next(err);
  }
};

// POST /workouts — create a new workout
const createWorkout = async (req, res, next) => {
  try {
    const { title, notes, durationMinutes, workoutDate, userId } = req.body;

    if (!title || !durationMinutes || !workoutDate || !userId) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'title, durationMinutes, workoutDate, and userId are required.',
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: 'Validation error', message: `User with id ${userId} does not exist.` });
    }

    const workout = await Workout.create({ title, notes, durationMinutes, workoutDate, userId });
    res.status(201).json(workout);
  } catch (err) {
    next(err);
  }
};

// PUT /workouts/:id — update a workout
const updateWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    const { title, notes, durationMinutes, workoutDate } = req.body;
    await workout.update({ title, notes, durationMinutes, workoutDate });
    res.json(workout);
  } catch (err) {
    next(err);
  }
};

// DELETE /workouts/:id — delete a workout
const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    await workout.destroy();
    res.json({ message: `Workout ${req.params.id} deleted successfully.` });
  } catch (err) {
    next(err);
  }
};

// POST /workouts/:id/exercises — add an exercise to a workout (many-to-many)
const addExerciseToWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    const { exerciseId, sets, reps, weightKg, notes } = req.body;
    if (!exerciseId) {
      return res.status(400).json({ error: 'Validation error', message: 'exerciseId is required.' });
    }

    const exercise = await Exercise.findByPk(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: `Exercise with id ${exerciseId} not found.` });
    }

    await workout.addExercise(exercise, { through: { sets, reps, weightKg, notes } });

    const updated = await Workout.findByPk(req.params.id, {
      include: [{ model: Exercise, through: { attributes: ['sets', 'reps', 'weightKg', 'notes'] } }],
    });
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /workouts/:id/exercises/:exerciseId — remove an exercise from a workout
const removeExerciseFromWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    const exercise = await Exercise.findByPk(req.params.exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    await workout.removeExercise(exercise);
    res.json({ message: `Exercise ${req.params.exerciseId} removed from workout ${req.params.id}.` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
};
