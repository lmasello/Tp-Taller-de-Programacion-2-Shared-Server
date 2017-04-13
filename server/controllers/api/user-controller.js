var express = require('express');
var router = express.Router();
var connectionService = require('../../services/user-service');
var logger = require('../../config/logger/winston.js');
var config = require('../../config/config');
var jwtMiddleware = require('../../middlewares/jwtMiddleware');

// Except sign up from authentication
router.post('/users', createUser);
router.get('/users', jwtMiddleware, getAllUsers);
router.get('/users/me', jwtMiddleware, getUserByToken);
router.get('/users/:id', jwtMiddleware, getUserById);
router.get('/users/me/contacts', jwtMiddleware, getContacts);
router.post('/users/me/contacts', jwtMiddleware, addContact);
router.put('/users/me', jwtMiddleware, updateUserByToken);
router.put('/users/:id', jwtMiddleware, updateUser);
router.delete('/users/:id', jwtMiddleware, removeUser);

function getAllUsers(req, res, next) {
  connectionService.getAllUsers(req.query.ids)
                   .then(function (data) {
                     logger.info(data);
                     res.status(200).json(data);
                   })
                   .catch(function (err) {
                     next(err);
                   });
}

function getUserById(req, res, next) {
  connectionService.getSingleUser(parseInt(req.params.id))
                   .then(function (data) {
                     logger.info(data);
                     res.status(200).json(data);
                   })
                   .catch(function (err) {
                     next(err);
                   });
}

function getUserByToken(req, res, next) {
  connectionService.getSingleUser(parseInt(req.user.sub))
                   .then(function (data) {
                     logger.info(data);
                     res.status(200).json(data);
                   })
                   .catch(function (err) {
                     error_response(err, res);
                   });
}

function getContacts(req, res, next) {
  connectionService.getContacts(parseInt(req.user.sub))
                   .then(function (data) {
                     logger.info(data);
                     res.status(200).json(data);
                   })
                   .catch(function (err) {
                     error_response(err, res);
                   });
}

function addContact(req, res, next) {
  connectionService.addContact(req.user.sub, req.body.contact_id)
                   .then(function (data) {
                     logger.info('relationship created');
                     res.status(201).json({ friendship: data});
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
                     next(err);
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
                     next(err);
                   });
}

function updateUserByToken(req, res, next) {
  logger.info(req.body.email);
  connectionService.updateUser(req.body, req.user.sub)
                   .then(function (data) {
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
                     next(err);
                   });
}

function response(status, message) {
  return { status: status, message: message };
}

module.exports = router;
