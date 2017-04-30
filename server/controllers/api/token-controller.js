var express = require('express');
var router = express.Router();
var tokenService = require('../../services/token-service');

router.post('/tokens', function (req, res, next) {
    var user = req.body;
    var userName = user.userName || undefined;
    var password = user.password || undefined;
    if (userName != undefined && password != undefined) {
        tokenService.getToken({userName : userName, password: password})
            .then(token => {
                res.status(201).json({token : token});
            })
            .catch(error => {
                error.status = 404;
                next(error);
            })
    } else {
        var err = new Error('User and password are required');
        err.status = 400;
        console.log(err);
        next(err);
    }
});

router.post('/social/tokens', function (req, res, next) {
    var user = req.body;
    var userId = user.user_id || undefined;
    var accessToken = user.access_token || undefined;

    if (userId != undefined && accessToken != undefined) {
        tokenService.getSocialToken({ userId: userId, accessToken: accessToken}, function(jwt){
            res.status(201).json({token : jwt});
        });
    } else {
        throw new Error('User and password are required');
    }
});

module.exports = router;
