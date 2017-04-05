(function () {
	'use strict';

	angular
		.module('Music-io')
		.component('main', {
			controller: musicCtrl,
			bindings: {},
			templateUrl: '/public/app/music-io.html'
		});


	musicCtrl.$inject = ['$scope', 'loginUtils'];
	
	function musicCtrl($scope, loginUtils) {
		var self = this;

		this.isLogged = function isLogged() {
			return loginUtils.isLogged();
		};

		this.login = function login() {
			location.href = '/login';
		};

		this.signUp = function signUp() {
			location.href = '/signup	';
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
