var express = require('express');
var router = express.Router();

router.get('/album', function (req, res, next) {
    if(req.cookies.id_token) {
        res.render('../views/albums', req);
    } else {
        res.redirect('/');
    }
});

module.exports = router;
