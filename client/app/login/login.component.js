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
        self.fbLoginError = false;
        self.loginError = false;

        this.submitLogin = function() {
            $http.post('/tokens', self.data)
                .then(response => {
                    $cookies.put('id_token', response.data.token);
                    localStorage.setItem('id_token', response.data.token);
                    location.href = '/#';
                })
                .catch(error => {
                    self.loginError = true;
                });
        };

        this.facebookLogin = function() {
            Facebook.login(function (response) {
                if (response.status === 'connected') {
                    submitSocialLogin(response.authResponse);
                } else {
                    self.fbLoginError = true;
                }
            }, {scope: 'email, public_profile'});
        };

        function submitSocialLogin(authResponse) {
            var data = {
                fb : {
                    authToken : authResponse.accessToken
                }
            };

            $http.post('/tokens', data)
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
