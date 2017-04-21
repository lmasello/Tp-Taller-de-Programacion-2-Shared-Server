const orm = require('./../config/orm');
const sha1 = require('sha1');
const logger = require('../config/logger/winston.js');

// add query functions
module.exports = {
  createSong: createSong,
  getAllSongs: getAllSongs,
  getSongById: getSongById,
  updateSong: updateSong,
  removeSong: removeSong,
  rankSong: rankSong,
  likeSong: likeSong,
  dislikeSong: dislikeSong
};

function createSong(song_params) {
  return orm.models.song.create(song_params).then(function(song) {
    var artists = JSON.parse(song_params.artists);
    debugger;
    for (var artistIndex = 0, len = artists.length; artistIndex < len; artistIndex++) {
      artistId = artists[artistIndex];
      song.addArtist(artistId);
    }
    return song;
  })
}

function getAllSongs(ids) {
  if (ids){
    var ids = JSON.parse("[" + ids + "]");
    return orm.models.song.findAll({
      attributes: ['id', 'name', 'duration', 'albumId'],
      include: [ { model: orm.models.artist, attributes: [ 'id', 'name' ], through: {attributes:[] }}],
      where: { id: { $in: ids } },
      order: [ ['id', 'ASC'] ]
    });
  } else
    return orm.models.song.findAll({
      attributes: ['id', 'name', 'duration', 'albumId'],
      include: [ { model: orm.models.artist, attributes: [ 'id', 'name' ], through: {attributes:[] }}],
      order: [ ['id', 'ASC'] ]
    });
}

function getSongById(songId) {
  return orm.models.song.findOne({ where: { id: songId } });
}

function updateSong(song, id) {
  return orm.models.song.update(song, { where: { id: id }, returning: true, plain: true });
}

function removeSong(songId) {
  return orm.models.song.destroy( { where: { id: songId } } );
}

function rankSong(songId, userId, values) {
  return orm.models.song.findById(songId).then(function(song) {
    return song.addUser(userId, { rate: values.rate });
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
