/*
 * API Events
 * ----------
 *
 * Events Dispatched:
 *
 * defaults-loaded: function(event, data) {}
 * defaults-load-error: function(event, connectionData) {}
 * room-updated: function(event, roomName, roomObj) {}
 * room-update-error: function(event, roomName, connectionData) {}
 * zone-updated: function(event, zoneName, zoneObj) {}
 * zone-update-error: function(event, zoneName, connectionData) {}
 *
 * Events Handled:
 *
 * load-defaults: arguments: none
 * update-room: arguments: roomName, roomObj
 * update-zone: arguments: zoneName: zoneObj
 *
 * Examples:
 * Update a room:
 * $(document).trigger("update-room", ["queens-bedroom", {lights: false, curtains: false}]);
 *
 * Update a zone:
 * $(document).trigger("update-zone", ["east-wing", {temperature: 25, fan: false}]);
 *
 */

var controllers = require( "automation/controllers" ),
	directives = require( "automation/directives" ),
	adapter = require("automation/adapter");

module.exports = angular.module( "automation", ["ui.bootstrap", "automation.controllers", "automation.directives", "automation.adapter"] );