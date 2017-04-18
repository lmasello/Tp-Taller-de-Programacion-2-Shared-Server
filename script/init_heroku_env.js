require('dotenv').load();
const Sequelize = require('sequelize'),
  models = require('./../server/models/models'),
  dataCreation = require('./../server/models/scripts/dataCreation'),
  db = new Sequelize(process.env.DATABASE_URL, { logging: false });

models.define(db);
db.sync({ force: true }).then(() => dataCreation.execute(db)).then(() => {
  exports.models = db.models;
  exports.sequelize = db;
});
