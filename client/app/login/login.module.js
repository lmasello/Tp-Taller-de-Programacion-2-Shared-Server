(function(){
    'use strict';

    angular
        .module('Login', ['angular-jwt'])
        .config(config);

    config.$inject = ['$httpProvider'];

    function config ($httpProvider, $q) {
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