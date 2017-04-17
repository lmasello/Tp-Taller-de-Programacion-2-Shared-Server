const user = require('./user');
const song = require('./song');
const user_song = require('./user_song');

exports.define = (db) => {
  var User = user.getModel(db);
  var Song = song.getModel(db);
  var UserSong = user_song.getModel(db);
  User.belongsToMany(Song, { through: UserSong });
  Song.belongsToMany(User, { through: UserSong });
};
