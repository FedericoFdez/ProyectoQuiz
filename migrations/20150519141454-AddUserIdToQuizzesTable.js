module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('Quizzes','UserId',{type: DataTypes.BOOLEAN});
    done();
  },

  down: function (migration, DataTypes, done) {
    migration.removeColumn('Quizzes','UserId');
    done();
  }
};
