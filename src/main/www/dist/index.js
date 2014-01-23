require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"NVYujn":[function(require,module,exports){
/*
 * Simulating wait state
 * ---------------------
 * To simulate network lag, since this should execute pretty quickly, $timeout is used to provide a bit of a delay
 * when calling services to show off wait states.  The reason it's implemented in the controllers rather than the
 * services is that we want to return the promise right away, we'll just delay updating the value until after the timeout.
 *
 * Using Values
 * ------------
 * The values defined here can be fairly easily extracted into a new module to be configured either by loading a file
 * from the server, or simply loading pre-defined angular modules for different environments.
 */

angular.module( "index", ["ui.bootstrap"] )

	.value( "defaultsUrl", "/bin/house/defaults.json" )
	.value( "lightsOnUrl", "/bin/house/lights/on.json" )
	.value( "lightsOffUrl", "/bin/house/lights/off.json" )
	.value( "temperatureSetUrl", "/bin/house/temperature/set.json" )

	.factory( "DefaultsService", ["$http", "defaultsUrl", function ( $http, defaultsUrl ) {
		var service = {};

		service.getDefaults = function () {
			return $http( {method: "GET", url: defaultsUrl} );
		};

		return service;
	}] )

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

	.factory( "TemperatureService", ["$http", "temperatureSetUrl", function ( $http, temperatureSetUrl ) {
		var service = {};

		service.setTemperature = function ( zone, temperature ) {
			return $http( {method: "GET", url: temperatureSetUrl, params: {"zone": zone, "temperature": temperature}} );
		};

		return service;
	}] )

	.controller( "AutomationCtrl", ["$scope", "$timeout", "DefaultsService", function ( $scope, $timeout, DefaultsService ) {
		$scope.temperatures = [ // [15,16,17,18,19,20,21,22,23,24,25];
			{"label": "15°C", "value": 15},
			{"label": "16°C", "value": 16},
			{"label": "17°C", "value": 17},
			{"label": "18°C", "value": 18},
			{"label": "19°C", "value": 19},
			{"label": "20°C", "value": 20},
			{"label": "21°C", "value": 21},
			{"label": "22°C", "value": 22},
			{"label": "23°C", "value": 23},
			{"label": "24°C", "value": 24},
			{"label": "25°C", "value": 25}
		];

		DefaultsService.getDefaults()
			.success( function ( data, status, headers, config ) {
				$timeout(function() {
					$scope.zones = data.zones;
					$scope.rooms = data.rooms;

					for ( var room in $scope.rooms ) {
						$scope.updateRoom( room );
					}

					for ( var zone in $scope.zones ) {
						$scope.updateZone( zone );
					}
				}, 1000);
			} )
			.error( function ( data, status, headers, config ) {
				// todo: $emit an error event to handle globally if there's a problem loading the defaults
			} )

		// here we only want to take data from the form and pass it along to the
		$scope.updateZone = function ( zone ) {
			console.log("broadcasting update-zone for " + zone);
			$scope.$broadcast( "update-zone", zone, $scope.zones[zone] );
		};

		$scope.updateRoom = function ( room ) {
			console.log("broadcasting update-room for " + room);
			$scope.$broadcast( "update-room", room, $scope.rooms[room] );
		}
	}] )

	.controller( 'RoomCtrl', ["$scope", "$timeout", "LightsService", function ( $scope, $timeout, LightsService ) {
		$scope.name = $scope.name || "unknown-room"; // this will eventually be re-set by ng-init
		$scope.lights = false; // default to off

		$scope.$on( "update-room", function ( event, roomName, room ) {
			if ( $scope.name == roomName ) {
				console.log("on update-room for " + roomName, room)
				$scope.lights = room.lights;
			}
		} );

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
	}] )

	// ideally this will be renamed to ZoneViewCtrl, since we only really want to represent the model on the floor plan,
	// we should have a parent controller elsewhere that can take care of setting the temperature.
	.controller( 'ZoneCtrl', ["$scope", "$timeout", "TemperatureService", function ( $scope, $timeout, TemperatureService ) {
		$scope.name = $scope.name || "unknown-zone";
		$scope.temperature = 20;

		$scope.$on( "update-zone", function ( event, zoneName, zone ) {
			if ( $scope.name == zoneName ) {
				console.log("on update-zone for " + zoneName, zone)
				$scope.temperature = zone.temperature;
			}
		} );

		$scope.setTemperature = function ( temperature ) {
			var originalTemperature = $scope.temperature;

			// todo: for a nice CSS transition, we can use a temperature half way between the original value and the new value

			TemperatureService.setTemperature( $scope.name, temperature )
				.success( function ( data, status, headers, config ) {
					// normally we'd want to set this to the value of the response from the server,
					// however, this is a static example, so we'll use what the user set in the UI.
					$scope.temperature = temperature;
					$scope.$apply();

				} )
				.error( function ( data, status, headers, config ) {
					// todo: $emit an error event to handle globally if there's a problem setting the temperature

					// reset the value back to the original temperature, since we had an error from the service
					$scope.temperature = originalTemperature;
					$scope.$apply();
				} );

		}
	}] );
},{}],"index/index":[function(require,module,exports){
module.exports=require('NVYujn');
},{}]},{},["NVYujn"])
;