var express = require('express');
var router = express.Router();

router.get('/me', function (req, res, next) {
    if(req.cookies.id_token) {
        res.render('../views/profile', req);
    } else {
        res.redirect('/');
    }
});

module.exports = router;
