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
    name: 'Le quattro stagioni',
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
    genres: ['Classical', 'Instrumental'],
    images: ['data:image/jpeg;base64,/9j/4AAQSk=']
  });
  db.models.artist.create({
    name: 'Ludwig Van Beethoven',
    description: 'German composer and pianist.',
    genres: ['Classical', 'Instrumental']
  });
  db.models.artist.create({
    name: 'Coldplay',
    description: 'Coldplay are a British rock band formed in 1996 by lead vocalist and keyboardist Chris Martin and lead guitarist Jonny Buckland at University College London.',
    genres: ['Pop', 'British']
  });
  db.models.artist.create({
    name: 'Stevie Ray Vaughan',
    description: 'Stephen "Stevie" Ray Vaughan (October 3, 1954 – August 27, 1990) was an American musician, singer, songwriter, and record producer.',
    genres: ['Rock', 'Country', 'Blues'],
    images: ['ajsdflakjdfl']
  });
  db.models.album.create({
    name: 'Ghost stories',
    release_date: '2014-5-16',
    genres: ['Electronica', 'Pop', 'synth-pop']
  }),
  db.models.album.create({
    name: 'In step',
    release_date: '1989-6-6',
    genres: ['Blues Rock', 'Jazz Blues']
  }),
  db.models.album.create({
    name: 'Soul to soul',
    release_date: '1985-9-30',
    genres: ['Blues Rock', 'Jazz Blues', 'Texas Blues']
  }),
  db.models.album.create({
    name: 'Classical Music',
    release_date: '2017-4-30',
    genres: ['Classical', 'Instrumental']
  })
  return Promise.resolve();
};
