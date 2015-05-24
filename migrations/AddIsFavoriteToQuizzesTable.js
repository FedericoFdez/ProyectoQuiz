module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('Quizzes','isFavorite',{type: DataTypes.BOOLEAN, 
			  									defaultValue: false		});
    done();
  },

  down: function (migration, DataTypes, done) {
    migration.removeColumn('Quizzes','isFavorite');
    done();
  }
};
