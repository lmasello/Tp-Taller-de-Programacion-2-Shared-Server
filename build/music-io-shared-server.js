(function(){
    'use strict';

    angular
        .module('Header', [
            'Login'
        ]);

}());
(function(){
    'use strict';

    angular
        .module('Login', ['angular-jwt', 'facebook', 'Header', 'ngCookies'])

        .config(['FacebookProvider', function(FacebookProvider) {
            // Setting application id for music-io
            FacebookProvider.init('444061072611756');
        }])
        .config(JwtInterceptorConfig);


    JwtInterceptorConfig.$inject = ['$httpProvider'];

    function JwtInterceptorConfig ($httpProvider, $q) {
        $httpProvider.interceptors.push(['$q', function($q) {
            return {
                request: function(config) {
                    var token = localStorage.getItem('id_token');
                    if (token) {
                        config.headers['Authorization'] = 'Bearer ' + token;
                    }
                    return config;
                }
            };
        }]);
    };

}());
(function(){
    'use strict';

    angular
        .module('Music-io', [
            'Header'
        ]);

}());
(function(){
    'use strict';

    angular
        .module('Profile', [
            'Header',
            'Login'
        ]);

}());
(function(){
    'use strict';

    angular
        .module('Signup', [
            'Header'
        ]);

}());
(function () {
    'use strict';

    angular
        .module('Header')
        .component('musicHeader', {
            controller: headerCtrl,
            bindings: {},
            templateUrl: '/public/app/header/header.html'
        });


    headerCtrl.$inject = ['$scope', 'loginUtils'];

    function headerCtrl($scope, loginUtils) {
        var self = this;

        this.isLogged = function isLogged() {
            return loginUtils.isLogged();
        };

        this.login = function login() {
            location.href = '/login';
        };

        this.home = function home() {
            location.href = '/';
        };

        this.profile = function home() {
            location.href = '/me';
        };

        this.signUp = function signUp() {
            location.href = '/signup';
        };

        this.logout = function logout() {
            loginUtils.logout();
            location.reload();
        };

        this.getFirstName = function getFirstName () {
            return loginUtils.getFirstName();
        };
    }

} ());

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

(function () {
    'use strict';

    angular
        .module('Login')
        .service('loginUtils', loginUtils);

    loginUtils.$inject = ['jwtHelper', '$cookies'];
    function loginUtils(jwtHelper, $cookies) {

        var getToken = function () {
            return $cookies.get('id_token');
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

        var getFirstName= function() {
            var token = this.getToken();
            return (token == undefined) ? undefined : jwtHelper.decodeToken(token).firstName;
        };

        var logout= function() {
            $cookies.remove('id_token');
            localStorage.removeItem('profile');
        };

        return {
            getToken: getToken,
            getRoles: getRoles,
            isTokenExpired: isTokenExpired,
            hasRole: hasRole,
            getProfile: getProfile,
            getUserId: getUserId,
            getFirstName: getFirstName,
            logout: logout,
            isLogged: isLogged
        };

    }

})();

(function () {
	'use strict';

	angular
		.module('Music-io')
		.component('main', {
			controller: musicCtrl,
			bindings: {},
			templateUrl: '/public/app/music-io.html'
		});


	musicCtrl.$inject = ['$scope'];
	
	function musicCtrl($scope) {
		var self = this;
	}

} ());

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

            self.loaded = false;

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
                    self.loaded = true;
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
