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

module.exports = router;
