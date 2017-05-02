(function () {
    'use strict';

    angular
        .module('Profile')
        .component('profile', {
            controller: profileCtrl,
            bindings: {},
            templateUrl: '/public/app/profile/profile.html'
        });

    profileCtrl.$inject = ['$http', 'loginUtils'];

    function profileCtrl($http, loginUtils) {
        var self = this;

        this.$onInit = function () {

            if (!loginUtils.isLogged()) {
                location.href = '/#';
            }

            $http.get('/users/me', self.data)
                .then(response => {
                    self.data = {};
                    self.data.userName = response.data.user.userName;
                    self.data.email = response.data.user.email;
                    self.data.firstName = response.data.user.firstName;
                    self.data.lastName = response.data.user.lastName;
                    self.data.birthdate = new Date(response.data.user.birthdate);
                    self.data.country = response.data.user.country;
                })
                .catch(error => {
                    console.error(error);
                });

        };

        this.updateUser = function() {
            $http.put('/users/me', self.data)
                .then(response => {
                    location.href = '/me';
                })
                .catch(error => {
                    console.error(error);
                });
        };

        this.getFirstName = function getFirstName () {
            return self.data.firstName;
        };
    }
} ());
