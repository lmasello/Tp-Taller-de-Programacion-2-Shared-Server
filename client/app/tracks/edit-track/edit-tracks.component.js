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
