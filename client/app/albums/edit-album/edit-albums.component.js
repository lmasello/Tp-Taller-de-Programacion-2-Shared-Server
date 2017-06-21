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
