(function(){
    'use strict';

    angular
        .module('Login', ['angular-jwt', 'facebook'])

        .config(function(FacebookProvider) {
            // Setting application id for music-io
            FacebookProvider.init('444061072611756');
        })
        .config(JwtInterceptorConfig);


    JwtInterceptorConfig.$inject = ['$httpProvider'];

    function JwtInterceptorConfig ($httpProvider, $q) {
        $httpProvider.interceptors.push(function($q) {
            return {
                request: function(config) {
                    var token = localStorage.getItem('id_token');
                    if (token) {
                        config.headers['Authorization'] = 'Bearer ' + token;
                    }
                    return config;
                }
            };
        });
    };

}());