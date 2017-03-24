var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
  Example to fetch data from the database
*/
router.post('/api/token', function (req, res, next) {
  res.status(200)
      .json({
        token: 'ey123adasdoib2109adsnd1lX'
      });
});


module.exports = router;
