/*
 * Simulating wait state
 * ---------------------
 * To simulate network lag, since this should execute pretty quickly, $timeout is used to provide a bit of a delay
 * when calling services to show off wait states.  The reason it's implemented in the controllers rather than the
 * services is that we want to return the promise right away, we'll just delay updating the value until after the timeout.
 */

angular.module( "index", ["ui.bootstrap"] )

	.value( "lightsOnUrl", "/bin/house/lights/on.json" )
	.value( "lightsOffUrl", "/bin/house/lights/off.json" )
	.factory( "LightsService", ["$http", "lightsOffUrl", "lightsOnUrl", function ( $http, lightsOffUrl, lightsOnUrl ) {
		var service = {};

		service.turnOff = function ( room ) {
			return $http( {method: "GET", url: lightsOffUrl, params: {"room": room}} );
		};

		service.turnOn = function ( room ) {
			return $http( {method: "GET", url: lightsOnUrl, params: {"room": room}} );
		};

		return service;
	}] )

	.controller( 'RoomCtrl', ["$scope", "$timeout", "LightsService", function ( $scope, $timeout, LightsService ) {
		$scope.name = $scope.name || "unknown-room"; // this will eventually be re-set by ng-init
		$scope.lights = false; // default to off

		$scope.toggleLights = function () {
			var originalState = $scope.lights,
				newState = !$scope.lights,
				serviceMethod = newState ? LightsService.turnOn : LightsService.turnOff;

			// set the lights state to undefined while we're waiting for a response, we'll use this to affect the view
			// during the transition.
			$scope.lights = undefined;

			serviceMethod( $scope.name )
				.success( function ( data, status, headers, config ) {
					$timeout( function () {
						$scope.lights = data.lights;
					}, 1000 );
				} )
				.error( function ( data, status, headers, config ) {
					$timeout( function () {
						// todo: $emit an error event to handle globally if there's a problem toggling the lights.

						// revert the light setting back to what it was, since we couldn't contact the server.
						$scope.lights = originalState;
					}, 1000 )
				} )
		};
	}] );