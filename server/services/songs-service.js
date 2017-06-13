const orm = require('./../config/orm');
const sha1 = require('sha1');
const logger = require('../config/logger/winston.js');
var artistsService = require('./artists-service');
const songs_recommendator = require('../config/recommendation_engines/songs_recommendation_engine');

// add query functions
module.exports = {
  createSong: createSong,
  getAllSongs: getAllSongs,
  getFavorites: getFavorites,
  getSongById: getSongById,
  updateSong: updateSong,
  removeSong: removeSong,
  rankSong: rankSong,
  getSongPopularity: getSongPopularity,
  likeSong: likeSong,
  dislikeSong: dislikeSong,
  getRecommendedSong: getRecommendedSong
};

function createSong(song_params) {
  return orm.models.song.create(song_params).then(function(song) {
    var artists = JSON.parse(song_params.artists);
    for (var artistIndex = 0, len = artists.length; artistIndex < len; artistIndex++) {
      artistId = artists[artistIndex];
      song.addArtist(artistId);
    }
    return song;
  })
}

function getAllSongs(ids, name) {
  if (!name)
    var name = '';
  if (ids){
    var ids = JSON.parse("[" + ids + "]");
    return orm.models.song.findAll({
      attributes: ['id', 'name', 'duration'],
      include: [ { model: orm.models.artist, attributes: [ 'id', 'name' ], through: {attributes:[] }}],
      where: {
        id: { $in: ids },
        name: { $ilike: '%' + name + '%' }
      },
      order: [ ['id', 'ASC'] ]
    });
  } else
    return orm.models.song.findAll({
      attributes: ['id', 'name', 'duration'],
      include: [
        { model: orm.models.artist, attributes: [ 'id', 'name' ], through: {attributes:[] }},
        { model: orm.models.album },
      ],
      where: {
        name: { $ilike: '%' + name + '%' }
      },
      order: [ ['id', 'ASC'] ]
    });
}

function getSongById(songId, userId) {
  return orm.models.song.findOne({
    where: { id: songId },
    include: [
      { model: orm.models.artist, attributes: [ 'id', 'name' ], through: {attributes:[] }},
      { model: orm.models.album },
      { model: orm.models.user, where: { id: userId} , required: false, attributes: ['id', 'userName'] }
    ]
  });
}

function updateSong(song, id) {
  return orm.models.song.update(song, { where: { id: id }, returning: true, plain: true });
}

function removeSong(songId) {
  return orm.models.song.destroy( { where: { id: songId } } );
}

function rankSong(songId, userId, values) {
  return orm.models.song.findById(songId).then(function(song) {
    return song.addUser(userId, { rate: values.rate }).then(function() {
      getSongPopularity(songId).then(function(data) {
        popularity = { popularity: parseInt(data[0].rate) };
        return orm.models.song.update(popularity, { where: { id: songId } } ).then(function () {
          return song.getArtists().then(function (artists) {
            for (var artistIndex = 0, len = artists.length; artistIndex < len; artistIndex++) {
              artistsService.updateArtistPopularity(artists[artistIndex].dataValues.id);
            }
          });
        });
      });
      return song;
    });
  });
}

function getSongPopularity(songId) {
  return orm.models.song.findById(songId).then(function(song) {
    if (!song) {
      var err = new Error('Not found');
      err.status = 404;
      throw err;
    }
    return orm.sequelize.query(
      'SELECT AVG(rate) AS rate ' +
      'FROM user_songs ' +
      'WHERE song_id = $1 ', { bind: [songId], type: orm.sequelize.QueryTypes.SELECT }
    );
  });
}

function getFavorites(userId) {
  return orm.models.user.findById(userId).then(function(user) {
    return user.getSongs({
      attributes: ['id', 'name', 'duration', 'album_id'],
      through: {
        where: { liked: true }
      }
    });
  })
}

function likeSong(songId, userId) {
  return orm.models.song.findById(songId).then(function(song) {
    return songs_recommendator.liked(userId, songId).then(function() {
      return song.addUser(userId, { liked: true });
    });
  });
}

function dislikeSong(songId, userId) {
  return orm.models.song.findById(songId).then(function(song) {
    return songs_recommendator.unliked(userId, songId).then(function() {
      return song.addUser(userId, { liked: false });
    });
  });
}

function getRecommendedSong(userId) {
  return songs_recommendator.recommendFor(userId, 5).then((results) => {
    return orm.models.song.findAll({
      attributes: ['id', 'name', 'duration', 'album_id'],
      include: [ { model: orm.models.artist, attributes: [ 'id', 'name' ], through: {attributes:[] }}],
      where: { id: { $in: results } },
      order: [ ['id', 'ASC'] ]
    });
  });
}
