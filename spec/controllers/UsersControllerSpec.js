const logger = require('../../server/config/logger/winston.js');
var request = require('request');
var tokenService = require('../../server/services/token-service.js');
var orm = require('./../../server/config/orm');

describe('Users Controller', function() {
  var auth_user = { id: 1, userName: 'user1' }
  var token = tokenService.generateJwt(auth_user);
  var headers = { 'Authorization': 'Bearer ' + token };

  describe('GET /users', function() {
    var base_url = 'http://localhost:3000/users';
    logger.info('Testing GET /users');

    it('returns three resources', function(done) {
      logger.info('Testing GET /users - returns three resources');
      request( { url:base_url, headers: headers }, function(error, response, body) {
        expect(JSON.parse(response.body).users.length).toBe(3);
        done();
      });
    });

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /users - returns http code successful');
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    describe('GET /users?ids=1,2', function() {
      var base_url = 'http://localhost:3000/users?ids=1,2';
      logger.info('Testing GET /users?ids=1,2');

      it('returns http status code successful (200)', function(done) {
        logger.info('Testing GET /users?ids=1,2 - returns http status code successful');

        request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
        });
      });

      it('returns two resources', function(done) {
        logger.info('Testing GET /users?ids=1,2 - returns two resources');

        request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).users.length).toBe(2);
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

    // If it provides wrong token
    it('returns http status code unauthorized (401)', function(done) {
      logger.info('Testing If the request provides a wrong token, it returns 401');
      var headers = { 'Authorization': token + 'abcd' };
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  });

  describe('GET /users/{user_id}', function() {
    logger.info('Testing GET /users/{user_id}');

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /users/{user_id} - Returns http status code successful');

      var base_url = 'http://localhost:3000/users/1';
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns http status code not found if there is no resource', function(done) {
      logger.info('Testing GET /users/{user_id} - Returns http status code not found if there is no such resource');

      var wrong_url = 'http://localhost:3000/users/100000';
      request( { url: wrong_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
          done();
      });
    });
  });

  describe('GET /users/me', function() {
    logger.info('Testing GET /users/me');
    var base_url = 'http://localhost:3000/users/me';

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing GET /users/me - Returns http status code successful');
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns the correct user', function(done) {
      logger.info('Testing GET /users/me - Returns the right user');
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).user['id']).toBe(1);
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing GET /users/me - Returns error if there is no token');
      request( { url: base_url }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  });

  describe('POST /users/me/contacts', function() {
    logger.info('Testing POST /users/me/contacts');
    var base_url = 'http://localhost:3000/users/me/contacts';

    it('returns http status code created (201)', function(done) {
      logger.info('Testing POST /users/me/contacts - Returns 201');
      params = { friend_id: 3 };
      request.post({ url: base_url, headers: headers, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(201);
        done();
      });
    });

    it('returns http error if the params are invalid', function(done) {
      logger.info('Testing POST /users/me/contacts - Returns 400 if the param is invalid');
      params = { friend_id: 0 };
      request.post({ url: base_url, headers: headers, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });
  });


  describe('GET /users/me/contacts', function() {
    logger.info('Testing GET /users/me/contacts');
    var base_url = 'http://localhost:3000/users/me/contacts';

    it('returns http status code successful', function(done) {
      logger.info('Testing GET /users/me/contacts - Returns 200 if everything is okay');
      request( { url:base_url, headers: headers }, function(error, response, body) {
        expect(JSON.parse(response.statusCode)).toBe(200);
        done();
      });
    });

    it('returns the user contacts', function(done) {
      logger.info('Testing GET /users/me/contacts - returns the friends of the user');
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).contacts[0]['friend_id']).toBe(3);
          done();
      });
    });

    it('returns the contacts as a two way relationship', function(done) {
      logger.info('Testing GET /users/me/contacts - returns the friends of the user in the other way');
      var auth_user = { id: 3, userName: 'user3' }
      var token = tokenService.generateJwt(auth_user);
      var headers = { 'Authorization': 'Bearer ' + token };

      request( { url:base_url, headers: headers }, function(error, response, body) {
        var friends = JSON.parse(response.body).contacts;
        expect(friends[0]['friend_id']).toBe(1);
        expect(friends.length).toBe(1);
        done();
      });
    })

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing GET /users/me/contacts - returns 401 if there is no token');
      request( { url: base_url }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  })

  describe('PUT /users/me', function() {
    logger.info('Testing PUT /users/me');
    var base_url = 'http://localhost:3000/users/me';
    params = { firstName: 'Lea', lastName: 'M' };

    it('returns http status code No Content (200)', function(done) {
      logger.info('Testing PUT /users/me - returns 200 if everything is alright');
      request.put( { url:base_url, headers: headers, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing PUT /users/me - returns 401 if there is no token');
      request.put( { url:base_url, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  })

  describe('PUT /users/{userId}', function() {
    logger.info('Testing PUT /users/{userId}');
    var base_url = 'http://localhost:3000/users/2';
    params = { firstName: 'G', password: '1234567890' };

    it('returns http status code No Content (200)', function(done) {
      logger.info('Testing PUT /users/{userId} - returns 200 if everything is alright');
      request.put( { url: base_url, headers: headers, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      logger.info('Testing PUT /users/{userId} - returns 401 if there is no token');
      request.put( { url: base_url, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  })

  describe('DELETE /users/{userId}', function() {
    logger.info('Testing DELETE /users/{userId}');
    var base_url = 'http://localhost:3000/users/3';

    it('returns http status code successful (200)', function(done) {
      logger.info('Testing DELETE /users/{userId} - Returns 200 if everything is alright');
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        expect(response.statusCode).toBe(204);
        done();
      });
    });

    it('deletes a user', function(done) {
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        logger.info('Testing DELETE /users/{userId} - Deletes the user');
        var users = 'http://localhost:3000/users';
        request( { url: users, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body).users.length).toBe(2);
          done();
        });
      });
    });
  });

  describe('POST /users', function() {
    var base_url = 'http://localhost:3000/users';
    logger.info('Testing POST /users');

    it('returns http status code created (201)', function(done) {
      params = { email: 'maselloleandro+1@gmail.com', firstName: 'Leandro', lastName: 'Masello',
                 password: '12345678', userName: 'anotherUser', country: 'Argentina',
                 birthdate: '1991/08/06' };
      logger.info('Testing POST /users - Returns 201');
      request.post({ url: base_url, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(201);
        done();
      });
    });

    it('returns http error if the params are invalid', function(done) {
      params = { email: 'maselloleandro+1@gmail.com', password: '12345678' };
      logger.info('Testing POST /users - returns 400 if the params are invalid');
      request.post({ url: base_url, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });
  });
});
