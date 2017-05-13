var express = require('express');
var router = express.Router();
var playlistsService = require('../../services/playlists-service');
var logger = require('../../config/logger/winston.js');
var config = require('../../config/config');
var jwtMiddleware = require('../../middlewares/jwtMiddleware');

router.post('/playlists', jwtMiddleware, createPlaylist);
router.get('/playlists', jwtMiddleware, getAllPlaylists);
router.get('/playlists/:id', jwtMiddleware, getPlaylistById);
router.get('/playlists/:id/tracks', jwtMiddleware, getSongsFromPlaylist);
router.get('/playlists/:id/albums', jwtMiddleware, getAlbumsFromPlaylist);
router.put('/playlists/:id', jwtMiddleware, updatePlaylist);
router.put('/playlists/:id/tracks/:track_id', jwtMiddleware, addSongToPlaylist);
router.put('/playlists/:id/albums/:album_id', jwtMiddleware, addAlbumToPlaylist);
router.delete('/playlists/:id', jwtMiddleware, removePlaylist);
router.delete('/playlists/:id/tracks/:track_id', jwtMiddleware, deleteSongFromPlaylist);
router.delete('/playlists/:id/albums/:album_id', jwtMiddleware, deleteAlbumFromPlaylist);

function createPlaylist(req, res, next) {
  playlistsService.createPlaylist(req.body)
              .then(function (data) {
                logger.info('Playlist created');
                res.status(201).json({ playlist: data });
              })
              .catch(function (err) {
                var err = new Error(err.message);
                err.status = 400;
                next(err);
              });
}

function getAllPlaylists(req, res, next) {
  playlistsService.getAllPlaylists(req.query.ids)
              .then(function (data) {
                res.status(200).json({ playlists: data });
              })
              .catch(function (err) {
                next(err);
              });
}

function getPlaylistById(req, res, next) {
  playlistsService.getPlaylistById(parseInt(req.params.id))
              .then(function (data) {
                if (!data) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                res.status(200).json({ playlist: data });
              })
              .catch(function (err) {
                next(err);
              });
}

function updatePlaylist(req, res, next) {
  playlistsService.updatePlaylist(req.body, req.params.id)
              .then(function (data) {
                if (!data) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                logger.info('Playlist updated');
                res.status(200).json(data[1].dataValues);
              })
              .catch(function (err) {
                var err = new Error(err.message);
                err.status = 400;
                next(err);
              });
}

function removePlaylist(req, res, next) {
  playlistsService.removePlaylist(parseInt(req.params.id))
              .then(function (result) {
                if (result === 0) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                logger.info('Playlist removed');
                res.status(204).json(true);
              })
              .catch(function (err) {
                next(err);
              });
}

function addSongToPlaylist(req, res, next) {
  playlistsService.addSongToPlaylist(parseInt(req.params.id), parseInt(req.params.track_id))
                  .then(function (data) {
                    if (!data) {
                      var err = new Error('Not Found');
                      return next(err);
                    }
                    res.status(200).json({ playlist: data });
                  })
                  .catch(function (err) {
                    next(err);
                  });
}

function deleteSongFromPlaylist(req, res, next) {
  playlistsService.deleteSongFromPlaylist(parseInt(req.params.id), parseInt(req.params.track_id))
                  .then(function (result) {
                    if (result === 0) {
                      var err = new Error('Not Found');
                      return next(err);
                    }
                    logger.info('Song removed from playlist');
                    res.status(204).json(true);
                  })
                  .catch(function (err) {
                    next(err);
                  });
}

function getSongsFromPlaylist(req, res, next) {
  playlistsService.getSongsFromPlaylist(parseInt(req.params.id))
                  .then(function (data) {
                    if (!data) {
                      var err = new Error('Not Found');
                      return next(err);
                    }
                    res.status(200).json({ tracks: data });
                  })
                  .catch(function (err) {
                    next(err);
                  });
}

function addAlbumToPlaylist(req, res, next) {
  playlistsService.addAlbumToPlaylist(parseInt(req.params.id), parseInt(req.params.album_id))
                  .then(function (data) {
                    if (!data) {
                      var err = new Error('Not Found');
                      return next(err);
                    }
                    res.status(200).json({ playlist: data });
                  })
                  .catch(function (err) {
                    next(err);
                  });
}

function deleteAlbumFromPlaylist(req, res, next) {
  playlistsService.deleteAlbumFromPlaylist(parseInt(req.params.id), parseInt(req.params.album_id))
                  .then(function (result) {
                    if (result === 0) {
                      var err = new Error('Not Found');
                      return next(err);
                    }
                    logger.info('Song removed from playlist');
                    res.status(204).json(true);
                  })
                  .catch(function (err) {
                    next(err);
                  });
}

function getAlbumsFromPlaylist(req, res, next) {
  playlistsService.getAlbumsFromPlaylist(parseInt(req.params.id))
                  .then(function (data) {
                    if (!data) {
                      var err = new Error('Not Found');
                      return next(err);
                    }
                    res.status(200).json({ albums: data });
                  })
                  .catch(function (err) {
                    next(err);
                  });
}

module.exports = router;
