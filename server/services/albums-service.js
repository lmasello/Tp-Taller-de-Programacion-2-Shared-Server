const orm = require('./../config/orm');
const sha1 = require('sha1');
const logger = require('../config/logger/winston.js');

// add query functions
module.exports = {
  createAlbum: createAlbum,
  getAllAlbums: getAllAlbums,
  getAlbumById: getAlbumById,
  updateAlbum: updateAlbum,
  removeAlbum: removeAlbum,
  removeSongFromAlbum: removeSongFromAlbum
};

function createAlbum(album_params) {
  return orm.models.album.create(album_params).then(function(album) {
    var artists = JSON.parse(album_params.artists);
    for (var artistIndex = 0, len = artists.length; artistIndex < len; artistIndex++) {
      artistId = artists[artistIndex];
      album.addArtist(artistId);
    }
    return album;
  })
}

function getAllAlbums(ids) {
  if (ids){
    var ids = JSON.parse("[" + ids + "]");
    return orm.models.album.findAll({
      attributes: ['id', 'name', 'release_date', 'genres', 'images'],
      include: [ { model: orm.models.artist, attributes: [ 'id', 'name' ], through: {attributes:[] } },
                 { model: orm.models.song, attributes: [ 'id', 'name' ], through: {attributes:[] } }],
      where: { id: { $in: ids } },
      order: [ ['id', 'ASC'] ]
    });
  } else
    return orm.models.album.findAll({
      attributes: ['id', 'name', 'release_date', 'genres', 'images'],
      include: [ { model: orm.models.artist}, { model: orm.models.song }],
      order: [ ['id', 'ASC'] ]
    });
}

function getAlbumById(albumId) {
  return orm.models.album.findOne({ where: { id: albumId } });
}

function updateAlbum(album, id) {
  return orm.models.album.update(album, { where: { id: id }, returning: true, plain: true });
}

function removeAlbum(albumId) {
  return orm.models.album.destroy( { where: { id: albumId } } );
}

function removeSongFromAlbum(albumId, songId) {
  return orm.models.album.findById(albumId).then(function(album) {
    return album.deleteSong(songId);
  });
}

function likeSong(songId, userId) {
  return orm.models.song.findById(songId).then(function(song) {
    return song.addUser(userId, { liked: true });
  });
}

function dislikeSong(songId, userId) {
  return orm.models.song.findById(songId).then(function(song) {
    return song.addUser(userId, { liked: false });
  });
}
