module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('Quizzes','image',{type: DataTypes.STRING});
    done();
  },

  down: function (migration, DataTypes, done) {
    migration.removeColumn('Quizzes','image');
    done();
  }
};
