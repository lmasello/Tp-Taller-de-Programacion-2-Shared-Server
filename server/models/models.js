const user = require('./user');
const song = require('./song');
const user_song = require('./user_song');
const artist = require('./artist');
const album = require('./album');

exports.define = (db) => {
  var User = user.getModel(db);
  var Song = song.getModel(db);
  var UserSong = user_song.getModel(db);
  var Artist = artist.getModel(db);
  var Album = album.getModel(db);

  User.belongsToMany(Song, { through: UserSong });
  Song.belongsToMany(User, { through: UserSong });

  Artist.belongsToMany(User, { through: 'user_artist' });
  User.belongsToMany(Artist, { through: 'user_artist' });

  Artist.belongsToMany(Song, { through: 'artist_song' });
  Song.belongsToMany(Artist, { through: 'artist_song' });

  Song.belongsTo(Album, { foreignKey: 'albumId' } );
  Album.hasMany(Song, { onDelete: 'CASCADE' } );

  Artist.belongsToMany(Album, { through: 'artist_album' });
  Album.belongsToMany(Artist, { through: 'artist_album' });
};
