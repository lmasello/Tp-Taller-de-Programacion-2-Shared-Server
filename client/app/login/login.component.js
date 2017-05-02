(function () {
    'use strict';

    angular
        .module('Login')
        .component('login', {
            controller: loginCtrl,
            bindings: {},
            templateUrl: '/public/app/login/login.html'
        });

    loginCtrl.$inject = ['$http', 'Facebook', '$cookies'];

    function loginCtrl($http, Facebook, $cookies) {
        var self = this;

        this.submitLogin = function() {
            $http.post('/tokens', self.data)
                .then(response => {
                        $cookies.put('id_token', response.data.token);
                        localStorage.setItem('id_token', response.data.token);
                        location.href = '/#';
                    },
                    error => {
                        console.error(error);
                    });
        };

        this.facebookLogin = function() {
            Facebook.login(function (response) {
                if (response.status === 'connected') {
                    submitSocialLogin(response.authResponse);
                } else {
                    console.error(response);
                }
            }, {scope: 'email, public_profile'});
        };

        function submitSocialLogin(authResponse) {
            var data = {
                access_token : authResponse.accessToken,
                user_id : authResponse.userID
            };

            $http.post('/social/tokens', data)
                .then(response => {
                        $cookies.put('id_token', response.data.token);
                        localStorage.setItem('id_token', response.data.token);
                        location.href = '/#';
                    },
                    error => {
                        console.error(error);
                    });
        }
    }
} ());
