module.exports = {
  up: function (migration, DataTypes, done) {
        migration.createTable(
          'Quizzes', { id:    { type: DataTypes.INTEGER,
                                allowNull: false,
                                primaryKey: true,
                                autoIncrement: true,
                                unique: true },
                    pregunta: { type: DataTypes.STRING,
                                validate: { notEmpty: {msg: "· Falta Pregunta"}}
                              },
                    respuesta:{ type: DataTypes.STRING,
                                validate: { notEmpty: {msg: "· Falta Respuesta"}}
                              },
                    createdAt:{ type: DataTypes.DATE,
                                allowNull: false},
                    updatedAt:{ type: DataTypes.DATE,
                                allowNull: false}
                  },
                  { sync: {force:true} });
        done();
  },
    down: function (migration, DataTypes, done) {
      migration.dropTable('Quizzes');
      done();
    }
  }