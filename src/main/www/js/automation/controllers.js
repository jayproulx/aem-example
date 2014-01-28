/*
 * Simulating wait state
 * ---------------------
 * To simulate network lag, since this should execute pretty quickly, $timeout is used to provide a bit of a delay
 * when calling services to show off wait states.  The reason it's implemented in the controllers rather than the
 * services is that we want to return the promise right away, we'll just delay updating the value until after the timeout.
 *
 * On "dontPersist"
 * ----------------
 * We want the default value to be negative (i.e. persist all the time, unless we say otherwise), so in order to preserve
 * that connotation, we use a negatively named variable.  This isn't a documented parameter, since anyone using the API
 * externally should send the value to the server as normal.  Internally we want to avoid sending data to the server.
 */

var services = require( "automation/services" );

module.exports = angular.module( "automation.controllers", ["automation.services"] )

	/*
	 * AutomationCtrl provides high level functionality for all automation activities, and loads defaults to distribute
	 * to different zones and rooms.
	 */
	.controller( "AutomationCtrl", ["$rootScope", "$scope", "$timeout", "DefaultsService", function ( $rootScope, $scope, $timeout, DefaultsService ) {
		"use strict";

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

		$scope.loadDefaults = function () {
			DefaultsService.getDefaults()
				.success( function ( data, status, headers, config ) {
					$timeout( function () {
						var room, zone;
						$scope.zones = data.zones;
						$scope.rooms = data.rooms;

						$rootScope.$broadcast( "defaults-loaded", data );

						// update each room individually
						for ( room in $scope.rooms ) {
							$scope.updateRoom( room, true );
						}

						// update each zone individually
						for ( zone in $scope.zones ) {
							$scope.updateZone( zone, true );
						}
					}, 1000 );
				} )
				.error( function ( data, status, headers, config ) {
					// broadcast an event so that we can pick up room update errors from elsewhere in a custom implementation
					$rootScope.$broadcast( "defaults-load-error", {data: data, status: status, headers: headers, config: config} );
				} );
		};

		// load defaults right away to populate the views
		$scope.loadDefaults();

		$scope.$on( "load-defaults", function () {
			$scope.loadDefaults();
		} );

		$scope.updateZone = function ( zone, dontPersist ) {
			$scope.$broadcast( "update-zone", zone, $scope.zones[zone], dontPersist );
		};

		$scope.updateRoom = function ( room, dontPersist ) {
			$scope.$broadcast( "update-room", room, $scope.rooms[room], dontPersist );
		};
	}] )

	/*
	 * The RoomCtrl provides functionality for managing the view state and persistence for rooms.  Primarily lights and (maybe in the future), curtains.
	 */
	.controller( 'RoomCtrl', ["$rootScope", "$scope", "$timeout", "RoomService", function ( $rootScope, $scope, $timeout, RoomService ) {
		$scope.name = $scope.name || "unknown-room"; // this will eventually be re-set by ng-init
		$scope.room = {
			lights: false, // default to off
			curtains: false
		};

		$scope.toggleLights = function () {
			var room = Object.create( $scope.room );
			room.lights = !room.lights;

			$scope.setRoom( $scope.name, room );
		};

		// dontPersist is only necessary when loading defaults, we want to update the view without making a call to the server
		$scope.$on( "update-room", function ( event, roomName, room, dontPersist ) {
			if ( $scope.name === roomName ) {

				if ( dontPersist ) {
					$scope.room = room;

					// once this model has been updated, broadcast this event so that we can pick up these changes from other implementations.
					$rootScope.$broadcast( "room-updated", roomName, room );
				}
				else {
					$scope.setRoom( roomName, room );
				}
			}
		} );

		$scope.setRoom = function ( roomName, room ) {
			var originalRoom = $scope.room;

			// set the lights state to undefined while we're waiting for a response, we'll use this to affect the view
			// during the transition.
			$scope.room.lights = undefined;

			RoomService.setRoom( roomName, room )
				.success( function ( data, status, headers, config ) {
					$timeout( function () {
						// for this demo, we're not actually setting it to the response, we want to use the data passed in
						$scope.room.lights = room.lights;

					}, 1000 );

					// once this model has been updated, broadcast this event so that we can pick up these changes from other implementations.
					$rootScope.$broadcast( "room-updated", roomName, room );
				} )
				.error( function ( data, status, headers, config ) {
					$timeout( function () {
						// broadcast an event so that we can pick up room update errors from elsewhere in a custom implementation
						$rootScope.$broadcast( "room-update-error", roomName, {data: data, status: status, headers: headers, config: config} );

						// revert the light setting back to what it was, since we couldn't contact the server.
						$scope.room = originalRoom;
					}, 1000 );
				} );
		};
	}] )

	/*
	 * ZoneCtrl manages the temperature and (maybe in the future) fan settings for one or more furnaces / zones that may
	 * be installed in the premises.
	 */
	.controller( 'ZoneCtrl', ["$rootScope", "$scope", "$timeout", "ZoneService", function ( $rootScope, $scope, $timeout, ZoneService ) {
		$scope.name = $scope.name || "unknown-zone";
		$scope.zone = {
			fan: false,
			temperature: 20
		};

		// dontPersist is only necessary when loading defaults, we want to update the view without making a call to the server
		$scope.$on( "update-zone", function ( event, zoneName, zone, dontPersist ) {
			if ( $scope.name == zoneName ) {

				if ( dontPersist ) {
					$scope.zone = zone;

					// once this model has been updated, broadcast this event so that we can pick up these changes from other implementations.
					$rootScope.$broadcast( "zone-updated", zoneName, $scope.zone );
				}
				else
				{
					$scope.updateZone( zone );
				}
			}
		} );

		$scope.updateZone = function ( zone ) {
			var originalZone = $scope.zone;

			// todo: for a nice CSS transition, we can use a temperature half way between the original value and the new value

			ZoneService.setZone( $scope.name, zone )
				.success( function ( data, status, headers, config ) {
					// normally we'd want to set this to the value of the response from the server,
					// however, this is a static example, so we'll use what the user set in the UI.
					$scope.zone = zone;

					// once this model has been updated, broadcast this event so that we can pick up these changes from other implementations.
					$rootScope.$broadcast( "zone-updated", $scope.name, $scope.zone );
				} )
				.error( function ( data, status, headers, config ) {
					// broadcast an event so that we can pick up room update errors from elsewhere in a custom implementation
					$rootScope.$broadcast( "zone-update-error", $scope.name, {data: data, status: status, headers: headers, config: config} );

					// reset the value back to the original value, since we had an error from the service
					$scope.zone = originalZone;
				} );
		};
	}] );