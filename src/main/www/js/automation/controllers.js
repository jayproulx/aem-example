/*
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
	.controller( "AutomationCtrl", ["$rootScope", "$scope", "DefaultsService", function ( $rootScope, $scope, DefaultsService ) {
		$scope.rooms = {};
		$scope.zones = {};

		$scope.temperatures = [ // [15,16,17,18,19,20,21,22,23,24,25];
			{"label": "15\u00B0C", "value": 15},
			{"label": "16\u00B0C", "value": 16},
			{"label": "17\u00B0C", "value": 17},
			{"label": "18\u00B0C", "value": 18},
			{"label": "19\u00B0C", "value": 19},
			{"label": "20\u00B0C", "value": 20},
			{"label": "21\u00B0C", "value": 21},
			{"label": "22\u00B0C", "value": 22},
			{"label": "23\u00B0C", "value": 23},
			{"label": "24\u00B0C", "value": 24},
			{"label": "25\u00B0C", "value": 25}
		];

		$scope.loadDefaults = function () {
			DefaultsService.getDefaults()
				.success( function ( data, status, headers, config ) {
					var room, zone;
					$scope.zones = data.zones;
					$scope.rooms = data.rooms;

					$rootScope.$broadcast( "defaults-loaded", data );

					// update each room individually
					for ( room in $scope.rooms ) {
						if ( $scope.rooms.hasOwnProperty( room ) ) {
							$scope.updateRoom( room, true );
						}
					}

					// update each zone individually
					for ( zone in $scope.zones ) {
						if ( $scope.zones.hasOwnProperty( zone ) ) {
							$scope.updateZone( zone, true );
						}
					}
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
	 * The RoomCtrl provides functionality for managing the view state and persistence for rooms.  Primarily lights and
	 * (maybe in the future), curtains.  The view knows which room this controller should be bound to, we need to wait
	 * for ng-init to tell us which room that is.
	 */
	.controller( 'RoomCtrl', ["$element", "$rootScope", "$scope", "RoomService", function ( $element, $rootScope, $scope, RoomService ) {
		var undefinedName = "unknown-room";
		$scope.name = $scope.name || $element.attr("id"); // this will eventually be re-set by ng-init
		$scope.room = {
			lights: false, // default to off
			curtains: false
		};

		// it's possible that AutomationCtrl has loaded data before the controller has initialized, so check to see
		// if there's data already available;
		if(!$scope.initialized && $scope.rooms && $scope.rooms[$scope.name]) {
			$scope.room = $scope.rooms[$scope.name];
			$scope.initialized = true;
		}

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
					// for this demo, we're not actually setting it to the response, we want to use the data passed in
					$scope.room.lights = room.lights;

					// once this model has been updated, broadcast this event so that we can pick up these changes from other implementations.
					$rootScope.$broadcast( "room-updated", roomName, room );
				} )
				.error( function ( data, status, headers, config ) {
					// broadcast an event so that we can pick up room update errors from elsewhere in a custom implementation
					$rootScope.$broadcast( "room-update-error", roomName, {data: data, status: status, headers: headers, config: config} );

					// revert the light setting back to what it was, since we couldn't contact the server.
					$scope.room = originalRoom;
				} );
		};
	}] )

	/*
	 * ZoneCtrl manages the temperature and (maybe in the future) fan settings for one or more furnaces / zones that may
	 * be installed in the premises.
	 */
	.controller( 'ZoneCtrl', ["$element", "$rootScope", "$scope", "ZoneService", function ( $element, $rootScope, $scope, ZoneService ) {
		$scope.name = $scope.name || $element.attr("id");
		$scope.zone = {
			fan: false,
			temperature: 20
		};

		// it's possible that AutomationCtrl has loaded data before the controller has initialized, so check to see
		// if there's data already available;
		if(!$scope.initialized && $scope.zones && $scope.zones[$scope.name]) {
			$scope.zone = $scope.zones[$scope.name];
			$scope.initialized = true;
		}

		// dontPersist is only necessary when loading defaults, we want to update the view without making a call to the server
		$scope.$on( "update-zone", function ( event, zoneName, zone, dontPersist ) {
			if ( $scope.name == zoneName ) {

				if ( dontPersist ) {
					$scope.zone = zone;

					// once this model has been updated, broadcast this event so that we can pick up these changes from other implementations.
					$rootScope.$broadcast( "zone-updated", zoneName, $scope.zone );
				}
				else {
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