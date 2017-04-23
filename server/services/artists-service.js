const orm = require('./../config/orm');
const sha1 = require('sha1');
const logger = require('../config/logger/winston.js');

// add query functions
module.exports = {
  createArtist: createArtist,
  getAllArtists: getAllArtists,
  getArtistById: getArtistById,
  updateArtist: updateArtist,
  removeArtist: removeArtist,
  getSongsFromArtist: getSongsFromArtist,
  followArtist: followArtist,
  unfollowArtist: unfollowArtist
};

function createArtist(artist) {
  return orm.models.artist.create(artist);
}

function getAllArtists(ids) {
  if (ids){
    var ids = JSON.parse("[" + ids + "]");
    return orm.models.artist.findAll({
      attributes: ['id', 'name', 'genres', 'images', 'popularity'],
      where: { id: { $in: ids } },
      order: [ ['id', 'ASC'] ]
    });
  } else
    return orm.models.artist.findAll({
      attributes: ['id', 'name', 'genres', 'images', 'popularity'],
      order: [ ['id', 'ASC'] ]
    });
}

function getArtistById(artistId) {
  return orm.models.artist.findOne({ where: { id: artistId } });
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
