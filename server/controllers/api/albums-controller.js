var express = require('express');
var router = express.Router();
var albumsService = require('../../services/albums-service');
var logger = require('../../config/logger/winston.js');
var config = require('../../config/config');
var jwtMiddleware = require('../../middlewares/jwtMiddleware');

router.post('/albums', jwtMiddleware, createAlbum);
router.get('/albums', jwtMiddleware, getAllAlbums);
router.get('/albums/:id', jwtMiddleware, getAlbumById);
router.put('/albums/:id', jwtMiddleware, updateAlbum);
router.delete('/albums/:id', jwtMiddleware, removeAlbum);
router.put('/albums/:albumId/tracks/:trackId', jwtMiddleware, addSongToAlbum);
router.delete('/albums/:albumId/tracks/:trackId', jwtMiddleware, removeSongFromAlbum);

function createAlbum(req, res, next) {
  albumsService.createAlbum(req.body)
              .then(function (data) {
                logger.info('Album created');
                res.status(201).json({ album: data });
              })
              .catch(function (err) {
                var err = new Error(err.message);
                err.status = 400;
                next(err);
              });
}

function getAllAlbums(req, res, next) {
  albumsService.getAllAlbums(req.query.ids)
              .then(function (data) {
                res.status(200).json({ albums: data });
              })
              .catch(function (err) {
                next(err);
              });
}

function getAlbumById(req, res, next) {
  albumsService.getAlbumById(parseInt(req.params.id))
              .then(function (data) {
                if (!data) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                res.status(200).json({ album: data });
              })
              .catch(function (err) {
                next(err);
              });
}

function updateAlbum(req, res, next) {
  albumsService.updateAlbum(req.body, req.params.id)
              .then(function (data) {
                if (!data) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                logger.info('Album updated');
                res.status(200).json(data[1].dataValues);
              })
              .catch(function (err) {
                var err = new Error(err.message);
                err.status = 400;
                next(err);
              });
}

function removeAlbum(req, res, next) {
  albumsService.removeAlbum(parseInt(req.params.id))
              .then(function (result) {
                if (result === 0) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                logger.info('Song removed');
                res.status(204).json(true);
              })
              .catch(function (err) {
                next(err);
              });
}

function addSongToAlbum(req, res, next) {
  albumsService.addSongToAlbum(parseInt(req.params.albumId), parseInt(req.params.trackId))
               .then(function (result) {
                 logger.info('Song added to album');
                 res.status(201).json({ album: result });
               })
               .catch(function (err) {
                 next(err);
               });
}

function removeSongFromAlbum(req, res, next) {
  albumsService.removeSongFromAlbum(parseInt(req.params.albumId), parseInt(req.params.trackId))
               .then(function (result) {
                 logger.info('Song removed from album');
                 res.status(204).json(true);
               })
               .catch(function (err) {
                 next(err);
               });
}

module.exports = router;
