const User = require('./User');
const Workout = require('./Workout');
const Exercise = require('./Exercise');
const WorkoutExercise = require('./WorkoutExercise');

// One-to-Many: A User has many Workouts
User.hasMany(Workout, { foreignKey: 'userId', onDelete: 'CASCADE' });
Workout.belongsTo(User, { foreignKey: 'userId' });

// Many-to-Many: A Workout has many Exercises through WorkoutExercise
Workout.belongsToMany(Exercise, { through: WorkoutExercise, foreignKey: 'workoutId' });
Exercise.belongsToMany(Workout, { through: WorkoutExercise, foreignKey: 'exerciseId' });

module.exports = { User, Workout, Exercise, WorkoutExercise };
