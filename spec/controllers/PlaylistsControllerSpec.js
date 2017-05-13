const logger = require('../../server/config/logger/winston.js');
var request = require('request');
var tokenService = require('../../server/services/token-service.js');
var orm = require('./../../server/config/orm');

describe('Playlists Controller', function() {
  var auth_user = { id: 1, userName: 'user1' }
  var token = tokenService.generateJwt(auth_user);
  var headers = { 'Authorization': 'Bearer ' + token };

  describe('GET /playlists', function() {
    var base_url = 'http://localhost:3000/playlists';
    logger.info('Testing GET /playlists');

    it('returns three resources', function(done) {
      logger.info('Testing GET /playlists - returns three resources');
      request( { url:base_url, headers: headers }, function(error, response, body) {
        expect(JSON.parse(response.body).playlists.length).toBe(3);
        done();
      });
    });

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /playlists - returns http code successful');
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    describe('GET /playlists?ids=1,2', function() {
      var base_url = 'http://localhost:3000/playlists?ids=1,2';
      logger.info('Testing GET /playlists?ids=1,2');

      it('returns http status code successful (200)', function(done) {
        logger.info('Testing GET /playlists?ids=1,2 - returns http status code successful');

        request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
        });
      });

      it('returns two resources', function(done) {
        logger.info('Testing GET /playlists?ids=1,2 - returns two resources');

        request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).playlists.length).toBe(2);
          done();
        });
      });
    });

    // If it does not provide authentication
    it('returns http status code Unauthorized(401)', function(done) {
      logger.info('Testing If the request does not provide authentication, it returns 401');
      request( { url:base_url }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  });

  describe('GET /playlists/{playlist_id}', function() {
    logger.info('Testing GET /playlists/{playlist_id}');

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /playlists/{playlist_id} - Returns http status code successful');

      var base_url = 'http://localhost:3000/playlists/1';
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns the right playlist', function(done) {
      logger.info('Testing GET /playlists/{playlist_id} - Returns the right playlist');

      var base_url = 'http://localhost:3000/playlists/1';
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).playlist.id).toBe(1);
          done();
      });
    });

    it('returns http status code not found if there is no resource', function(done) {
      logger.info('Testing GET /playlists/{playlist_id} - Returns http status code not found if there is no such resource');

      var wrong_url = 'http://localhost:3000/playlists/100000';
      request( { url: wrong_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
          done();
      });
    });
  });

  describe('PUT /playlists/{playlist_id}', function() {
    logger.info('Testing PUT /playlists/{playlist_id}');
    var base_url = 'http://localhost:3000/playlists/2';
    var params = { description: 'Coldplay, Oasis, The Smiths' };

    it('returns http status code No Content (200)', function(done) {
      logger.info('Testing PUT /playlists/{playlist_id} - returns 200 if everything is alright');
      request.put( { url: base_url, headers: headers, json: params }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          expect(response.body.description).toBe('Coldplay, Oasis, The Smiths');
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing PUT /playlists/{playlist_id} - returns 401 if there is no token');
      request.put( { url: base_url, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });

    it('returns http status code not found if there is no user', function(done) {
      logger.info('Testing PUT /playlists/{playlist_id} - returns 404 if there is no user');
      var wrong_url = 'http://localhost:3000/playlists/100000';
      request.put( { url: wrong_url, headers: headers, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
          done();
      });
    });
  })

  describe('DELETE /playlists/{playlist_id}', function() {
    logger.info('Testing DELETE /playlists/{playlist_id}');
    var base_url = 'http://localhost:3000/playlists/3';

    it('returns http status code successful (204)', function(done) {
      logger.info('Testing DELETE /playlists/{playlist_id} - Returns 204 if everything is alright');
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        expect(response.statusCode).toBe(204);
        done();
      });
    });

    it('deletes a playlist', function(done) {
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        logger.info('Testing DELETE /playlists/{playlist_id} - Deletes the playlist');
        var playlists = 'http://localhost:3000/playlists';
        request( { url: playlists, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).playlists.length).toBe(2);
          done();
        });
      });
    });
  });

  describe('POST /playlists', function() {
    var base_url = 'http://localhost:3000/playlists';
    logger.info('Testing POST /playlists');

    it('returns http status code created (201)', function(done) {
      var params = { name: 'This is Hard Rock!', description: 'If you wanna power, this playlist is for you', user_id: 1 };
      logger.info('Testing POST /playlists - Returns 201');
      request.post({ url: base_url, headers: headers, json: params }, function(error, response, body) {
        expect(response.statusCode).toBe(201);
        expect(response.body.playlist.name).toBe('This is Hard Rock!')
        done();
      });
    });

    it('returns http error if the params are invalid', function(done) {
      var params = { n: 'wrong param' };
      logger.info('Testing POST /playlists - returns 400 if the params are invalid');
      request.post({ url: base_url, headers: headers, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });
  });

  describe('PUT /playlists/{playlist_id}/tracks/{track_id}', function() {
    logger.info('Testing PUT /playlists/{playlist_id}/tracks/{track_id}');
    var base_url = 'http://localhost:3000/playlists/2/tracks/1';

    it('returns http status code No Content (200)', function(done) {
      logger.info('Testing PUT /playlists/{playlist_id}/tracks/{track_id} - returns 200 if everything is alright');
      request.put( { url: base_url, headers: headers}, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          var playlist = 'http://localhost:3000/playlists/2';
          request( { url: playlist, headers: headers }, function(error, response, body) {
            expect(JSON.parse(response.body).playlist.songs[0].id).toBe(1);
            done();
          });
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing PUT /playlists/{playlist_id}/tracks/{track_id} - returns 401 if there is no token');
      request.put( { url: base_url }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  });

  describe('GET /playlists/{playlist_id}/tracks', function() {
    logger.info('Testing GET /playlists/{playlist_id}/tracks');
    var base_url = 'http://localhost:3000/playlists/2/tracks';

    it('returns http status code (200)', function(done) {
      logger.info('Testing GET /playlists/{playlist_id}/tracks - returns 200 if everything is alright');
      request( { url: base_url, headers: headers}, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(response.body).tracks.length).toBe(1);
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing GET /playlists/{playlist_id}/tracks - returns 401 if there is no token');
      request( { url: base_url }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });

    it('returns http status code not found if there is no playlist', function(done) {
      logger.info('Testing GET /playlists/{playlist_id}/tracks - returns 404 if there is no playlist');
      var wrong_url = 'http://localhost:3000/playlists/100000/tracks';
      request( { url: wrong_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
          done();
      });
    });
  });

  describe('DELETE /playlists/{playlist_id}/tracks/{track_id}', function() {
    logger.info('Testing DELETE /playlists/{playlist_id}/tracks/{track_id}');
    var base_url = 'http://localhost:3000/playlists/2/tracks/1';

    it('returns http status code successful (204)', function(done) {
      logger.info('Testing DELETE /playlists/{playlist_id}/tracks/{track_id} - Returns 204 if everything is alright');
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        expect(response.statusCode).toBe(204);
        done();
      });
    });

    it('deletes the song', function(done) {
      var tracks_url = 'http://localhost:3000/playlists/2/tracks';
      request( { url: tracks_url, headers: headers}, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(response.body).tracks.length).toBe(0);
          done();
      });
    });
  });

  describe('PUT /playlists/{playlist_id}/albums/{album_id}', function() {
    logger.info('Testing PUT /playlists/{playlist_id}/albums/{album_id}');
    var base_url = 'http://localhost:3000/playlists/2/albums/4';

    it('returns http status code No Content (200)', function(done) {
      logger.info('Testing PUT /playlists/{playlist_id}/albums/{album_id} - returns 200 if everything is alright');
      request.put( { url: base_url, headers: headers}, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing PUT /playlists/{playlist_id}/albums/{album_id} - returns 401 if there is no token');
      request.put( { url: base_url}, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  });

  describe('GET /playlists/{playlist_id}/albums', function() {
    logger.info('Testing GET /playlists/{playlist_id}/albums');
    var base_url = 'http://localhost:3000/playlists/2/albums';

    it('returns http status code (200)', function(done) {
      logger.info('Testing GET /playlists/{playlist_id}/albums - returns 200 if everything is alright');
      request( { url: base_url, headers: headers}, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(response.body).albums.length).toBe(1);
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing GET /playlists/{playlist_id}/albums - returns 401 if there is no token');
      request( { url: base_url }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });

    it('returns http status code not found if there is no playlist', function(done) {
      logger.info('Testing GET /playlists/{playlist_id}/albums - returns 404 if there is no playlist');
      var wrong_url = 'http://localhost:3000/playlists/100000/albums';
      request( { url: wrong_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
          done();
      });
    });
  });

  describe('DELETE /playlists/{playlist_id}/albums/{album_id}', function() {
    logger.info('Testing DELETE /playlists/{playlist_id}/albums/{album_id}');
    var base_url = 'http://localhost:3000/playlists/2/albums/4';

    it('returns http status code successful (204)', function(done) {
      logger.info('Testing DELETE /playlists/{playlist_id}/albums/{album_id} - Returns 204 if everything is alright');
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        expect(response.statusCode).toBe(204);
        done();
      });
    });

    it('deletes the album', function(done) {
      var albums_url = 'http://localhost:3000/playlists/2/albums';
      request( { url: albums_url, headers: headers}, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(response.body).albums.length).toBe(0);
          done();
      });
    });
  });
});
