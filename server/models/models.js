const user = require('./user');
const song = require('./song');

exports.define = (db) => {
  user.getModel(db);
  song.getModel(db);
};
