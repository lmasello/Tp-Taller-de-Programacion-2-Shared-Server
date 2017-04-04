var express = require('express');
var router = express.Router();
var connectionService = require('../services/user-service');
var logger = require('../config/logger/winston.js');
var config = require('../config/config');
var jwt = require('jsonwebtoken');

// Except sign up from authentication
router.post('/users', createUser);

// route middleware to verify a token
router.use(function(req, res, next) {
  var token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        logger.error(err);
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        logger.debug(decoded);
        next();
      }
    });
  } else {
    return res.status(403).send( { success: false, message: 'No token provided.' } );
  }
});
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', removeUser);

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
