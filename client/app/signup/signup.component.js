(function () {
    'use strict';

    angular
        .module('Signup')
        .component('signup', {
            controller: signupCtrl,
            bindings: {},
            templateUrl: '/public/app/signup/signup.html'
        });

    signupCtrl.$inject = ['$http'];

    function signupCtrl($http) {
        var self = this;

        this.signup = function() {
            $http.post('/users', self.data)
                .then(response => {
                        location.href = '/#';
                    },
                    error => {
                        console.error(error);
                    });
        }
    }
} ());
