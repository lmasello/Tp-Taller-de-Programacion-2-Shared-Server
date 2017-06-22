(function(){
    'use strict';

    angular
        .module('Albums', [
            'Header',
            'Login',
            'EditAlbum',
            'angularjs-dropdown-multiselect'
        ]);

}());
(function(){
    'use strict';

    angular
        .module('EditAlbum', [
        ]);

}());
(function(){
    'use strict';

    angular
        .module('Artists', [
            'Header',
            'Login',
            'EditArtist'
        ]);

}());
(function(){
    'use strict';

    angular
        .module('EditArtist', []);

}());
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
(function(){
    'use strict';

    angular
        .module('EditTrack', [
        ]);

}());
(function(){
    'use strict';

    angular
        .module('Tracks', [
            'Header',
            'Login',
            'EditTrack',
            'angularjs-dropdown-multiselect'
        ]);

}());
(function () {
    'use strict';

    angular
        .module('Albums')
        .component('albums', {
            controller: albumsCtrl,
            bindings: {},
            templateUrl: '/public/app/albums/albums.html'
        });

    albumsCtrl.$inject = ['$http', '$scope'];

    function albumsCtrl($http, $scope) {
        var self = this;

        this.$onInit = function () {
            self.show='list';
            $scope.artistSettings = {enableSearch: true, styleActive: true };
            $scope.artistModel = [];
            $scope.translations = {
                checkAll: "Seleccionar todos los artistas",
                uncheckAll: "Deseleccionar todos los artistas",
                searchPlaceholder: "Buscar artista",
                dynamicButtonTextSuffix: "artistas seleccionado",
                buttonDefaultText: "Buscar artistas"
            };
            this.reloadAlbums();
            this.findArtists();
        };

        this.reloadAlbums = function () {
            self.loaded = false;
            $http.get('/albums', self.data)
                .then(response => {
                    self.loaded = true;
                    self.albums = response.data.albums;
                })
                .catch(error => {
                    console.error(error);
                });
        };

        this.addAlbum = function () {
            var body = {
                "name" : self.newAlbum.name,
                "genres" : [self.newAlbum.genre],
                "release_date" : self.newAlbum.release_date.toISOString().slice(0, 10),
                "artists" : $scope.artistModel.map(artist => artist.id)
            };
            $http.post('/albums', body)
                .then(response => {
                    this.reloadAlbums();
                })
                .catch(error => {
                    console.error(error);
                });
        };

        this.findArtists = function () {
            $http.get('/artists', self.data)
                .then(response => {
                    $scope.artistData = response.data.artists.map(convertArtist);
                })
                .catch(error => {
                    console.error(error);
                });
        };

        function convertArtist(artist) {
            return {
                id: artist.id,
                label: artist.name
            }
        }

        this.editAlbum = function (album) {
            self.show='edit';
            self.albumToEdit = album;
        };

        this.deleteAlbum = function (album) {
            $http.delete('/albums/' + album.id)
                .then(response => {
                    this.reloadAlbums();
                })
                .catch(error => {
                    console.error(error);
                });
        };
    }
} ());

(function () {
    'use strict';

    angular
        .module('EditAlbum')
        .component('editAlbum', {
            controller: editAlbumsCtrl,
            bindings: {
                album:'<'
            },
            templateUrl: '/public/app/albums/edit-album/edit-albums.html'
        });

    editAlbumsCtrl.$inject = ['$http'];

    function editAlbumsCtrl($http) {
        var self = this;

        this.$onInit = function () {
            self.album.release_date = new Date(self.album.release_date);
        };

        this.editAlbum = function () {
            var uri = '/albums/' + self.album.id;
            $http.put(uri, self.album)
                .then(response => {
                    location.href = '/album';
                })
                .catch(error => {
                    console.error(error);
                });

        };
    }
} ());

(function () {
    'use strict';

    angular
        .module('Artists')
        .component('artists', {
            controller: artistsCtrl,
            bindings: {},
            templateUrl: '/public/app/artists/artists.html'
        });

    artistsCtrl.$inject = ['$http'];

    function artistsCtrl($http) {
        var self = this;

        this.$onInit = function () {
            self.show='list';
            this.reloadArtists();
        };

        this.reloadArtists = function () {
            self.loaded = false;
            $http.get('/artists')
                .then(response => {
                    self.loaded = true;
                    self.artists = response.data.artists;
                })
                .catch(error => {
                    console.error(error);
                });
        };

        this.addArtist = function () {
            var body = {
                "name" : self.newArtist.name,
                "description" : self.newArtist.duration,
                "genres" : [self.newArtist.genre]
            };

            $http.post('/artists', body)
                .then(response => {
                    this.reloadArtists();
                })
                .catch(error => {
                    console.error(error);
                });
        };

        this.editArtist = function (artist) {
            self.show='edit';
            self.artistToEdit = artist;
        };

        this.deleteArtist = function (artist) {
            $http.delete('/artists/' + artist.id)
                .then(response => {
                    this.reloadArtists();
                })
                .catch(error => {
                    console.error(error);
                });
        };
    }
} ());

(function () {
    'use strict';

    angular
        .module('EditArtist')
        .component('editArtist', {
            controller: editArtistCtrl,
            bindings: {
                artist:'<'
            },
            templateUrl: '/public/app/artists/edit-artist/edit-artists.html'
        });

    editArtistCtrl.$inject = ['$http'];

    function editArtistCtrl($http) {
        var self = this;

        this.$onInit = function () {
            console.log(self.artist);
        };

        this.editArtist = function () {
            var uri = '/artists/' + self.artist.id;
            $http.put(uri, self.artist)
                .then(response => {
                    location.href = '/artistas';
                })
                .catch(error => {
                    console.error(error);
                });

        };
    }
} ());

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

        this.tracks = function tracks() {
            location.href = '/canciones';
        };

        this.artists = function artists() {
            location.href = '/artistas';
        };

        this.albums = function albums() {
            location.href = '/album';
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

(function () {
    'use strict';

    angular
        .module('EditTrack')
        .component('editTrack', {
            controller: editTrackCtrl,
            bindings: {
                track:'<'
            },
            templateUrl: '/public/app/tracks/edit-track/edit-tracks.html'
        });

    editTrackCtrl.$inject = ['$http'];

    function editTrackCtrl($http) {
        var self = this;

        this.$onInit = function () {
            self.track.artists = undefined;
        };

        this.editTrack = function () {
            var uri = '/tracks/' + self.track.id;
            $http.put(uri, self.track)
                .then(response => {
                    location.href = '/canciones';
                })
                .catch(error => {
                    console.error(error);
                });

        };
    }
} ());

(function () {
    'use strict';

    angular
        .module('Tracks')
        .component('tracks', {
            controller: tracksCtrl,
            bindings: {},
            templateUrl: '/public/app/tracks/tracks.html'
        });

    tracksCtrl.$inject = ['$http', '$scope'];

    function tracksCtrl($http, $scope) {
        var self = this;

        this.$onInit = function () {
            $scope.artistSettings = {enableSearch: true, styleActive: true };
            $scope.artistModel = [];
            $scope.translations = {
                checkAll: "Seleccionar todos los artistas",
                uncheckAll: "Deseleccionar todos los artistas",
                searchPlaceholder: "Buscar artista",
                dynamicButtonTextSuffix: "artistas seleccionado",
                buttonDefaultText: "Buscar artistas"
            };

            self.show='list';
            this.reloadTracks();
            this.findArtists();
        };

        this.reloadTracks = function () {
            self.loaded = false;
            $http.get('/tracks', self.data)
                .then(response => {
                    self.loaded = true;
                    self.tracks = response.data.tracks;
                })
                .catch(error => {
                    console.error(error);
                });
        };

        function convertArtist(artist) {
            return {
                id: artist.id,
                label: artist.name
            }
        }

        this.findArtists = function () {
            $http.get('/artists', self.data)
                .then(response => {
                    $scope.artistData = response.data.artists.map(convertArtist);
                })
                .catch(error => {
                    console.error(error);
                });
        };

        this.deleteTrack = function (track) {
            $http.delete('/tracks/' + track.id)
                .then(response => {
                    this.reloadTracks();
                })
                .catch(error => {
                    console.error(error);
                });
        };

        this.editTrack = function (track) {
            self.show='edit';
            self.trackToEdit = track;
        };

        this.addTrack = function () {
            var body = {
                "name" : self.newTrack.name,
                "duration" : self.newTrack.duration,
                "artists" : $scope.artistModel.map(artist => artist.id)
            };
            $http.post('/tracks', body)
                .then(response => {
                    this.reloadTracks();
                })
                .catch(error => {
                    console.error(error);
                });
        };
    }
} ());
