const orm = require('./../config/orm');
const sha1 = require('sha1');
const logger = require('../config/logger/winston.js');

// add query functions
module.exports = {
  createSong: createSong,
  getAllSongs: getAllSongs,
  getSongById: getSongById,
  updateSong: updateSong,
  removeSong: removeSong
};

function createSong(song) {
  return orm.models.song.create(song);
}

function getAllSongs(ids) {
  if (ids){
    var ids = JSON.parse("[" + ids + "]");
    return orm.models.song.findAll({
      attributes: ['id', 'name'],
      where: { id: { $in: ids } }
    });
  } else
    return orm.models.song.findAll({
      attributes: ['id', 'name']
    });
}

function getSongById(songId) {
  return orm.models.song.findOne({ where: { id: songId } });
}

function updateSong(song, id) {
  return orm.models.song.update(song, { where: { id: id }, returning: true, plain: true });
}

function removeSong(songId) {
  return orm.models.song.destroy( { where: { id: songId }, returning: true, plain: true } );
}
