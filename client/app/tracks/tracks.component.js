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
            $scope.artistSettings = {enableSearch: true };
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

        this.addTrack = function () {
            var body = {
                "name" : self.newTrack.name,
                "duration" : self.newTrack.duration,
                "artists" : $scope.artistModel.map(artist => artist.id)
            };

            console.log(body);

            $http.post('/tracks', body)
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
    }
} ());
