var sha1 = require('sha1');
exports.execute = (db) => {
  db.models.user.create({
    userName: 'user1',
    firstName: 'firstName1',
    lastName: 'lastName1',
    email: 'email1@gmail.com',
    birthdate: '1990/01/01',
    country: 'Spain',
    password: sha1('12345678'),
    fb: null,
    images: []
  });
  db.models.user.create({
    userName: 'user2',
    firstName: 'firstName2',
    lastName: 'lastName2',
    email: 'email2@gmail.com',
    birthdate: '1991/04/21',
    country: 'Argentine',
    password: sha1('12345678'),
    fb: null,
    images: []
  });
  db.models.user.create({
    userName: 'user3',
    firstName: 'firstName3',
    lastName: 'lastName3',
    email: 'email3@gmail.com',
    birthdate: '1995/09/08',
    country: 'Italy',
    password: sha1('12345678'),
    fb: null,
    images: []
  });
  db.models.song.create({
    name: 'Goldberg Variations',
    duration: '390000'
  });
  db.models.song.create({
    name: 'Piano Sonata N.29',
    duration: '390000'
  });
  db.models.song.create({
    name: 'Symphony in C: Moderato alla breve',
    duration: '390000'
  });
  db.models.artist.create({
    name: 'Antonio Vivaldi',
    description: 'One of the best artist ever',
    genres: ['Classical', 'Instrumental']
  });
  db.models.artist.create({
    name: 'Ludwig Van Beethoven',
    description: 'German composer and pianist.',
    genres: ['Classical', 'Instrumental']
  });
  return Promise.resolve();
};
