var express = require('express');
var router = express.Router();
var connectionService = require('../../services/user-service');
var logger = require('../../config/logger/winston.js');
var config = require('../../config/config');
var jwtMiddleware = require('../../middlewares/jwtMiddleware');

// Except sign up from authentication
router.post('/users', createUser);
router.get('/users', jwtMiddleware, getAllUsers);
router.get('/users/:id', jwtMiddleware, getUserById);
router.put('/users/:id', jwtMiddleware, updateUser);
router.delete('/users/:id', jwtMiddleware, removeUser);

function getAllUsers(req, res, next) {
  connectionService.getAllUsers()
                   .then(function (data) {
                     logger.info(data);
                     res.status(200).json({ users: data });
                   })
                   .catch(function (err) {
                     error_response(err, res);
                   });
}

function getUserById(req, res, next) {
  connectionService.getSingleUser(parseInt(req.params.id))
                   .then(function (data) {
                     logger.info(data);
                     res.status(200).json({ user: data });
                   })
                   .catch(function (err) {
                     error_response(err, res);
                   });
}


function createUser(req, res, next) {
  connectionService.createUser(req.body)
                   .then(function (data) {
                     logger.info('User created');
                     res.status(201).json({ user: data});
                   })
                   .catch(function (err) {
                     error_response(err, res);
                   });
}

function updateUser(req, res, next) {
  logger.info(req.body.email);
  connectionService.updateUser(req.body, req.params.id)
                   .then(function (data) {
                     logger.info('User updated');
                     logger.debug(data);
                     res.status(204).json(true);
                   })
                   .catch(function (err) {
                     error_response(err, res);
                   });
}

function removeUser(req, res, next) {
  connectionService.removeUser(parseInt(req.params.id))
                   .then(function (result) {
                     logger.info('User removed');
                     res.status(200).json(response('success', `Removed ${result.rowCount} user`));
                   })
                   .catch(function (err) {
                     error_response(err, res);
                   });
}

function response(status, message) {
  return { status: status, message: message };
}

function error_response(err, res){
  return res.status(err.status || 500)
            .json( { status: 'error', message: err.message } );
}
module.exports = router;
