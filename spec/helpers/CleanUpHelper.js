'use strict';

const Sequelize = require('sequelize'),
  models = require('./../../server/models/models'),
  orm = require('./../../server/config/orm'),
  dataCreation = require('./../../server/models/scripts/dataCreation'),
  db = new Sequelize(orm.DB_URL, { logging: false }),
  server = require('../../bin/www.js');
/**
 * Override the finishCallback so we can add some cleanup methods.
 * This is run after all tests have been completed.
 */
var _finishCallback = jasmine.Runner.prototype.finishCallback;
jasmine.Runner.prototype.finishCallback = function () {
    // Run the old finishCallback
    _finishCallback.bind(this)();
    // add your cleanup code here...
    models.define(db);
    db.sync({ force: true }).then(() => dataCreation.execute(db)).then(() => {
      exports.models = db.models;
      var user = db.models.user;
      user.belongsToMany(user, { as: 'Friend', through: 'user_contacts', foreignKey: 'friend_id' });
      user.belongsToMany(user, { as: 'User', through: 'user_contacts', foreignKey: 'user_id' });
      exports.sequelize = db;
      server.closeServer();
    });
};

beforeEach(function(done){
  process.env.NODE_ENV='test';
  done();
});
