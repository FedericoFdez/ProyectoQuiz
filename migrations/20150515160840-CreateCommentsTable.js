module.exports = {
  up: function (migration, DataTypes, done) {
    migration.createTable(
      'Comments', { id:   { type: DataTypes.INTEGER,
                            allowNull: false,
                            primaryKey: true,
                            autoIncrement: true,
                            unique: true },
                    texto:{ type: DataTypes.STRING },
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