var express = require('express');
var logger = require('./config/logger/winston.js');
var app = express();
var port_number = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/', function (req, res) {
  res.send('Got a POST request')
});

app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user')
});

app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user')
});

app.listen(port_number, function () {
  console.log('Example app listening on port ' + port_number);
});
