const logger = require('../../server/config/logger/winston.js');
var request = require('request');
var tokenService = require('../../server/services/token-service.js');
var orm = require('./../../server/config/orm');

describe('Albums Controller', function() {
  var auth_user = { id: 1, userName: 'user1' }
  var token = tokenService.generateJwt(auth_user);
  var headers = { 'Authorization': 'Bearer ' + token };
  orm.models.album.findById(4).then(function(album) {
    album.addSong(1);
    album.addSong(2);
    album.addSong(3);
  });

  describe('GET /albums', function() {
    var base_url = 'http://localhost:3000/albums';
    logger.info('Testing GET /albums');

    it('returns four resources', function(done) {
      logger.info('Testing GET /albums - returns four resources');
      request( { url:base_url, headers: headers }, function(error, response, body) {
        expect(JSON.parse(response.body).albums.length).toBe(4);
        done();
      });
    });

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /albums - returns http code successful');
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    describe('GET /albums?ids=1,2', function() {
      var base_url = 'http://localhost:3000/albums?ids=1,2';
      logger.info('Testing GET /albums?ids=1,2');

      it('returns http status code successful (200)', function(done) {
        logger.info('Testing GET /albums?ids=1,2 - returns http status code successful');

        request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
        });
      });

      it('returns two resources', function(done) {
        logger.info('Testing GET /albums?ids=1,2 - returns two resources');

        request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).albums.length).toBe(2);
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

  describe('GET /albums/{album_id}', function() {
    logger.info('Testing GET /albums/{album_id}');

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /albums/{album_id} - Returns http status code successful');

      var base_url = 'http://localhost:3000/albums/4';
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns the right album', function(done) {
      logger.info('Testing GET /albums/{album_id} - Returns the right album');

      var base_url = 'http://localhost:3000/albums/4';
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).album.id).toBe(4);
          done();
      });
    });

    it('has the correct associations', function(done) {
      logger.info('Testing GET /albums/{album_id} - has the correct associations');

      var base_url = 'http://localhost:3000/albums/4';
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).album.songs.length).toBe(3);
          done();
      });
    });

    it('returns http status code not found if there is no resource', function(done) {
      logger.info('Testing GET /albums/{album_id} - Returns http status code not found if there is no such resource');

      var wrong_url = 'http://localhost:3000/albums/100000';
      request( { url: wrong_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
          done();
      });
    });
  });

  describe('PUT /albums/{album_id}', function() {
    logger.info('Testing PUT /albums/{album_id}');
    var base_url = 'http://localhost:3000/albums/2';

    it('returns http status code 200 and updates the resource', function(done) {
      params = { name: 'Concerto' };
      logger.info('Testing PUT /albums/{album_id} - returns 200 if everything is alright');
      request.put( { url: base_url, headers: headers, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(response.body).name).toBe('Concerto');
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing PUT /albums/{album_id} - returns 401 if there is no token');
      params = { name: 'Concerto' };
      request.put( { url: base_url, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });

    it('returns http status code not found if there is no user', function(done) {
      logger.info('Testing PUT /albums/{album_id} - returns 404 if there is no user');
      var wrong_url = 'http://localhost:3000/albums/100000';
      params = { name: 'Concerto' };
      request.put( { url: wrong_url, headers: headers, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
          done();
      });
    });
  })

  describe('DELETE /albums/{album_id}', function() {
    logger.info('Testing DELETE /albums/{album_id}');
    var base_url = 'http://localhost:3000/albums/2';

    it('returns http status code successful (204)', function(done) {
      logger.info('Testing DELETE /albums/{album_id} - Returns 204 if everything is alright');
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        expect(response.statusCode).toBe(204);
        done();
      });
    });

    it('deletes an album', function(done) {
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        logger.info('Testing DELETE /albums/{album_id} - Deletes the album');
        var albums = 'http://localhost:3000/albums';
        request( { url: albums, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).albums.length).toBe(3);
          done();
        });
      });
    });
  });

  describe('POST /albums', function() {
    var base_url = 'http://localhost:3000/albums';
    logger.info('Testing POST /albums');

    it('returns http status code created (201)', function(done) {
      params = { name: 'The Essential Stevie Ray Vaughan and Double Trouble',
                 release_date: '2002/09/18',
                 images: [ "https://en.wikipedia.org/wiki/File:The_Essential_Stevie_Ray_Vaughan_and_Double_Trouble.jpg#/media/File:The_Essential_Stevie_Ray_Vaughan_and_Double_Trouble.jpg" ],
                 genres: [ "Blues Rock" ],
                 artists: '[ 4 ]'
               };
      logger.info('Testing POST /albums - Returns 201');
      request.post({ url: base_url, headers: headers, json: params }, function(error, response, body) {
        expect(response.statusCode).toBe(201);
        expect(response.body.album.name).toBe('The Essential Stevie Ray Vaughan and Double Trouble');
        done();
      });
    });

    it('returns http error if the params are invalid', function(done) {
      params = { n: 'wrong param' };
      logger.info('Testing POST /albums - returns 400 if the params are invalid');
      request.post({ url: base_url, headers: headers, json: params }, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });
  });
});
