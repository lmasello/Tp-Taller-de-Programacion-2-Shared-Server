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
