var express = require('express');
var router = express.Router();

router.get  ('/signup', function (req, res, next) {
    if(req.cookies.id_token) {
        res.redirect('/me');
    } else {
        res.render('../views/signup', req);
    }
});

module.exports = router;
