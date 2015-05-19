module.exports = {
  up: function (migration, DataTypes, done) {
    migration.createTable(
      'Comments', { id:   { type: DataTypes.INTEGER,
                            allowNull: false,
                            primaryKey: true,
                            autoIncrement: true,
                            unique: true },
                    texto:{ type: DataTypes.STRING,
                            validate: { notEmpty: {msg: "· Falta Comentario"}} },
                   QuizId:{ type: DataTypes.INTEGER,
                            allowNull:false},
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
    migration.dropTable('Comments');
    done();
  }
}