var connectionService = require('../services/connection-service');
var jwt = require('jsonwebtoken');
var sha1 = require('sha1');
const config = require('../config/config');

// add query functions
module.exports = { getToken: getToken };

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

function findUserByEmail(email) {
    return connectionService.one('select * from users where email = $1', email);
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
        first_name: user.first_name
    }, config.secret, { expiresIn: '7d' });
}
