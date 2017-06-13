var express = require('express');
var router = express.Router();
var userService = require('../../services/user-service');
var logger = require('../../config/logger/winston.js');
var config = require('../../config/config');
var jwtMiddleware = require('../../middlewares/jwtMiddleware');

router.get('/users', jwtMiddleware, getAllUsers);
router.get('/users/me', jwtMiddleware, getUserByToken);
router.get('/users/me/activity', jwtMiddleware, getUserActivity);
router.get('/users/:id', jwtMiddleware, getUserById);
router.get('/users/me/contacts', jwtMiddleware, getContacts);
router.post('/users/me/contacts', jwtMiddleware, addContact);
router.put('/users/me', jwtMiddleware, updateUserByToken);
router.put('/users/:id', jwtMiddleware, updateUser);
router.delete('/users/:id', jwtMiddleware, removeUser);
router.post('/users', createUser);

function getAllUsers(req, res, next) {
  userService.getAllUsers(req.query.ids)
             .then(function (data) {
               res.status(200).json({ users: data });
             })
             .catch(function (err) {
               next(err);
             });
}

function getUserById(req, res, next) {
  userService.getSingleUser(parseInt(req.params.id))
             .then(function (data) {
               if (!data) {
                 var err = new Error('Not Found');
                 return next(err);
               }
               res.status(200).json({ user: data });
             })
             .catch(function (err) {
               next(err);
             });
}

function getUserByToken(req, res, next) {
  userService.getSingleUser(parseInt(req.user.sub))
             .then(function (data) {
               res.status(200).json({ user: data });
             })
             .catch(function (err) {
               next(err);
             });
}

function getContacts(req, res, next) {
  userService.getContacts(parseInt(req.user.sub))
             .then(function (data) {
               res.status(200).json({ contacts: data });
             })
             .catch(function (err) {
               next(err);
             });
}

function addContact(req, res, next) {
  userService.addContact(parseInt(req.user.sub), parseInt(req.body.friend_id))
             .then(function (data) {
               logger.info('relationship created');
               res.status(201).json(true);
             })
             .catch(function (err) {
               var err = new Error(err.message);
               err.status = 400;
               next(err);
             });
}

function createUser(req, res, next) {
  userService.createUser(req.body)
             .then(function (data) {
               logger.info('User created');
               res.status(201).json({ user: data});
             })
             .catch(function (err) {
               var err = new Error(err.message);
               err.status = 400;
               next(err);
             });
}

function updateUser(req, res, next) {
  userService.updateUser(req.body, req.params.id)
             .then(function (data) {
               if (!data) {
                 var err = new Error('Not Found');
                 return next(err);
               }
               logger.info('User updated');
               res.status(200).json(data[1].dataValues);
             })
             .catch(function (err) {
               var err = new Error(err.message);
               err.status = 400;
               next(err);
             });
}

function updateUserByToken(req, res, next) {
  userService.updateUser(req.body, req.user.sub)
             .then(function (data) {
               logger.info('User updated.');
               res.status(200).json(data[1].dataValues);
             })
             .catch(function (err) {
               var err = new Error(err.message);
               err.status = 400;
               next(err);
             });
}

function getUserActivity(req, res, next) {
  userService.getUserActivity(parseInt(req.user.sub))
             .then(function (data) {
               res.status(200).json({ activity: data });
             })
             .catch(function (err) {
               next(err);
             });
}

function removeUser(req, res, next) {
  userService.removeUser(parseInt(req.params.id))
             .then(function (result) {
               if (result === 0) {
                 var err = new Error('Not Found');
                 return next(err);
               }
               logger.info('User removed');
               res.status(204).json(true);
             })
             .catch(function (err) {
               next(err);
             });
}

function response(status, message) {
  return { status: status, message: message };
}

module.exports = router;
