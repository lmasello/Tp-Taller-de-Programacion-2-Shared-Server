var express = require('express');
var router = express.Router();
var connectionService = require('../../services/token-service');

router.post('/tokens', function (req, res, next) {
    var user = req.body;
    var email = user.email || undefined;
    var password = user.password || undefined;

    if (email != undefined && password != undefined) {
      connectionService.getToken({email : email, password: password})
                       .then(token => {
                         res.status(201).json({token : token});
                       }, error => {
                         next(error);
                       })
    } else {
      throw new Error('User and password are required');
    }
});

router.post('/social/tokens', function (req, res, next) {
    var user = req.body;
    var userId = user.user_id || undefined;
    var accessToken = user.access_token || undefined;

    if (userId != undefined && accessToken != undefined) {
        connectionService.getSocialToken({ userId: userId, accessToken: accessToken}, function(jwt){
            res.status(201).json({token : jwt});
        });
    } else {
        throw new Error('User and password are required');
    }
});

module.exports = router;
