var request = require('request');
var tokenService = require('../../server/services/token-service.js');

describe('Users Controller', function() {
  var auth_user = { id: 1, email: 'maselloleandro@gmail.com' }
  var token = tokenService.generateJwt(auth_user);
  var headers = { 'Authorization': 'Bearer ' + token };

  describe('GET /users', function() {
    var base_url = 'http://localhost:3000/users';

    it('returns http status code successful (200)', function(done) {
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns three resources', function(done) {
      request( { url:base_url, headers: headers }, function(error, response, body) {
        console.log(JSON.parse(response.body)['users']);
        expect(JSON.parse(response.body)['users'].length).toBe(3);
        done();
      });
    });

    describe('GET /users?ids=1,2', function() {
      var base_url = 'http://localhost:3000/users?ids=1,2';
      it('returns http status code successful (200)', function(done) {
        request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
        });
      });

      it('returns two resources', function(done) {
        request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body)['users'].length).toBe(2);
          done();
        });
      });
    })

    // If it does not provide authentication
    it('returns http status code Unauthorized(401)', function(done) {
      request( { url:base_url }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });

    // If it provides wrong token
    it('returns http status code unauthorized (401)', function(done) {
      var headers = { 'Authorization': token + 'abcd' };
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  });

  describe('GET /users/{user_id}', function() {
    var base_url = 'http://localhost:3000/users/1';
    it('returns http status code successful (200)', function(done) {
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns http status code not found if there is no resource', function(done) {
      var wrong_url = 'http://localhost:3000/users/100000';
      request( { url: wrong_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(404);
          done();
      });
    });
  });

  describe('GET /users/me', function() {
    var base_url = 'http://localhost:3000/users/me';
    it('returns http status code successful (200)', function(done) {
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(response.statusCode).toBe(200);
          done();
      });
    });

    it('returns the correct user', function(done) {
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body)['user']['id']).toBe(1);
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      request( { url: base_url }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  });

  describe('GET /users/me/contacts', function() {
    var base_url = 'http://localhost:3000/users/me/contacts';

    it('returns http status code successful', function(done) {
      request( { url:base_url, headers: headers }, function(error, response, body) {
        expect(JSON.parse(response.statusCode)).toBe(200);
        done();
      });
    });

    it('returns the user contacts', function(done) {
      request( { url:base_url, headers: headers }, function(error, response, body) {
          expect(JSON.parse(response.body)['contacts'][0]['friend_id']).toBe(2);
          done();
      });
    });

    it('returns the contacts as a two way relationship', function(done) {
      //this user (2) has two relationships (2, 3) and (1, 2)
      var auth_user = { id: 2, email: 'gguzelj@gmail.com' }
      var token = tokenService.generateJwt(auth_user);
      var headers = { 'Authorization': 'Bearer ' + token };

      request( { url:base_url, headers: headers }, function(error, response, body) {
        var friends = JSON.parse(response.body)['contacts'];
        expect(friends[0]['friend_id']).toBe(1);
        expect(friends[1]['friend_id']).toBe(3);
        expect(friends.length).toBe(2);
        done();
      });
    })

    it('returns http status code unauthorized if there is no token', function(done) {
      request( { url: base_url }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  })

  describe('PUT /users/me', function() {
    var base_url = 'http://localhost:3000/users/me';
    params = { first_name: 'Lea', last_name: 'M' };

    it('returns http status code No Content (204)', function(done) {
      request.put( { url:base_url, headers: headers, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(204);
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      request.put( { url:base_url, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  })

  describe('PUT /users/{userId}', function() {
    var base_url = 'http://localhost:3000/users/2';
    params = { first_name: 'G', password: '1234567890' };

    it('returns http status code No Content (204)', function(done) {
      request.put( { url:base_url, headers: headers, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(204);
          done();
      });
    });

    it('returns http status code unauthorized if there is no token', function(done) {
      request.put( { url:base_url, form: params }, function(error, response, body) {
          expect(response.statusCode).toBe(401);
          done();
      });
    });
  })

  describe('DELETE /users/{userId}', function() {
    var base_url = 'http://localhost:3000/users/3';

    it('returns http status code successful (200)', function(done) {
      request.delete( { url: base_url, headers: headers }, function(error, response, body){
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });

  describe('POST /users', function() {
    var base_url = 'http://localhost:3000/users';

    // TODO Improve this cleanup
    beforeEach(function(){
      resource_url = 'http://localhost:3000/users/48';
      request.delete( { url:resource_url, headers: headers });
    })

    it('returns http status code created (201)', function(done) {
      params = { email: 'maselloleandro+1@gmail.com',
                first_name: 'Leandro',
                last_name: 'Masello',
                password: '12345678' };
      request.post({ url: base_url, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(201);
        done();
      });
    });

    it('returns http error if the params are invalid', function(done) {
      params = { email: 'maselloleandro+1@gmail.com',
                password: '12345678' };
      request.post({ url: base_url, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });
  });
  describe('POST /users/me/contacts', function() {
    var base_url = 'http://localhost:3000/users/me/contacts';

    // TODO Improve this cleanup
    beforeEach(function(){
      resource_url = 'http://localhost:3000/users/48';
      request.delete( { url:resource_url, headers: headers });
    })

    it('returns http status code created (201)', function(done) {
      params = { contact_id: 3 };
      request.post({ url: base_url, headers: headers, form: params }, function(error, response, body) {
        console.log(response.body);
        expect(response.statusCode).toBe(201);
        done();
      });
    });

    it('returns http error if the params are invalid', function(done) {
      params = { contact_id: 0 };
      request.post({ url: base_url, headers: headers, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });
  });
});
