const orm = require('./../config/orm');
const sha1 = require('sha1');
const logger = require('../config/logger/winston.js');
const songs_recommendator = require('../config/recommendation_engines/songs_recommendation_engine');

// add query functions
module.exports = {
  createArtist: createArtist,
  getAllArtists: getAllArtists,
  getArtistById: getArtistById,
  updateArtist: updateArtist,
  removeArtist: removeArtist,
  getSongsFromArtist: getSongsFromArtist,
  getFavorites: getFavorites,
  followArtist: followArtist,
  unfollowArtist: unfollowArtist,
  updateArtistPopularity: updateArtistPopularity,
  getRecommendedArtists: getRecommendedArtists
};

function createArtist(artist) {
  return orm.models.artist.create(artist);
}

function getAllArtists(ids, name, userId) {
  if (!name)
    var name = '';
  if (ids){
    var ids = JSON.parse("[" + ids + "]");
    return orm.models.artist.findAll({
      attributes: ['id', 'name', 'genres', 'images', 'popularity'],
      include: [
        { model: orm.models.album, attributes: [ 'id', 'name' ], through: {attributes:[] }},
        { model: orm.models.user, where: { id: userId} , required: false, attributes: ['id', 'userName'], through: {attributes:[] }, as: 'followed' },
      ],
      where: {
        id: { $in: ids },
        name: { $ilike: '%' + name + '%' }
      },
      order: [ ['id', 'ASC'] ]
    });
  } else
    return orm.models.artist.findAll({
      attributes: ['id', 'name', 'genres', 'images', 'popularity'],
      include: [
        { model: orm.models.album, attributes: [ 'id', 'name' ], through: {attributes:[] }},
        { model: orm.models.user, where: { id: userId} , required: false, attributes: ['id', 'userName'], through: {attributes:[] }, as: 'followed' },
      ],
      where: {
        name: { $ilike: '%' + name + '%' }
      },
      order: [ ['id', 'ASC'] ]
    });
}

function getArtistById(artistId) {
  return orm.models.artist.findOne({
    include: [ { model: orm.models.album, attributes: [ 'id', 'name' ], through: {attributes:[] }}],
    where: { id: artistId }
  });
}

function updateArtist(artist, id) {
  return orm.models.artist.update(artist, { where: { id: id }, returning: true, plain: true });
}

function removeArtist(artistId) {
  return orm.models.artist.destroy( { where: { id: artistId }, returning: true, plain: true } );
}

function getSongsFromArtist(artistId) {
  return orm.models.artist.findById(artistId).then(function(artist) {
    return artist.getSongs({
      attributes: ['id', 'name' ]
    });
  })
}

function followArtist(userId, artistId) {
  return orm.models.user.findById(userId).then(function(user) {
    user.addArtist(artistId);
    return orm.models.artist.findById(artistId);
  })
}

function unfollowArtist(userId, artistId) {
  return orm.models.user.findById(userId).then(function(user) {
    return user.removeArtist(artistId);
  })
}

function updateArtistPopularity(artistId) {
  return orm.models.artist.findById(artistId).then(function(artist) {
    if (!artist) {
      var err = new Error('Not found');
      err.status = 404;
      throw err;
    }
    return artist.getSongs().then(function(songs) {
      var sum = 0
      var count = songs.length;
      for (var songIndex = 0, len = songs.length; songIndex < len; songIndex++) {
        if(songs[songIndex].dataValues.popularity)
          sum += songs[songIndex].dataValues.popularity;
      }
      popularity = { popularity: parseInt(sum / count) };
      return orm.models.artist.update(popularity, { where: { id: artistId } } );
    })
  });
}

function getFavorites(userId) {
  return orm.models.user.findById(userId).then(function(user) {
    return user.getArtists();
  });
}

function getRecommendedArtists(userId) {
  return songs_recommendator.recommendFor(userId, 5).then((results) => {
    return orm.models.song.findAll({
      attributes: ['id'],
      include: [ { model: orm.models.artist, through: { attributes: [] } }],
      where: { id: { $in: results } },
      order: [ ['id', 'ASC'] ]
    });
  });
}
