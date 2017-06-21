(function () {
    'use strict';

    angular
        .module('Albums')
        .component('albums', {
            controller: albumsCtrl,
            bindings: {},
            templateUrl: '/public/app/albums/albums.html'
        });

    albumsCtrl.$inject = ['$http'];

    function albumsCtrl($http) {
        var self = this;

        this.$onInit = function () {
            self.show='list';
            this.reloadAlbums();
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
                "duration" : self.newAlbum.duration,
                "artists" : [self.newAlbum.artist]
            };

            $http.post('/albums', body)
                .then(response => {
                    this.reloadAlbums();
                })
                .catch(error => {
                    console.error(error);
                });
        };

        this.editAlbum = function (album) {
            self.show='edit';
            self.albumToEdit = album;
        };
    }
} ());
