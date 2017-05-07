var express = require('express');
var router = express.Router();
var tokenService = require('../../services/token-service');

router.post('/tokens', function (req, res, next) {
    if (req.body && req.body.userName && req.body.password || req.body.fb) {
        tokenService.createToken(req.body)
            .then(response => {
                res.status(201).json({token: response});
            })
            .catch(err => {
                err.status = 401;
                next(err);
            });
    } else {
        res.status(400).json({code: 400, message: 'Wrong parameters'});
    }
});

module.exports = router;
