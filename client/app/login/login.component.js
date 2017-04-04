(function () {
    'use strict';

    angular
        .module('Login')
        .component('login', {
            controller: loginCtrl,
            bindings: {},
            templateUrl: '/public/app/login/login.html'
        });

    loginCtrl.$inject = ['$http'];

    function loginCtrl($http) {
        var self = this;

        this.submitLogin = function() {
            $http.post('/api/token', self.data)
                .then(response => {
                    console.log(response);
                        localStorage.setItem('id_token', response.data.token);
                        location.href = '/#';
                    },
                    error => {
                        console.error(error);
                    });
        }
    }
} ());
