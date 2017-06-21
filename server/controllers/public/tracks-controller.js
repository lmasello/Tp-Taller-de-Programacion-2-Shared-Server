var express = require('express');
var router = express.Router();

router.get('/canciones', function (req, res, next) {
    if(req.cookies.id_token) {
        res.render('../views/tracks', req);
    } else {
        res.redirect('/');
    }
});

module.exports = router;
