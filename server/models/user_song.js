const Sequelize = require('sequelize');

exports.getModel = (db) => {
  var UserSong = db.define('user_song', {
    liked: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    ranking: { type: Sequelize.INTEGER, allowNull: true, validate: { min: 1, max: 5} }
  });
  return UserSong;
};
