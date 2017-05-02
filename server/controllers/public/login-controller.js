var express = require('express');
var router = express.Router();

router.get('/login', function (req, res, next) {
    if(req.cookies.id_token) {
        res.redirect('/');
    } else {
        res.render('../views/login', req);
    }
});

module.exports = router;
