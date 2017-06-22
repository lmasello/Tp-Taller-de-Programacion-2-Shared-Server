var express = require('express');
var router = express.Router();

router.get('/artistas', function (req, res, next) {
    if(req.cookies.id_token) {
        res.render('../views/artists', req);
    } else {
        res.redirect('/');
    }
});

module.exports = router;
