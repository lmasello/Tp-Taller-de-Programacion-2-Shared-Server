const Sequelize = require('sequelize'),
  config = require('./config'),
  models = require('./../models/models'),
  logger = require('./logger/winston.js');

exports.DB_URL = config.postgres.uri
exports.init = () => {
  const db = new Sequelize(config.postgres.uri, { logging: logger.info });
  models.define(db);
  exports.models = db.models;
  exports.sequelize = db;
  return config.logger.name === 'test' ? Promise.resolve() : db.sync();
};
