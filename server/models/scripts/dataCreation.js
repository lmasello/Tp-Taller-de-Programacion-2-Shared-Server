var sha1 = require('sha1');
exports.execute = (db) => {
  db.models.user.create({
    firstName: 'firstName1',
    lastName: 'lastName1',
    email: 'email1@gmail.com',
    password: sha1('12345678')
  });
  db.models.user.create({
    firstName: 'firstName2',
    lastName: 'lastName2',
    email: 'email2@gmail.com',
    password: sha1('12345678')
  });
  db.models.user.create({
    firstName: 'firstName3',
    lastName: 'lastName3',
    email: 'email3@gmail.com',
    password: sha1('12345678')
  });
  return Promise.resolve();
};
