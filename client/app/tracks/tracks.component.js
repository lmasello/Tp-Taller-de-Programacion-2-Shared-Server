(function () {
    'use strict';

    angular
        .module('Tracks')
        .component('tracks', {
            controller: tracksCtrl,
            bindings: {},
            templateUrl: '/public/app/tracks/tracks.html'
        });

    tracksCtrl.$inject = ['$http'];

    function tracksCtrl($http) {
        var self = this;

        this.$onInit = function () {
            self.show='list';
            this.reloadTracks();
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

        this.addTrack = function () {
            var body = {
                "name" : self.newTrack.name,
                "duration" : self.newTrack.duration,
                "artists" : [self.newTrack.artist]
            };

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
