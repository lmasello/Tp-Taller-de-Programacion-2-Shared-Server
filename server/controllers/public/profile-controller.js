var express = require('express');
var router = express.Router();

router.get  ('/me', function (req, res, next) {
    res.render('../views/profile', req);
});

module.exports = router;
