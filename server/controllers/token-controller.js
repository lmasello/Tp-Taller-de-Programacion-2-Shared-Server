var express = require('express');
var router = express.Router();
var tokenService = require('../services/token-service');

router.post('/api/sign-up', function (req, res, next) {

    var user = req.body;
    var email = user.email || undefined;
    var password = user.password || undefined;

    if (email != undefined && password != undefined) {
        tokenService.signUp({email : email, password: password})
            .then(response => {
                res.status(201).json(response);
            }, error => {
                next(error);
            })
    } else {
        next(new Error('User and password are required'));
    }

});


router.post('/api/token', function (req, res, next) {
    var user = req.body;
    var email = user.email || undefined;
    var password = user.password || undefined;

    if (email != undefined && password != undefined) {
        tokenService.getToken({email : email, password: password})
            .then(token => {
                res.status(200).json({token : token});
            }, error => {
                next(error);
            })
    } else {
        next(new Error('User and password are required'));
    }
});

module.exports = router;
