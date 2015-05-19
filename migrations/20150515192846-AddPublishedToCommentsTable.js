module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('Comments','publicado',{type: DataTypes.BOOLEAN, defaultValue: false});
    done();
  },

  down: function (migration, DataTypes, done) {
    migration.removeColumn('Comments','publicado');
    done();
  }
};
