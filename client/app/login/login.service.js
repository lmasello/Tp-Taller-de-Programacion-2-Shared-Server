(function () {
    'use strict';

    angular
        .module('Login')
        .service('loginUtils', loginUtils);

    loginUtils.$inject = ['jwtHelper'];
    function loginUtils(jwtHelper) {

        var getToken = function () {
            return localStorage.getItem('id_token');
        };

        var getRoles = function () {
            var token = this.getToken();
            return (token == undefined) ? undefined : jwtHelper.decodeToken(token).roles;
        };

        var isLogged = function() {
            var token = this.getToken();
            return (token == undefined) ? false : !this.isTokenExpired(token);
        };

        var isTokenExpired = function (token) {
            token = (token == undefined) ? this.getToken() : token;
            try {
                return jwtHelper.isTokenExpired(token);
            } catch (err) {
                return true;
            }
        };

        var hasRole = function(role) {
            return this.getRoles().filter(function(toCompare) {return role === toCompare}).length > 0;
        };

        var getProfile = function() {
            var profile = localStorage.getItem('profile');
            return JSON.parse(profile);
        };

        var getUserId= function() {
            var token = this.getToken();
            return (token == undefined) ? undefined : jwtHelper.decodeToken(token).jti;
        };

        var logout= function() {
            localStorage.removeItem('id_token');
            localStorage.removeItem('profile');
        };

        return {
            getToken: getToken,
            getRoles: getRoles,
            isTokenExpired: isTokenExpired,
            hasRole: hasRole,
            getProfile: getProfile,
            getUserId: getUserId,
            logout: logout,
            isLogged: isLogged
        };

    }

})();
