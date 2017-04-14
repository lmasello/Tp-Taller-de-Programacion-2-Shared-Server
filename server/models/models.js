const user = require('./user');

exports.define = (db) => {
  user.getModel(db);
};
