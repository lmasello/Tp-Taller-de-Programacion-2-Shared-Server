var express = require('express');
var router = express.Router();

router.get  ('/login', function (req, res, next) {
    res.render('../views/login', req);
});

module.exports = router;
