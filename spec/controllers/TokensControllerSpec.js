const logger = require('../../server/config/logger/winston.js');
const request = require('request');
var base_url = 'http://localhost:3000/tokens';

describe('Tokens Controller', function() {
  describe('POST /tokens', function() {
    logger.info('Testing POST /tokens');

    it('returns http status code created (201)', function(done) {
      logger.info('Testing POST /tokens - returns 201 if everything is okay');
      params = { userName: 'user1', password: '12345678' };
      request.post({ url: base_url, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(201);
        done();
      });
    });

    it('returns http status code 400 if there is no password', function(done) {
      logger.info('Testing POST /tokens - returns 400 if there is no password');
      params = { userName: 'user1' };
      request.post({ url: base_url, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });


    it('returns http status code 401 if there is no resource for the \
        given params', function(done) {
      logger.info('Testing POST /tokens - returns 401 when userName or password are incorrect');
      params = { userName: 'email1+1000000@gmail.com', password: '12345678' };
      request.post({ url: base_url, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(401);
        done();
      });
    });

    it('returns http status 401 if facebook login fails', done => {
      logger.info('Testing POST /tokens - returns 401 if facebook login fails');
      params = { fb: {authToken: 'SARASA'}};
      request.post({ url: base_url, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(401);
        done();
      });
    });

  });
});
