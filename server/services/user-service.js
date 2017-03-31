var connectionService = require('../services/connection-service');
var sha1 = require('sha1');
var logger = require('../config/logger/winston.js');

// add query functions
module.exports = {
  getAllUsers: findAll,
  getSingleUser: findUserById,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser
};

function findAll() {
  return connectionService.any('select * from users');
}

function findUserById(userId) {
    return connectionService.one('select * from users where id = $1', userId);
}

function createUser(user) {
  user.password = sha1(user.password);
  return connectionService.one('insert into users(email, first_name, last_name, password) ' +
                               'values(${email}, ${first_name}, ${last_name}, ${password}) ' +
                               'RETURNING id, email, first_name, last_name', user);
}

function updateUser(user, id) {
  return connectionService.result('update users set first_name=$1,' +
                                  'last_name=$2, password=$3 where id=$4',
                                   [user.first_name, user.last_name, user.password, id]);
}

function removeUser(userId) {
  return connectionService.result('delete from users where id = $1', userId);
}
