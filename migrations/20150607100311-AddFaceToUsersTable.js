module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('Users','face',{type: DataTypes.STRING});
    done();
  },

  down: function (migration, DataTypes, done) {
    migration.removeColumn('Users','image');
    done();
  }
};
