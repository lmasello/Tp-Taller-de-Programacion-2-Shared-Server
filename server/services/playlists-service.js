const orm = require('./../config/orm');
const sha1 = require('sha1');
const logger = require('../config/logger/winston.js');

// add query functions
module.exports = {
  createPlaylist: createPlaylist,
  getAllPlaylists: getAllPlaylists,
  getPlaylistById: getPlaylistById,
  updatePlaylist: updatePlaylist,
  removePlaylist: removePlaylist,
  addSongToPlaylist: addSongToPlaylist,
  deleteSongFromPlaylist: deleteSongFromPlaylist,
  getSongsFromPlaylist: getSongsFromPlaylist,
  addAlbumToPlaylist: addAlbumToPlaylist,
  deleteAlbumFromPlaylist: deleteAlbumFromPlaylist,
  getAlbumsFromPlaylist: getAlbumsFromPlaylist
};

function createPlaylist(playlist_params) {
  return orm.models.playlist.create(playlist_params);
}

function getAllPlaylists(ids) {
  if (ids){
    var ids = JSON.parse("[" + ids + "]");
    return orm.models.playlist.findAll({
      attributes: ['id', 'name', 'description'],
      include: [
        { model: orm.models.user, attributes: [ 'id', 'userName' ] },
        { model: orm.models.song, attributes: [ 'id', 'name' ], through: {attributes:[] } }
      ],
      where: { id: { $in: ids } },
      order: [ ['id', 'ASC'] ]
    });
  } else
    return orm.models.playlist.findAll({
      attributes: ['id', 'name', 'description'],
      include: [
        { model: orm.models.user, attributes: [ 'id', 'userName' ] },
        { model: orm.models.song, attributes: [ 'id', 'name' ], through: {attributes:[] } }
      ],
      order: [ ['id', 'ASC'] ]
    });
}

function getPlaylistById(playlistId) {
  return orm.models.playlist.findOne({
    where: { id: playlistId },
    attributes: ['id', 'name', 'description'],
    include: [
      { model: orm.models.user, attributes: [ 'id', 'userName' ] },
      { model: orm.models.song, attributes: [ 'id', 'name' ], through: {attributes:[] } }
    ]
  });
}

function updatePlaylist(playlist, id) {
  return orm.models.playlist.update(playlist, { where: { id: id }, returning: true, plain: true });
}

function removePlaylist(playlistId) {
  return orm.models.playlist.destroy( { where: { id: playlistId } } );
}

function addSongToPlaylist(playlistId, songId) {
  return orm.models.playlist.findById(playlistId).then(function(playlist) {
    return orm.models.song.findById(songId).then(function(song) {
      if(!playlist || !song){
        var err = new Error('Not found');
        err.status = 404;
        throw err;
      }
      playlist.addSong(song);
      return getPlaylistById(playlistId);
    });
  });
}

function deleteSongFromPlaylist(playlistId, songId) {
  return orm.models.playlist.findById(playlistId).then(function(playlist) {
    return orm.models.song.findById(songId).then(function(song) {
      if(!playlist || !song){
        var err = new Error('Not found');
        err.status = 404;
        throw err;
      }
      return playlist.removeSong(song);
    });
  });
}

function getSongsFromPlaylist(playlistId) {
  return orm.models.playlist.findById(playlistId).then(function(playlist) {
    if(!playlist){
      var err = new Error('Not found');
      err.status = 404;
      throw err;
    }
    return playlist.getSongs({
      attributes: ['id', 'name'],
      joinTableAttributes: []
    });
  });
}

function addAlbumToPlaylist(playlistId, albumId) {
  return orm.models.playlist.findById(playlistId).then(function(playlist) {
    return orm.models.album.findById(albumId).then(function(album) {
      if(!playlist || !album){
        var err = new Error('Not found');
        err.status = 404;
        throw err;
      }
      playlist.addAlbum(album);
      return album.getSongs().then(function(songs) {
        for (var songIndex = 0, len = songs.length; songIndex < len; songIndex++) {
          song = songs[songIndex];
          playlist.addSong(song);
        }
        return playlist;
      });
    });
  });
}

function deleteAlbumFromPlaylist(playlistId, albumId) {
  return orm.models.playlist.findById(playlistId).then(function(playlist) {
    return playlist.getAlbums({ where: { id: { $eq: albumId } } }).then(function(album) {
      album = album[0];
      if(!playlist || !album){
        var err = new Error('Not found');
        err.status = 404;
        throw err;
      }
      album.getSongs().then(function(songs) {
        for (var songIndex = 0, len = songs.length; songIndex < len; songIndex++) {
          song = songs[songIndex];
          playlist.removeSong(song);
        }
      });
      return playlist.removeAlbum(album);
    });
  });
};

function getAlbumsFromPlaylist(playlistId) {
  return orm.models.playlist.findById(playlistId).then(function(playlist) {
    if(!playlist){
      var err = new Error('Not found');
      err.status = 404;
      throw err;
    }
    return playlist.getAlbums({
      attributes: ['id', 'name'],
      include: [ { model: orm.models.artist, attributes: [ 'id', 'name' ], through: {attributes:[] } },
                 { model: orm.models.song }],
      joinTableAttributes: []
    });
  });
}
