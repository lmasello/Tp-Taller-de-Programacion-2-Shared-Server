const logger = require('../../server/config/logger/winston.js');
var request = require('request');
var tokenService = require('../../server/services/token-service.js');
var orm = require('./../../server/config/orm');

describe('Artists Controller', function() {
  var auth_user = { id: 1, email: 'email1@gmail.com' }
  var token = tokenService.generateJwt(auth_user);
  var headers = { 'Authorization': 'Bearer ' + token };

  describe('GET /artists', function() {
    var base_url = 'http://localhost:3000/artists';
    logger.info('Testing GET /artists');

    it('returns four resources', function(done) {
      logger.info('Testing GET /artists - returns four resources');
      request( { url:base_url, headers: headers }, function(error, response, body) {
        expect(JSON.parse(response.body).artists.length).toBe(4);
        done();
      });
    });

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /artists - returns http code successful');
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });
  })

  describe('GET /artists?name=Cold', function() {
    var base_url = 'http://localhost:3000/artists?name=Cold';
    logger.info('Testing GET /artists?name=Cold');

    it('returns one resource', function(done) {
      logger.info('Testing GET /artists?name=Cold - returns one resource');

      request( { url:base_url, headers: headers }, function(error, response, body) {
        expect(JSON.parse(response.body).artists.length).toBe(1);
        done();
      });
    });
  });

  describe('GET /artists?ids=1,2', function() {
    var base_url = 'http://localhost:3000/artists?ids=1';
    logger.info('Testing GET /artists?ids=1');

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /artists?ids=1 - returns http status code successful');

      request( { url:base_url, headers: headers }, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('returns one resource', function(done) {
      logger.info('Testing GET /artists?ids=1 - returns one resource');

      request( { url:base_url, headers: headers }, function(error, response, body) {
        expect(JSON.parse(response.body).artists.length).toBe(1);
        done();
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

  describe('GET /artists/{artistId}', function() {
    logger.info('Testing GET /artists/{artistId}');

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /artists/{artistId} - Returns http status code successful');

      var base_url = 'http://localhost:3000/artists/1';
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns the right artist', function(done) {
      logger.info('Testing GET /artists/{artistId} - Returns the right artist');

      var base_url = 'http://localhost:3000/artists/1';
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).artist.name).toBe('Antonio Vivaldi');
          done();
      });
    });

    it('returns http status code not found if there is no resource', function(done) {
      logger.info('Testing GET /artists/{artistId} - Returns http status code not found if there is no such resource');

      var wrong_url = 'http://localhost:3000/artists/100000';
      request( { url: wrong_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
          done();
      });
    });
  });

  describe('PUT /artists/{artistId}', function() {
    logger.info('Testing PUT /artists/{artistId}');
    var base_url = 'http://localhost:3000/artists/2';
    params = { description: 'German composer and wonderful pianist.' };

    it('returns http status code No Content (200)', function(done) {
      logger.info('Testing PUT /artists/{artistId} - returns 200 if everything is alright');
      request.put( { url: base_url, headers: headers, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing PUT /artists/{artistId} - returns 401 if there is no token');
      request.put( { url: base_url, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  })

  describe('POST /artists', function() {
    var base_url = 'http://localhost:3000/artists';
    logger.info('Testing POST /artists');

    it('returns http status code created (201)', function(done) {
      params = { name: 'Steve Vay', description: 'One of the best musicians all over the world.', genres: '["Rock", "Instrumental", "Blues"]' };
      logger.info('Testing POST /artists - Returns 201');
      request.post({ url: base_url, headers: headers, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(201);
        done();
      });
    });

    it('returns http error if the params are invalid', function(done) {
      params = { description: 'One of the best musicians all over the world.', genres: '["Rock", "Instrumental", "Blues"]' };
      logger.info('Testing POST /artists - returns 400 if the params are invalid or missing');
      request.post({ url: base_url, headers: headers, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });
  });

  describe('DELETE /artists/{artistId}', function() {
    logger.info('Testing DELETE /artists/{artistId}');
    var base_url = 'http://localhost:3000/artists/4';

    it('returns http status code no content', function(done) {
      logger.info('Testing DELETE /artists/{artistId} - Returns 204 if everything is alright');
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        expect(response.statusCode).toBe(204);
        done();
      });
    });

    it('returns http status code not found if there is no resource', function(done) {
      logger.info('Testing DELETE /artists/{artistId} - Returns 404 if there is no artist');
      var wrong_user_url = 'http://localhost:3000/artists/3000';
      request.delete( { url: wrong_user_url, headers: headers }, function(error, response, body){
        expect(response.statusCode).toBe(404);
        done();
      });
    });

    it('deletes an artist', function(done) {
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        logger.info('Testing DELETE /artists/{artistId} - Deletes the artist');
        var artists = 'http://localhost:3000/artists';
        request( { url: artists, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).artists.length).toBe(4);
          done();
        });
      });
    });
  });

  describe('POST /artists/{artistId}/follow', function() {
    var base_url = 'http://localhost:3000/artists/1/follow';
    logger.info('Testing POST /artists/{artistId}/follow');

    it('returns http status code created (201) and returns the artist followed', function(done) {
      logger.info('Testing POST /artists/{artistId}/follow - Returns 201');
      request.post({ url: base_url, headers: headers }, function(error, response, body) {
        expect(JSON.parse(response.body).id).toBe(1);
        expect(response.statusCode).toBe(201);
        orm.models.user.findById(1).then(function(user) {
          user.getArtists().then(function(artists) {
            expect(artists[0].id).toBe(JSON.parse(response.body).id);
          });
        });
        done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing POST /artists/{artistId}/follow - returns 401 if there is no token');
      request.post( { url: base_url }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  });

  describe('GET /artists/me/favorites', function() {
    logger.info('Testing GET /artists/me/favorites');

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /artists/me/favorites - Returns http status code successful');

      var base_url = 'http://localhost:3000/artists/me/favorites';
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(response.body).artists.length).toBe(1);
          done();
      });
    });
  });

  describe('DELETE /artists/{artistId}/follow', function() {
    var base_url = 'http://localhost:3000/artists/1/follow';
    logger.info('Testing DELETE /artists/{artistId}/follow');

    it('returns http status code created (201) and returns the artist followed', function(done) {
      logger.info('Testing DELETE /artists/{artistId}/follow - Returns 201');
      request.delete({ url: base_url, headers: headers }, function(error, response, body) {
        expect(response.statusCode).toBe(204);
        done();
      });
    });

    it('returns http status code not found if there is no resource', function(done) {
      logger.info('Testing DELETE /artists/{artistId}/follow - Returns 404');
      var wrong_artist_url = 'http://localhost:3000/artists/100000/follow'
      request.delete({ url: wrong_artist_url, headers: headers }, function(error, response, body) {
        expect(response.statusCode).toBe(404);
        done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing DELETE /artists/{artistId}/follow - returns 401 if there is no token');
      request.delete( { url: base_url }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  });

  describe('GET /artists/{artistId}/tracks', function() {
    var artistId = 1;
    var base_url = 'http://localhost:3000/artists/' + artistId + '/tracks';
    logger.info('Testing GET /artists/{artistId}/tracks');

    it('returns http status code created (200) and returns the tracks', function(done) {
      logger.info('Testing GET /artists/{artistId}/tracks - Returns 200');
      orm.models.song.findOne({ where: { name: 'Le quattro stagioni' } }).then(function(song) {
        song.addArtist(artistId);
        request.get({ url: base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).tracks[0].name).toBe('Le quattro stagioni');
          expect(response.statusCode).toBe(200);
          done();
        });
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing GET /artists/{artistId}/tracks - returns 401 if there is no token');
      request.get( { url: base_url }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  });
});
