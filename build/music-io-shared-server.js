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
        .module('Login', ['angular-jwt', 'facebook', 'Header'])

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
            'Header',
            'ngMaterial'
        ]);

}());
(function(){
    'use strict';

    angular
        .module('Signup', [
            'Header',
            'ngMaterial',
            'ngMessages'
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

    loginCtrl.$inject = ['$http', 'Facebook'];

    function loginCtrl($http, Facebook) {
        var self = this;

        this.submitLogin = function() {
            $http.post('/tokens', self.data)
                .then(response => {
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

        var getFirstName= function() {
            var token = this.getToken();
            return (token == undefined) ? undefined : jwtHelper.decodeToken(token).firstName;
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
            console.log(self.data);
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
