module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('Quizzes','UserId',{type: DataTypes.BOOLEAN});
    done();
  },

  down: function (queryInterface, Sequelize) {
    migration.removeColumn('Quizzes','UserId');
    done();
  }
};
