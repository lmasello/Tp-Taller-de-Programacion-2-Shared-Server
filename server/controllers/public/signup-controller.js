var express = require('express');
var router = express.Router();

router.get  ('/signup', function (req, res, next) {
    res.render('../views/signup', req);
});

module.exports = router;
