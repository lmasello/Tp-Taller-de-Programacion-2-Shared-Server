var base_url = 'http://localhost:3000/tokens';
var request = require('request');

describe('Tokens Controller', function() {
  describe('POST /tokens', function() {
    params = { email: 'maselloleandro@gmail.com', password: '12345678' };

    it('returns http status code created (201)', function(done) {
      request.post({ url: base_url, form: params }, function(error, response, body) {
        expect(response.statusCode).toBe(201);
        done();
      });
    });
  });
});
