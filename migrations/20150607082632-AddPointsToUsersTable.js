module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('Users','points',{type: DataTypes.INTEGER,
                        defaultValue: 0,
                        allowNull: false});
    done();
  },

  down: function (migration, DataTypes, done) {
    migration.removeColumn('Quizzes','UserId');
    done();
  }
};
