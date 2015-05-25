module.exports = {
  up: function (migration, DataTypes, done) {
    migration.createTable(
      'Favourites', { id: { type: DataTypes.INTEGER,
                            allowNull: false,
                            primaryKey: true,
                            autoIncrement: true,
                            unique: true },
                UserId:   { type: DataTypes.INTEGER,
                            allowNull: false },
                QuizId:   { type: DataTypes.INTEGER,
                            allowNull: false },
                createdAt:{ type: DataTypes.DATE,
                            allowNull: false},
                updatedAt:{ type: DataTypes.DATE,
                            allowNull: false}
              },
              { sync: {force:true} }
    );
    done();
  },

  down: function (migration, DataTypes, done) {
    migration.dropTable('Favourites');
    done();
  }
};
