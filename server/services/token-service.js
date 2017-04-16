const orm = require('./../config/orm');
var jwt = require('jsonwebtoken');
var sha1 = require('sha1');
var FB = require('fb');

const config = require('../config/config');

// add query functions
module.exports = {
    getToken: getToken,
    generateJwt: generateJwt,
    getSocialToken: getSocialToken,
};

/**
 * Return a new access_token for the user.
 */
function getToken(user) {
    return findUserByEmail(user.email)
        .then(byEmail => {
            if (byEmail.password !== sha1(user.password)) {
                //this message should not be exposed in the response...
                throw new Error('Wrong password');
            }
            return Promise.resolve(generateJwt(byEmail));
        }, error => {throw error});
}

/**
 * Return a new access_token for the social user.
 */
function getSocialToken(user, callback) {
    var fb = new FB.Facebook({
        accessToken: user.accessToken,
        appId: config.facebookAppId
    });

    fb.api('me', {fields: 'email,id,age_range,name,first_name,last_name,gender,picture'}, function (res) {
        if(!res || res.error) {
            throw new Error('Unexpected error happen while validating access_token');
        }

        var fbData = {
            id : res.id,
            firstName: res.first_name,
            email : res.email,
            avatar: res.picture.data.url
        };

        callback(generateJwt(fbData));
    });

}

function findUserByEmail(email) {
  return orm.models.user.findOne( { where: { email: email } });
}

/**
 * Usually, a jwt contains certain claims. The common ones are:
 *  -iss (issuer)
 *  -exp (expiration time)
 *  -sub (subject)
 *  -aud (audience)
 */
function generateJwt(user) {
    return jwt.sign({
        iss: 'io-music-shared-server',
        iat: Math.floor(Date.now() / 1000),
        sub: user.id,
        aud: 'io-music',
        email: user.email,
        firstName: user.firstName
    }, config.secret, { expiresIn: '7d' });
}
