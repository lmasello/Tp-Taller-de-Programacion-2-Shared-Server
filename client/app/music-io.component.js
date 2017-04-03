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

		function isLogged() {
			return true;
			//return loginUtils.isLogged();
		}

	}

} ());
