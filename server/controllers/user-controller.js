var express = require('express');
var router = express.Router();
var connectionService = require('../services/user-service');
var logger = require('../config/logger/winston.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Music IO Shared Server' });
});

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', removeUser);

function getAllUsers(req, res, next) {
  connectionService.getAllUsers()
                   .then(function (data) {
                     logger.info(data);
                     res.status(200).json({ users: data });
                   })
                   .catch(function (err) {
                     return next(err);
                   });
}

function getUserById(req, res, next) {
  connectionService.getSingleUser(parseInt(req.params.id))
                   .then(function (data) {
                     logger.info(data);
                     res.status(200).json({ user: data });
                   })
                   .catch(function (err) {
                     return next(err);
                   });
}


function createUser(req, res, next) {
  connectionService.createUser(req.body)
                   .then(function (data) {
                     logger.info('User created');
                     res.status(201).json({ user: data});
                   })
                   .catch(function (err) {
                     return next(err);
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
                     return next(err);
                   });
}

function removeUser(req, res, next) {
  connectionService.removeUser(parseInt(req.params.id))
                   .then(function (result) {
                     logger.info('User removed');
                     res.status(200).json(response('success', `Removed ${result.rowCount} user`));
                   })
                   .catch(function (err) {
                     return next(err);
                   });
}

function response(status, message) {
  return { status: status, message: message };
}

module.exports = router;
