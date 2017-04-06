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
  });
});
