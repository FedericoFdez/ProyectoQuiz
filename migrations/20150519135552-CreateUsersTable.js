module.exports = {
  up: function (migration, DataTypes, done) {
    migration.createTable(
      'Users', {    id:{    type: DataTypes.INTEGER,
                            allowNull: false,
                            primaryKey: true,
                            autoIncrement: true,
                            unique: true },
              username:{    type: DataTypes.STRING,
                            unique: true},
              password:{    type: DataTypes.STRING },
              isAdmin:{     type: DataTypes.BOOLEAN,
                            defaultValue:false},
            createdAt:{     type: DataTypes.DATE,
                            allowNull: false},
            updatedAt:{     type: DataTypes.DATE,
                            allowNull: false}
          },
          { sync: {force:true} }
    );

    done();
  },

  down: function (migration, DataTypes, done) {
    migration.dropTable('Users');
      done();
  }
};
