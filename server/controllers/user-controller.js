var express = require('express');
var router = express.Router();
var connectionService = require('../services/user-service');
var logger = require('../config/logger/winston.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved ALL users'
            });
      })
      .catch(function (err) {
        return next(err);
      });
}

function getUserById(req, res, next) {
  connectionService.getSingleUser(parseInt(req.params.id))
      .then(function (data) {
        logger.info(data);
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved ONE user'
            });
      })
      .catch(function (err) {
        return next(err);
      });
}


function createUser(req, res, next) {
  connectionService.createUser(req.body)
      .then(function () {
        logger.info('User created');
        res.status(200)
            .json({
              status: 'success',
              message: 'Inserted one user'
            });
      })
      .catch(function (err) {
        return next(err);
      });
}

function updateUser(req, res, next) {
  connectionService.updateUser([req.body.email, req.body.first_name, req.body.last_name, req.body.password])
      .then(function () {
        logger.info('User updated');
        res.status(200)
            .json({
              status: 'success',
              message: 'Updated user'
            });
      })
      .catch(function (err) {
        return next(err);
      });
}

function removeUser(req, res, next) {
  connectionService.removeUser(parseInt(req.params.id))
      .then(function (result) {
        logger.info('User removed');
        res.status(200)
            .json({
              status: 'success',
              message: `Removed ${result.rowCount} user`
            });
      })
      .catch(function (err) {
        return next(err);
      });
}

module.exports = router;
