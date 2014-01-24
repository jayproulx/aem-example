;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module( "index", ["automation"] )

	/*
	 * APICtrl is an example of how we might pick up broadcast events from inside the automation implementation and react to those changes.
	 */
	.controller( "APICtrl", ["$rootScope", "$scope", function ( $rootScope, $scope ) {
		$scope.messages = [];

		$rootScope.$on( "defaults-loaded", function ( event, data ) {
			$scope.messages.push( new Date() + ": " + event.name + " fired" );
		} );

		$rootScope.$on( "room-updated", function ( event, roomName, data ) {
			$scope.messages.push( new Date() + ": " + event.name + " fired for room " + roomName );
		} );

		$rootScope.$on( "room-update-error", function ( event, roomName, data ) {
			$scope.messages.push( new Date() + ": " + event.name + " fired for room " + roomName );
		} );

		$rootScope.$on( "zone-updated", function ( event, zoneName, data ) {
			$scope.messages.push( new Date() + ": " + event.name + " fired for zone " + zoneName );
		} );

		$rootScope.$on( "zone-update-error", function ( event, zoneName, data ) {
			$scope.messages.push( new Date() + ": " + event.name + " fired for zone " + zoneName );
		} );
	}] )

	/*
	 * The SVG Floorplan will vary it's height when the window resizes if the height is not set explicitly.  These helpers
	 * are a bit kludgy and this is probably best left to a directive instead. However, it's 11pm and this solves the current
	 * problem :)
	 */
	.controller( "FloorplanCtrl", ["$window", "$scope", function ( $window, $scope ) {
		$scope.lastHeight = undefined;

		$window.onresize = function () {
			$scope.resizeFloorplan();
		}

		$scope.resizeFloorplan = function () {
			var floorplan = document.getElementById( "floorplan" ),
				h = (floorplan.offsetWidth * 0.6) + "px";

			if(h == $scope.lastHeight) return;

			floorplan.style.height = h;
			$scope.lastHeight = h;
		}
	}] )
;
},{}]},{},[1])
;