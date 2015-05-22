module.exports = {
  up: function (migration, DataTypes, done) {
    migration.createTable(
      'Quizzes', { id:    { type: DataTypes.INTEGER,
                            allowNull: false,
                            primaryKey: true,
                            autoIncrement: true,
                            unique: true },
                pregunta: { type: DataTypes.STRING },
                respuesta:{ type: DataTypes.STRING },
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
    migration.dropTable('Quizzes');
    done();
  }
}