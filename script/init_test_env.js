const Sequelize = require('sequelize'),
  models = require('./../server/models/models'),
  dataCreation = require('./../server/models/scripts/dataCreation'),
  db = new Sequelize(process.env.DATABASE_TEST_URL, { logging: false });

process.env.NODE_ENV='test';
models.define(db);
db.sync({ force: true }).then(() => dataCreation.execute(db)).then(() => {
  db.models.user.belongsToMany(db.models.user, { as: 'Friend', through: 'user_contacts', foreignKey: 'friend_id' });
  db.models.user.belongsToMany(db.models.user, { as: 'User', through: 'user_contacts', foreignKey: 'user_id' });
  exports.models = db.models;
  exports.sequelize = db;
});
