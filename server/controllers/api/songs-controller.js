var express = require('express');
var router = express.Router();
var songsService = require('../../services/songs-service');
var logger = require('../../config/logger/winston.js');
var config = require('../../config/config');
var jwtMiddleware = require('../../middlewares/jwtMiddleware');

router.post('/tracks', jwtMiddleware, createSong);
router.get('/tracks', jwtMiddleware, getAllSongs);
router.get('/tracks/me/recommended', jwtMiddleware, getRecommendedSong);
router.get('/tracks/:id', jwtMiddleware, getSongById);
router.put('/tracks/:id', jwtMiddleware, updateSong);
router.delete('/tracks/:id', jwtMiddleware, removeSong);
router.get('/tracks/:id/popularity', jwtMiddleware, getSongPopularity);
router.post('/tracks/:id/popularity', jwtMiddleware, rankSong);
router.post('/tracks/:id/like', jwtMiddleware, likeSong);
router.delete('/tracks/:id/like', jwtMiddleware, dislikeSong);

function createSong(req, res, next) {
  songsService.createSong(req.body)
              .then(function (data) {
                logger.info('Song created');
                res.status(201).json({ track: data });
              })
              .catch(function (err) {
                var err = new Error(err.message);
                err.status = 400;
                next(err);
              });
}

function getAllSongs(req, res, next) {
  songsService.getAllSongs(req.query.ids)
              .then(function (data) {
                res.status(200).json({ tracks: data });
              })
              .catch(function (err) {
                next(err);
              });
}

function getSongById(req, res, next) {
  songsService.getSongById(parseInt(req.params.id))
              .then(function (data) {
                if (!data) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                res.status(200).json({ track: data });
              })
              .catch(function (err) {
                next(err);
              });
}

function getSongPopularity(req, res, next) {
  songsService.getSongPopularity(parseInt(req.params.id))
              .then(function (data) {
                if (!data) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                res.status(200).json(data[0]);
              })
              .catch(function (err) {
                next(err);
              });
}

function updateSong(req, res, next) {
  songsService.updateSong(req.body, req.params.id)
              .then(function (data) {
                logger.info('Track updated');
                res.status(200).json(data[1].dataValues);
              })
              .catch(function (err) {
                var err = new Error(err.message);
                err.status = 400;
                next(err);
              });
}

function removeSong(req, res, next) {
  songsService.removeSong(parseInt(req.params.id))
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

function rankSong(req, res, next) {
  songsService.rankSong(parseInt(req.params.id), parseInt(req.user.sub), req.body)
              .then(function (data) {
                if (data === 0) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                logger.info('Song ranked');
                res.status(204).json(true);
              })
              .catch(function (err) {
                var err = new Error(err.message);
                err.status = 400;
                next(err);
              });
}

function likeSong(req, res, next) {
  songsService.likeSong(parseInt(req.params.id), parseInt(req.user.sub))
              .then(function (data) {
                if (data === 0) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                logger.info('UserSong updated');
                res.status(204).json(true);
              })
              .catch(function (err) {
                var err = new Error(err.message);
                err.status = 400;
                next(err);
              });
}

function dislikeSong(req, res, next) {
  songsService.dislikeSong(parseInt(req.params.id), parseInt(req.user.sub))
              .then(function (data) {
                if (data === 0) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                logger.info('UserSong updated');
                res.status(204).json(true);
              })
              .catch(function (err) {
                var err = new Error(err.message);
                err.status = 400;
                next(err);
              });
}

function getRecommendedSong(req, res, next) {
  songsService.getRecommendedSong(parseInt(req.user.sub))
              .then(function (data) {
                if (!data) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                res.status(200).json({ track: data });
              })
              .catch(function (err) {
                next(err);
              });  
}

module.exports = router;
