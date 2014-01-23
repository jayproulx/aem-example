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

var config = require( "automation/automation.config" );

angular.module( "automation", ["ui.bootstrap", "automation.config"] )

	/*
	 * DefaultsService picks up defaults for all rooms and zones.  In a live application, perhaps this is the current
	 * state of the house/business.
	 */
	.factory( "DefaultsService", ["$http", "defaultsUrl", function ( $http, defaultsUrl ) {
		var service = {};

		service.getDefaults = function () {
			return $http( {method: "GET", url: defaultsUrl} );
		};

		return service;
	}] )

	/*
	 * LightsService requests updates from the server when turning on / off lights in differnet rooms.
	 */
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

	/*
	 * TemperatureService allows us to set the temperature for different zones.
	 */
	.factory( "TemperatureService", ["$http", "temperatureSetUrl", function ( $http, temperatureSetUrl ) {
		var service = {};

		service.setTemperature = function ( zone, temperature ) {
			return $http( {method: "GET", url: temperatureSetUrl, params: {"zone": zone, "temperature": temperature}} );
		};

		return service;
	}] )

	/*
	 * AutomationCtrl provides high level functionality for all automation activities, and loads defaults to distribute
	 * to different zones and rooms.
	 */
	.controller( "AutomationCtrl", ["$rootScope", "$scope", "$timeout", "DefaultsService", function ( $rootScope, $scope, $timeout, DefaultsService ) {
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
				$timeout( function () {
					$scope.zones = data.zones;
					$scope.rooms = data.rooms;

					// update each room individually
					for ( var room in $scope.rooms ) {
						$scope.updateRoom( room );
					}

					// update each zone individually
					for ( var zone in $scope.zones ) {
						$scope.updateZone( zone );
					}

					// Once all the defaults have been loaded, broadcast this from the rootScope so that external listeners
					// can pick this up.
					$rootScope.$broadcast( "defaults-loaded", data );
				}, 1000 );
			} )
			.error( function ( data, status, headers, config ) {
				// todo: $emit an error event to handle globally if there's a problem loading the defaults
			} )

		// here we only want to take data from the form and pass it along to the appropriate zone.
		$scope.updateZone = function ( zone ) {
			console.log( "broadcasting update-zone for " + zone );
			$scope.$broadcast( "update-zone", zone, $scope.zones[zone] );
		};

		$scope.persistZone = function ( zone ) {
			console.log( "broadcasting persist-zone for " + zone );
			$scope.$broadcast( "persist-zone", zone, $scope.zones[zone] );
		};

		$scope.updateRoom = function ( room ) {
			console.log( "broadcasting update-room for " + room );
			$scope.$broadcast( "update-room", room, $scope.rooms[room] );
		}
	}] )

	/*
	 * The RoomCtrl provides functionality for managing the view state and persistence for rooms.  Primarily lights and (maybe in the future), curtains.
	 */
	.controller( 'RoomCtrl', ["$rootScope", "$scope", "$timeout", "LightsService", function ( $rootScope, $scope, $timeout, LightsService ) {
		$scope.name = $scope.name || "unknown-room"; // this will eventually be re-set by ng-init
		$scope.lights = false; // default to off

		$scope.$on( "update-room", function ( event, roomName, room ) {
			if ( $scope.name == roomName ) {
				console.log( "on update-room for " + roomName, room )
				$scope.lights = room.lights;

				// once this model has been updated, broadcast this event so that we can pick up these changes from other implementations.
				$rootScope.$broadcast( "room-updated", roomName, room );
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

					// once this model has been updated, broadcast this event so that we can pick up these changes from other implementations.
					$rootScope.$broadcast( "room-updated", $scope.name, {lights: $scope.lights} );
				} )
				.error( function ( data, status, headers, config ) {
					$timeout( function () {
						// broadcast an event so that we can pick up room update errors from elsewhere in a custom implementation
						$rootScope.$broadcast( "room-update-error", $scope.name, {data: data, status: status, headers: headers, config: config} );

						// revert the light setting back to what it was, since we couldn't contact the server.
						$scope.lights = originalState;
					}, 1000 )
				} )
		};
	}] )

	/*
	 * ZoneCtrl manages the temperature (and maybe in the future) fan settings for one or more furnaces / zones that may
	 * be installed in the premises.
	 */
	.controller( 'ZoneCtrl', ["$rootScope", "$scope", "$timeout", "TemperatureService", function ( $rootScope, $scope, $timeout, TemperatureService ) {
		$scope.name = $scope.name || "unknown-zone";
		$scope.temperature = 20;

		$scope.$on( "update-zone", function ( event, zoneName, zone ) {
			if ( $scope.name == zoneName ) {
				console.log( "on update-zone for " + zoneName, zone )
				$scope.temperature = zone.temperature;

				// once this model has been updated, broadcast this event so that we can pick up these changes from other implementations.
				$rootScope.$broadcast( "zone-updated", zoneName, {temperature: zone.temperature} );

			}
		} );

		$scope.$on( "persist-zone", function ( event, zoneName, zone ) {
			if ( $scope.name == zoneName ) {
				console.log( "on update-zone for " + zoneName, zone )
				$scope.setTemperature( zone.temperature );
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

					// once this model has been updated, broadcast this event so that we can pick up these changes from other implementations.
					$rootScope.$broadcast( "zone-updated", $scope.name, {temperature: temperature} );
				} )
				.error( function ( data, status, headers, config ) {
					// broadcast an event so that we can pick up room update errors from elsewhere in a custom implementation
					$rootScope.$broadcast( "zone-update-error", $scope.name, {data: data, status: status, headers: headers, config: config} );

					// reset the value back to the original temperature, since we had an error from the service
					$scope.temperature = originalTemperature;
				} );
		}
	}] );