// Reference:
// http://mherman.org/blog/2016/03/13/designing-a-restful-api-with-node-and-postgres/#.WNHTFvHys8o
var promise = require('bluebird');
const config = require('../config/config');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp(config.postgres.uri);

// add query functions
module.exports = {
  getAllUsers: findAll,
  getSingleUser: findUserById,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser
};

function findAll() {
  return db.any('select * from users');
}

function findUserById(userId) {
    return db.one('select * from users where id = $1', userId);
}

function createUser(user) {
  return db.none('insert into users(email, first_name, last_name)' +
          'values(${email}, ${first_name}, ${last_name})',
          user);
}

function updateUser(email, first_name, last_name) {
  return db.none('update users set email=$1, first_name=$2, last_name=$3 where id=$5',
          [email, first_name, last_name]);
}

function removeUser(userId) {
  return db.result('delete from users where id = $1', userID);
}
