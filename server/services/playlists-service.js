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
};

function createPlaylist(playlist_params) {
  return orm.models.playlist.create(playlist_params);
}

function getAllPlaylists(ids) {
  if (ids){
    var ids = JSON.parse("[" + ids + "]");
    return orm.models.playlist.findAll({
      attributes: ['id', 'name', 'description', 'user_id'],
      include: [ { model: orm.models.user, attributes: [ 'id', 'userName' ] }],
      where: { id: { $in: ids } },
      order: [ ['id', 'ASC'] ]
    });
  } else
    return orm.models.playlist.findAll({
      attributes: ['id', 'name', 'description', 'user_id'],
      include: [ { model: orm.models.user, attributes: [ 'id', 'userName' ] }],
      order: [ ['id', 'ASC'] ]
    });
}

function getPlaylistById(playlistId) {
  return orm.models.playlist.findOne({ where: { id: playlistId } });
}

function updatePlaylist(playlist, id) {
  return orm.models.playlist.update(playlist, { where: { id: id }, returning: true, plain: true });
}

function removePlaylist(playlistId) {
  return orm.models.playlist.destroy( { where: { id: playlistId } } );
}
