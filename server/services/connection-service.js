// Reference:
// http://mherman.org/blog/2016/03/13/designing-a-restful-api-with-node-and-postgres/#.WNHTFvHys8o
var promise = require('bluebird');
const config = require('../config/config');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp(config.postgres.uri);

module.exports = db;
