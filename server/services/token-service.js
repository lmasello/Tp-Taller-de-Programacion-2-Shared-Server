const orm = require('./../config/orm');
var jwt = require('jsonwebtoken');
var sha1 = require('sha1');
var FB = require('fb');

const config = require('../config/config');

// add query functions
module.exports = {
    createToken: createToken
};

/**
 * Return a new access_token for the user.
 */
function createToken(user) {
    if (user.fb) {
        return handleFb(user);
    } else {
        return handleUsernamePassword(user);
    }
}

function handleFb(user) {
    return fetchFbData(user.fb.authToken)
        .then(createUserIfNotExists)
        .then(user => Promise.resolve(generateJwt(user)));
}

function createUserIfNotExists(fbUser) {
    return findUserByFb(fbUser.id)
        .then(user => {
            if (user) return Promise.resolve(user);
            return orm.models.user.create({
                fb: fbUser.id,
                firstName: fbUser.first_name,
                email : fbUser.email,
                lastName: fbUser.last_name,
                images: [fbUser.picture.data.url]
            });
        });
}

function handleUsernamePassword(user) {
    return findUserByUserName(user.userName)
        .then(byUserName => {
            if (!byUserName || byUserName.password !== sha1(user.password)) {
                throw new Error('Invalid userName or password');
            }
            return Promise.resolve(generateJwt(byUserName));
        }, error => {throw error});
}

function fetchFbData(token) {
    return new Promise((resolve, reject) => {
        let fb = new FB.Facebook({
            accessToken: token,
            appId: config.facebookAppId
        });
        fb.api('me', {fields: 'email,id,age_range,name,first_name,last_name,gender,picture,birthday'}, res => {
            if(!res || res.error) {
                reject(new Error('Invalid authToken'));
            }
            resolve(res);
        });
    });
}

function findUserByUserName(userName) {
    return orm.models.user.findOne( { where: { userName: userName } });
}

function findUserByFb(userId) {
    return orm.models.user.findOne( { where: { fb: userId } });
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
        firstName: user.firstName,
        lastName: user.lastName
    }, config.secret, { expiresIn: '7d' });
}
