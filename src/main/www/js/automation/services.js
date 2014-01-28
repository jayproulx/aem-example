var config = require( "automation/config" );

module.exports = angular.module( "automation.services", ["automation.config"] )

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
	 * RoomService allows us to update the record for a room
	 */
	.factory( "RoomService", ["$http", "roomSetUrl", function ( $http, roomSetUrl ) {
		var service = {};

		service.setRoom = function ( room, roomObj ) {
			// Normally we'd want to use POST or PUT, but for this static example, we'll just use get.
			return $http( {method: "GET", url: roomSetUrl, params: {"name": room, "lights": roomObj.lights, "curtains": roomObj.curtains}} );
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
	 * ZoneService allows us to update the record for a zone
	 */
	.factory( "ZoneService", ["$http", "zoneSetUrl", function ( $http, zoneSetUrl ) {
		var service = {};

		service.setZone = function ( zone, zoneObj ) {
			// Normally we'd want to use POST or PUT, but for this static example, we'll just use get.
			return $http( {method: "GET", url: zoneSetUrl, params: {"name": zone, "temperature": zoneObj.temperature, "fan": zoneObj.fan}} );
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
	}] );