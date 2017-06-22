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

            var genres = [self.newArtist.genre];
            var body = {
                "name" : self.newArtist.name,
                "description" : self.newArtist.description,
                "genres" : JSON.stringify(genres),
                "images" : [self.newArtist.image]
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
