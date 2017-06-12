const orm = require('./../config/orm');
const sha1 = require('sha1');
const logger = require('../config/logger/winston.js');

// add query functions
module.exports = {
  getAllUsers: findAll,
  getUserActivity: getUserActivity,
  getSingleUser: findUserById,
  getContacts: findAllContactsFromUser,
  addContact: addContact,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser
};

function findAll(ids) {
  if (ids){
    var ids = JSON.parse("[" + ids + "]");
    return orm.models.user.findAll({
      attributes: ['id', 'userName', 'email', 'images'],
      where: { id: { $in: ids } },
      order: [ ['id', 'ASC'] ]
    });
  } else
    return orm.models.user.findAll({
      attributes: ['id', 'userName', 'email', 'images'],
      order: [ ['id', 'ASC'] ]
    });
}

function findAllContactsFromUser(id) {
  return orm.sequelize.query('SELECT friend_id, email, images ' +
                             'FROM user_contacts ' +
                             'INNER JOIN users ON user_contacts.friend_id = users.id ' +
                             'WHERE user_id = $1 ' +
                             'UNION ' +
                             'SELECT user_id, email, images ' +
                             'FROM user_contacts ' +
                             'INNER JOIN users ON user_contacts.user_id = users.id ' +
                             'WHERE friend_id = $1 ', { bind: [id],
                               type: orm.sequelize.QueryTypes.SELECT});
}

function findUserById(userId) {
  return orm.models.user.findOne({ where: { id: userId } });
}

function createUser(user) {
  user.password = sha1(user.password);
  return orm.models.user.create(user);
}

function addContact(user_id, friend_id) {
  return orm.models.user.findById(friend_id).then(function(friend) {
    return friend.addFriend(user_id);
  })
}

function updateUser(user, id) {
  if (user.password)
    user.password = sha1(user.password);
  return orm.models.user.update(user, { where: { id: id }, returning: true, plain: true });
}

function removeUser(userId) {
  return orm.models.user.destroy( { where: { id: userId }} );
}

function getUserActivity(userId) {
  return orm.models.user.find({
    attributes: ['id', 'userName'],
    where: { id: userId },
    include: [
      { model: orm.models.artist },
      { model: orm.models.song },
    ],
    order: [
      [orm.models.artist, orm.models.user_artist, 'updated_at', 'DESC'],
      [orm.models.song, orm.models.user_song, 'updatedAt', 'DESC']
    ],
    limit: 1
  });
}
