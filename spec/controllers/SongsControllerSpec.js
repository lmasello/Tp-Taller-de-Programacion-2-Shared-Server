const logger = require('../../server/config/logger/winston.js');
var request = require('request');
var tokenService = require('../../server/services/token-service.js');
var orm = require('./../../server/config/orm');

describe('Tracks Controller', function() {
  var auth_user = { id: 1, userName: 'user1' }
  var token = tokenService.generateJwt(auth_user);
  var headers = { 'Authorization': 'Bearer ' + token };

  describe('GET /tracks', function() {
    var base_url = 'http://localhost:3000/tracks';
    logger.info('Testing GET /tracks');

    it('returns three resources', function(done) {
      logger.info('Testing GET /tracks - returns three resources');
      request( { url:base_url, headers: headers }, function(error, response, body) {
        expect(JSON.parse(response.body).tracks.length).toBe(3);
        done();
      });
    });

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /tracks - returns http code successful');
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    describe('GET /tracks?ids=1,2', function() {
      var base_url = 'http://localhost:3000/tracks?ids=1,2';
      logger.info('Testing GET /tracks?ids=1,2');

      it('returns http status code successful (200)', function(done) {
        logger.info('Testing GET /tracks?ids=1,2 - returns http status code successful');

        request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
        });
      });

      it('returns two resources', function(done) {
        logger.info('Testing GET /tracks?ids=1,2 - returns two resources');

        request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).tracks.length).toBe(2);
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

  describe('GET /tracks/{track_id}', function() {
    logger.info('Testing GET /tracks/{track_id}');

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /tracks/{track_id} - Returns http status code successful');

      var base_url = 'http://localhost:3000/tracks/1';
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns the right song', function(done) {
      logger.info('Testing GET /tracks/{track_id} - Returns the right song');

      var base_url = 'http://localhost:3000/tracks/1';
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).track.id).toBe(1);
          done();
      });
    });

    it('returns http status code not found if there is no resource', function(done) {
      logger.info('Testing GET /tracks/{track_id} - Returns http status code not found if there is no such resource');

      var wrong_url = 'http://localhost:3000/tracks/100000';
      request( { url: wrong_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
          done();
      });
    });
  });

  describe('GET /tracks/{track_id}/popularity', function() {
    logger.info('Testing GET /tracks/{track_id}/popularity');
    orm.models.song.findById(1).then(function(song) {
      song.addUser(2, { rate: 3 });
    });
    orm.models.song.findById(1).then(function(song) {
      song.addUser(3, { rate: 5 });
    });

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /tracks/{track_id}/popularity - Returns http status code successful');

      var base_url = 'http://localhost:3000/tracks/1/popularity';
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(response.body).rate).toBe('4.0000000000000000');
          done();
      });
    });

    it('returns http status code not found if there is no resource', function(done) {
      logger.info('Testing GET /tracks/{track_id}/popularity - Returns http status code not found if there is no such resource');

      var wrong_url = 'http://localhost:3000/tracks/100000/popularity';
      request( { url: wrong_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
          done();
      });
    });
  });

  describe('PUT /tracks/{track_id}', function() {
    logger.info('Testing PUT /tracks/{track_id}');
    var base_url = 'http://localhost:3000/tracks/2';
    params = { name: 'Concerto in C minor' };

    it('returns http status code No Content (200)', function(done) {
      logger.info('Testing PUT /tracks/{track_id} - returns 200 if everything is alright');
      request.put( { url: base_url, headers: headers, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing PUT /tracks/{track_id} - returns 401 if there is no token');
      request.put( { url: base_url, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });

    it('returns http status code not found if there is no user', function(done) {
      logger.info('Testing PUT /tracks/{track_id} - returns 404 if there is no user');
      var wrong_url = 'http://localhost:3000/tracks/100000';
      request.put( { url: wrong_url, headers: headers, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
          done();
      });
    });
  })

  describe('DELETE /tracks/{track_id}', function() {
    logger.info('Testing DELETE /tracks/{track_id}');
    var base_url = 'http://localhost:3000/tracks/3';

    it('returns http status code successful (204)', function(done) {
      logger.info('Testing DELETE /tracks/{track_id} - Returns 204 if everything is alright');
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        expect(response.statusCode).toBe(204);
        done();
      });
    });

    it('deletes a song', function(done) {
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        logger.info('Testing DELETE /tracks/{track_id} - Deletes the song');
        var songs = 'http://localhost:3000/tracks';
        request( { url: songs, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).tracks.length).toBe(2);
          done();
        });
      });
    });
  });

  describe('POST /tracks', function() {
    var base_url = 'http://localhost:3000/tracks';
    logger.info('Testing POST /tracks');

    it('returns http status code created (201)', function(done) {
      params = { name: 'Viva la vida', duration: '4000000', artists: '[ 3 ]' };
      logger.info('Testing POST /tracks - Returns 201');
      request.post({ url: base_url, headers: headers, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(201);
        done();
      });
    });

    it('returns http error if the params are invalid', function(done) {
      params = { n: 'wrong param' };
      logger.info('Testing POST /tracks - returns 400 if the params are invalid');
      request.post({ url: base_url, headers: headers, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });
  });

  describe('POST /tracks/{track_id}/popularity', function() {
    logger.info('Testing POST /tracks/{track_id}/popularity');
    var base_url = 'http://localhost:3000/tracks/2/popularity';

    it('returns http status code Created 204', function(done) {
      params = { rate: 5 };
      logger.info('Testing POST /tracks/{track_id}/popularity - returns 204 if everything is alright');
      request.post( { url: base_url, headers: headers, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(204);
        done();
      });
    });

    it('returns the relation with the right value', function(done) {
      params = { rate: 5 };
      logger.info('Testing POST /tracks/{track_id}/popularity - returns the relation with the right value');
      request.post( { url: base_url, headers: headers, form: params }, function(error, response, body) {
        return orm.models.user_song.findOne({ where: { song_id: 2, user_id: 1 } }).then(function(user_song) {
          expect(user_song.rate).toBe(5)
          done();
        });
      });
    });

    it('returns http status code bad request if the rate is more than five', function(done) {
      params = { rate: 6 };
      logger.info('Testing POST /tracks/{track_id}/popularity - returns 400 if the rate is more than five');
      request.post( { url: base_url, headers: headers, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });

    it('returns http status code bad request if the rate is less than one', function(done) {
      params = { rate: 0 };
      logger.info('Testing POST /tracks/{track_id}/popularity - returns 400 if the rate is less than one');
      request.post( { url: base_url, headers: headers, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      params = { rate: 5 };
      logger.info('Testing PUT /tracks/{track_id} - returns 401 if there is no token');
      request.post( { url: base_url, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  })

  describe('POST /tracks/{track_id}/like', function() {
    logger.info('Testing POST /tracks/{track_id}/like');
    var base_url = 'http://localhost:3000/tracks/2/like';

    it('returns http status code Created 204', function(done) {
      logger.info('Testing POST /tracks/{track_id}/like - returns 204 if everything is alright');
      request.post( { url: base_url, headers: headers }, function(error, response, body) {
        expect(response.statusCode).toBe(204);
        done();
      });
    });

    it('sets the user song liked', function(done) {
      logger.info('Testing POST /tracks/{track_id}/like - sets the user song liked');
      request.post( { url: base_url, headers: headers }, function(error, response, body) {
        return orm.models.user_song.findOne({ where: { song_id: 2, user_id: 1 } }).then(function(user_song) {
          expect(user_song.liked).toBe(true)
          done();
        });
      });
    });
  })

  describe('DELETE /tracks/{track_id}/like', function() {
    logger.info('Testing DELETE /tracks/{track_id}/like');
    var base_url = 'http://localhost:3000/tracks/2/like';

    it('returns http status code Created 204', function(done) {
      logger.info('Testing DELETE /tracks/{track_id}/like - returns 204 if everything is alright');
      request.delete( { url: base_url, headers: headers }, function(error, response, body) {
        expect(response.statusCode).toBe(204);
        done();
      });
    });

    it('sets the user song liked', function(done) {
      logger.info('Testing DELETE /tracks/{track_id}/like - sets the user song disliked');
      request.delete( { url: base_url, headers: headers }, function(error, response, body) {
        return orm.models.user_song.findOne({ where: { song_id: 2, user_id: 1 } }).then(function(user_song) {
          expect(user_song.liked).toBe(false)
          done();
        });
      });
    });
  })
});
