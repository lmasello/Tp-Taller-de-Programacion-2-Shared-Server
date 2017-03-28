const config = require('../config/config');
var sha1 = require('sha1');
var pgp = require('pg-promise')();
var db = pgp(config.postgres.uri);
var jwt = require('jsonwebtoken');


// add query functions
module.exports = {
    signUp: signUp,
    getToken: getToken
};

/**
 * Create a new user on the system
 */
function signUp(user) {
    return findUserByEmail(user.email)
        .then(byEmail => {
            throw new Error('User with email ' + byEmail.email + ' already exists');
        }, error => {
            return insertNewUser(user);
        });
}

/**
 * Return a new access_token for the user.
 */
function getToken(user) {
    return findUserByEmail(user.email)
        .then(byEmail => {
            if (byEmail.password != sha1(user.password)) {
                //this message should not be exposed in the response...
                throw new Error('Wrong password');
            }
            return Promise.resolve(generateJwt(byEmail));
        }, error => {throw error});
}

function insertNewUser(user) {
    user.password = sha1(user.password);
    return db.any('insert into users(email, password) values(${email}, ${password})', user);

}

function findUserByEmail(email) {
    return db.one('select * from users where email = $1', email);
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
        email: user.email
    }, 'shhhhh', { expiresIn: '24h' });
}
