var express = require('express');
var router = express.Router();
var artistsService = require('../../services/artists-service');
var logger = require('../../config/logger/winston.js');
var config = require('../../config/config');
var jwtMiddleware = require('../../middlewares/jwtMiddleware');

router.post('/artists', jwtMiddleware, createArtist);
router.post('/artists/:id/follow', jwtMiddleware, followArtist);
router.delete('/artists/:id/follow', jwtMiddleware, unfollowArtist);
router.get('/artists', jwtMiddleware, getAllArtists);
router.get('/artists/:id', jwtMiddleware, getArtistById);
router.get('/artists/me/favorites', jwtMiddleware, getFavorites);
router.get('/artists/:id/tracks', jwtMiddleware, getTracksFromArtist);
router.put('/artists/:id', jwtMiddleware, updateArtist);
router.delete('/artists/:id', jwtMiddleware, removeArtist);

function createArtist(req, res, next) {
  req.body.genres = JSON.parse(req.body.genres);
  artistsService.createArtist(req.body)
              .then(function (data) {
                logger.info('Artist created');
                res.status(201).json({ artist: data});
              })
              .catch(function (err) {
                var err = new Error(err.message);
                err.status = 400;
                next(err);
              });
}

function followArtist(req, res, next) {
  artistsService.followArtist(parseInt(req.user.sub), parseInt(req.params.id))
                .then(function (data) {
                  logger.info('Artist followed');
                  res.status(201).json(data);
                })
                .catch(function (err) {
                  next(err);
                });
}

function unfollowArtist(req, res, next) {
  artistsService.unfollowArtist(parseInt(req.user.sub), parseInt(req.params.id))
              .then(function (data) {
                if (!data) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                logger.info('Artist unfollowed');
                res.status(204).json(true);
              })
              .catch(function (err) {
                next(err);
              });
}

function getAllArtists(req, res, next) {
  artistsService.getAllArtists(req.query.ids, req.query.name, parseInt(req.user.sub))
                .then(function (data) {
                  res.status(200).json({ artists: data });
                })
                .catch(function (err) {
                  next(err);
                });
}

function getArtistById(req, res, next) {
  artistsService.getArtistById(parseInt(req.params.id))
              .then(function (data) {
                if (!data) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                res.status(200).json({ artist: data });
              })
              .catch(function (err) {
                next(err);
              });
}

function getTracksFromArtist(req, res, next) {
  artistsService.getSongsFromArtist(parseInt(req.params.id))
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

function updateArtist(req, res, next) {
  artistsService.updateArtist(req.body, req.params.id)
              .then(function (data) {
                if (data === 0) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                logger.info('Artist updated');
                res.status(200).json(data[1].dataValues);
              })
              .catch(function (err) {
                var err = new Error(err.message);
                err.status = 400;
                next(err);
              });
}

function removeArtist(req, res, next) {
  artistsService.removeArtist(parseInt(req.params.id))
              .then(function (result) {
                if (result === 0) {
                  var err = new Error('Not Found');
                  return next(err);
                }
                logger.info('Artist removed');
                res.status(204).json(true);
              })
              .catch(function (err) {
                next(err);
              });
}

function getFavorites(req, res, next) {
  artistsService.getFavorites(parseInt(req.user.sub))
                .then(function (data) {
                  res.status(200).json({ artists: data });
                })
                .catch(function (err) {
                  next(err);
                });
}

module.exports = router;
