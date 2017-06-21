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
  db.models.playlist.create({
    name: 'This is Blues',
    description: 'A collection of the most essential songs of the blues history.'
  }).then(function(blues_playlist){
    db.models.playlist.create({
      name: 'This is BritPop',
      description: 'A collection of the most essential songs of the BritPop history.'
    }).then(function(brit_pop_playlist){
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
      }).then(function(common_user) {
        db.models.user.create({
          userName: 'musicIo',
          firstName: 'music',
          lastName: 'IO',
          email: 'musicio@gmail.com',
          birthdate: '1990/09/08',
          country: 'Italy',
          password: sha1('12345678'),
          fb: null,
          images: []
        }).then(function(music_io_user){
          music_io_user.addPlaylist(blues_playlist);
          music_io_user.addPlaylist(brit_pop_playlist);
          db.models.artist.create({
            name: 'Coldplay',
            description: 'Coldplay are a British rock band formed in 1996 by lead vocalist and keyboardist Chris Martin and lead guitarist Jonny Buckland at University College London.',
            genres: ['Pop', 'British', 'Alternative'],
            images: ['https://en.wikipedia.org/wiki/Coldplay#/media/File:Coldplay_MX_logo_black.png']
          }).then(function(coldplay) {
            music_io_user.addArtist(coldplay);
            db.models.album.create({
              name: 'Ghost stories',
              release_date: '2014-5-16',
              genres: ['Pop', 'Synth-pop', 'Alternative'],
              images: ['https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Coldplay_-_Ghost_Stories.png/220px-Coldplay_-_Ghost_Stories.png']
            }).then(function(ghost_stories){
              ghost_stories.addArtist(coldplay.id);
              db.models.song.create({
                name: 'Always in My Head',
                duration: '216000',
                album_id: ghost_stories.id
              }).then(function(song){
                brit_pop_playlist.addSong(song);
                song.addArtist(coldplay);
              });
              db.models.song.create({
                name: 'Magic',
                duration: '285000',
                album_id: ghost_stories.id
              }).then(function(song){
                brit_pop_playlist.addSong(song);
                song.addArtist(coldplay);
              });
              db.models.song.create({
                name: 'Ink',
                duration: '228000',
                album_id: ghost_stories.id
              }).then(function(song){
                brit_pop_playlist.addSong(song);
                song.addArtist(coldplay);
              });
              db.models.song.create({
                name: 'True love',
                duration: '245000',
                album_id: ghost_stories.id
              }).then(function(song){
                song.addArtist(coldplay);
              });
              db.models.song.create({
                name: 'Midnight',
                duration: '294000',
                album_id: ghost_stories.id
              }).then(function(song){
                song.addArtist(coldplay);
              });
              db.models.song.create({
                name: "Another's Arms",
                duration: '234000',
                album_id: ghost_stories.id
              }).then(function(song){
                song.addArtist(coldplay);
              });
              db.models.song.create({
                name: 'Oceans',
                duration: '321000',
                album_id: ghost_stories.id
              }).then(function(song){
                song.addArtist(coldplay);
              });
              db.models.song.create({
                name: 'A Sky Full of Stars',
                duration: '268000',
                album_id: ghost_stories.id
              }).then(function(song){
                brit_pop_playlist.addSong(song);
                song.addArtist(coldplay);
              });
              db.models.song.create({
                name: 'O',
                duration: '467000',
                album_id: ghost_stories.id
              }).then(function(song){
                song.addArtist(coldplay);
              });
            });
          });
          db.models.artist.create({
            name: 'Stevie Ray Vaughan',
            description: 'Stephen "Stevie" Ray Vaughan (October 3, 1954 – August 27, 1990) was an American musician, singer, songwriter, and record producer.',
            genres: ['Rock', 'Country', 'Blues'],
            images: ['http://www.guitar-muse.com/wp-content/uploads/2013/08/stevie-ray-vaughan-lenny.jpg']
          }).then(function(stevie){
            music_io_user.addArtist(stevie);
            db.models.album.create({
              name: 'In step',
              release_date: '1989-6-6',
              genres: ['Blues Rock', 'Jazz Blues'],
              images: ['https://upload.wikimedia.org/wikipedia/en/c/cc/SRVinstep.jpg']
            }).then(function(in_step){
              in_step.addArtist(stevie.id);
              db.models.song.create({
                name: 'The House Is Rockin',
                duration: '144000',
                album_id: in_step.id
              }).then(function(song){
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Crossfire',
                duration: '250000',
                album_id: in_step.id
              }).then(function(song){
                blues_playlist.addSong(song);
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Tightrope',
                duration: '280000',
                album_id: in_step.id
              }).then(function(song){
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Let Me Love You Baby',
                duration: '163000',
                album_id: in_step.id
              }).then(function(song){
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Leave My Girl Alone',
                duration: '255000',
                album_id: in_step.id
              }).then(function(song){
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Travis Walk',
                duration: '139000',
                album_id: in_step.id
              }).then(function(song){
                blues_playlist.addSong(song);
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Wall of Denial',
                duration: '536000',
                album_id: in_step.id
              }).then(function(song){
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Scratch-N-Sniff',
                duration: '163000',
                album_id: in_step.id
              }).then(function(song){
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Love Me Darlin',
                duration: '201000',
                album_id: in_step.id
              }).then(function(song){
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Riviera Paradise',
                duration: '540000',
                album_id: in_step.id
              }).then(function(song){
                song.addArtist(stevie);
              });
            });
            db.models.album.create({
              name: 'Texas flood',
              release_date: '1983-6-13',
              genres: ['Blues Rock', 'Jazz Blues', 'Texas Blues'],
              images: ['https://images-na.ssl-images-amazon.com/images/I/61N62rfRfzL.jpg']
            }).then(function(texas_flood) {
              texas_flood.addArtist(stevie);
              db.models.song.create({
                name: 'Love Struck Baby',
                duration: '139000',
                album_id: texas_flood.id
              }).then(function(song){
                blues_playlist.addSong(song);
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Pride and Joy',
                duration: '219000',
                album_id: texas_flood.id
              }).then(function(song){
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Texas Flood',
                duration: '321000',
                album_id: texas_flood.id
              }).then(function(song){
                blues_playlist.addSong(song);
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Tell me',
                duration: '168000',
                album_id: texas_flood.id
              }).then(function(song){
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Testify',
                duration: '200000',
                album_id: texas_flood.id
              }).then(function(song){
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Rude Mood',
                duration: '276000',
                album_id: texas_flood.id
              }).then(function(song){
                blues_playlist.addSong(song);
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Mary Had a Little Lamb',
                duration: '166000',
                album_id: texas_flood.id
              }).then(function(song){
                blues_playlist.addSong(song);
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Dirty Pool',
                duration: '298000',
                album_id: texas_flood.id
              }).then(function(song){
                blues_playlist.addSong(song);
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: "I'm Cryin",
                duration: '221000',
                album_id: texas_flood.id
              }).then(function(song){
                song.addArtist(stevie);
              });
              db.models.song.create({
                name: 'Lenny',
                duration: '300000',
                album_id: texas_flood.id
              }).then(function(song){
                song.addArtist(stevie);
              });
            })
          });
          db.models.artist.create({
            name: 'The Rolling Stones',
            description: 'The Rolling Stones are an English rock band formed in London in 1962. The original line-up consisted of Brian Jones, Mick Jagger, Keith Richards, Bill Wyman, Charlie Watts, and Ian Stewart.',
            genres: ['Rock', 'Blues'],
            images: ['http://4.bp.blogspot.com/-6dgrITzvOyY/VLESaQRMoPI/AAAAAAAAMTo/nNQRaQVWS48/s1600/The-Rolling-Stones.jpg']
          }).then(function(stones){
            music_io_user.addArtist(stones);
            db.models.album.create({
              name: 'Tattoo you',
              release_date: '1981-8-24',
              genres: ['Blues Rock', 'Rock'],
              images: ['https://upload.wikimedia.org/wikipedia/en/1/16/TattooYou81.jpg']
            }).then(function(tattoo_you){
              tattoo_you.addArtist(stones);
              db.models.song.create({
                name: 'Start Me Up',
                duration: '211000',
                album_id: tattoo_you.id
              }).then(function(song){
                song.addArtist(stones);
              });
              db.models.song.create({
                name: 'Hang Fire',
                duration: '140000',
                album_id: tattoo_you.id
              }).then(function(song){
                song.addArtist(stones);
              });
              db.models.song.create({
                name: 'Slave',
                duration: '299000',
                album_id: tattoo_you.id
              }).then(function(song){
                song.addArtist(stones);
              });
              db.models.song.create({
                name: 'Little T&A',
                duration: '203000',
                album_id: tattoo_you.id
              }).then(function(song){
                song.addArtist(stones);
              });
              db.models.song.create({
                name: 'Black Limousine',
                duration: '212000',
                album_id: tattoo_you.id
              }).then(function(song){
                song.addArtist(stones);
              });
              db.models.song.create({
                name: 'Neighbours',
                duration: '211000',
                album_id: tattoo_you.id
              }).then(function(song){
                song.addArtist(stones);
              });
              db.models.song.create({
                name: 'Worried About You',
                duration: '316000',
                album_id: tattoo_you.id
              }).then(function(song){
                song.addArtist(stones);
              });
              db.models.song.create({
                name: 'Tops',
                duration: '225000',
                album_id: tattoo_you.id
              }).then(function(song){
                song.addArtist(stones);
              });
              db.models.song.create({
                name: 'Heaven',
                duration: '261000',
                album_id: tattoo_you.id
              }).then(function(song){
                song.addArtist(stones);
              });
              db.models.song.create({
                name: 'No Use in Crying',
                duration: '204000',
                album_id: tattoo_you.id
              }).then(function(song){
                song.addArtist(stones);
              });
              db.models.song.create({
                name: 'Waiting on a Friend',
                duration: '274000',
                album_id: tattoo_you.id
              }).then(function(song){
                song.addArtist(stones);
              });
            });
          });
        });
      });
    });
  });
  return Promise.resolve();
};
