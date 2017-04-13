var connectionService = require('../services/connection-service');
var sha1 = require('sha1');
var logger = require('../config/logger/winston.js');

// add query functions
module.exports = {
  getAllUsers: findAll,
  getSingleUser: findUserById,
  getContacts: findAllContactsFromUser,
  addContact: addContact,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser
};

function findAll(ids) {
  if (ids)
    return connectionService.any('SELECT id, email FROM users WHERE id IN (' + ids + ')');
  else
    return connectionService.any('SELECT id, email FROM users');
}

function findAllContactsFromUser(id) {
  return connectionService.any('SELECT friend_id, email ' +
                               'FROM user_contacts ' +
                               'INNER JOIN users ON user_contacts.friend_id = users.id ' +
                               'WHERE user_id = $1 ' +
                               'UNION ' +
                               'SELECT user_id, email ' +
                               'FROM user_contacts ' +
                               'INNER JOIN users ON user_contacts.user_id = users.id ' +
                               'WHERE friend_id = $1 ', id);
}

function findUserById(userId) {
    return connectionService.one('SELECT * FROM users WHERE id = $1', userId);
}

function createUser(user) {
  user.password = sha1(user.password);
  return connectionService.one('insert into users(email, first_name, last_name, password) ' +
                               'values(${email}, ${first_name}, ${last_name}, ${password}) ' +
                               'RETURNING id, email, first_name, last_name', user);
}

function addContact(user_id, contact_id) {
  return connectionService.one('insert into user_contacts(user_id, friend_id) ' +
                               'values($1, $2) ' +
                               'RETURNING id, user_id, friend_id', [user_id, contact_id]);
}

function updateUser(user, id) {
  if (user.password)
    user.password = sha1(user.password);
  return connectionService.result('UPDATE users SET '+
                                    'first_name = COALESCE($1, first_name), ' +
                                    'last_name = COALESCE($2, last_name), ' +
                                    'password = COALESCE($3, password) ' +
                                  'WHERE id=$4 ' +
                                  'AND ($1 IS NOT NULL AND $1 IS DISTINCT FROM first_name OR ' +
                                        '$2 IS NOT NULL AND $2 IS DISTINCT FROM last_name OR ' +
                                        '$3 IS NOT NULL AND $3 IS DISTINCT FROM password)',
                                   [user.first_name, user.last_name, user.password, id]);
}

function removeUser(userId) {
  return connectionService.result('delete from users where id = $1', userId);
}
