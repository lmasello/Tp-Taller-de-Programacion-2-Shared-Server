var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var userService = require('../services/user-service');

router.get('/api/users', getAllUsers);
router.get('/api/users/:id', getUserById);
router.post('/api/users', createUser);
router.put('/api/users/:id', updateUser);
router.delete('/api/users/:id', removeUser);

function getAllUsers(req, res, next) {
  userService.getAllUsers()
      .then(function (data) {
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
  userService.getSingleUser(parseInt(req.params.id))
      .then(function (data) {
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
  userService.createUser(req.body)
      .then(function () {
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
  userService.updateUser([req.body.email, req.body.first_name, req.body.last_name])
      .then(function () {
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
  userService.removeUser(parseInt(req.params.id))
      .then(function (result) {
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
