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
