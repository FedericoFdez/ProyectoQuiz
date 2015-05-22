module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('Quizzes','UserId',{type: DataTypes.INTEGER,
    										defaultValue: 1,
    										allowNull: false});
    done();
  },

  down: function (migration, DataTypes, done) {
    migration.removeColumn('Quizzes','UserId');
    done();
  }
};
