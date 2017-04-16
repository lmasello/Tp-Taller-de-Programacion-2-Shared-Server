const Sequelize = require('sequelize'),
  models = require('./../server/models/models'),
  dataCreation = require('./../server/models/scripts/dataCreation'),
  db = new Sequelize(process.env.DATABASE_TEST_URL, { logging: false });

process.env.NODE_ENV='test';
models.define(db);
db.sync({ force: true }).then(() => dataCreation.execute(db)).then(() => {
  exports.models = db.models;
  exports.sequelize = db;
});
