var connectionService = require('../services/connection-service');
var sha1 = require('sha1');

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
  return connectionService.none('insert into users(email, first_name, last_name, password)' +
          'values(${email}, ${first_name}, ${last_name}, ${password})', user);
}

function updateUser(email, first_name, last_name, password) {
  return connectionService.none('update users set email=$1, first_name=$2, last_name=$3, password=$4 where id=$5',
          [email, first_name, last_name, password]);
}

function removeUser(userId) {
  return connectionService.result('delete from users where id = $1', userId);
}
