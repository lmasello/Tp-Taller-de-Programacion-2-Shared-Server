var express = require('express');
var router = express.Router();
var songsService = require('../../services/songs-service');
var logger = require('../../config/logger/winston.js');
var config = require('../../config/config');
var jwtMiddleware = require('../../middlewares/jwtMiddleware');

router.post('/tracks', jwtMiddleware, createSong);
router.get('/tracks', jwtMiddleware, getAllSongs);
router.get('/tracks/:id', jwtMiddleware, getSongById);
router.put('/tracks/:id', jwtMiddleware, updateSong);
router.delete('/tracks/:id', jwtMiddleware, removeSong);

function createSong(req, res, next) {
  songsService.createSong(req.body)
              .then(function (data) {
                logger.info('Song created');
                res.status(201).json({ track: data});
              })
              .catch(function (err) {
                next(err);
              });
}

function getAllSongs(req, res, next) {
  songsService.getAllSongs(req.query.ids)
              .then(function (data) {
                res.status(200).json(data);
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
                res.status(200).json(data);
              })
              .catch(function (err) {
                next(err);
              });
}

function updateSong(req, res, next) {
  songsService.updateSong(req.body, req.params.id)
              .then(function (data) {
                logger.info('Track updated');
                res.status(204).json(true);
              })
              .catch(function (err) {
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
                res.status(200).json(response('success', `Removed ${result} user`));
              })
              .catch(function (err) {
                next(err);
              });
}

function response(status, message) {
  return { status: status, message: message };
}

module.exports = router;
