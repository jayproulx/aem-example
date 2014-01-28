// Provide a jQuery friendly adapter for our automation events.
// This way, we can have a consumer that isn't aware of AngularJS listen for and dispatch events using document
module.exports = angular.module( "automation.adapter", [] )
	.run( ["$rootScope", "$document", function ( $rootScope, $document ) {

		// take event data from an angular event and send it to jQuery
		var relay = function ( event ) {
			var args = Array.prototype.slice.call( arguments, 1 );

			$document.trigger( event.name, args );
		};

		// take event data from a jQuery event and broadcast it to the child scopes
		var dispatch = function ( event ) {
			var args = Array.prototype.slice.call( arguments, 1 );

			// push the event type on to the beginning of the array
			args.unshift( event.type );

			$rootScope.$broadcast.apply( $rootScope, args );
		};

		// --- listen for these events on the document to dispatch to the automation api ---

		$document.on( "load-defaults", function ( event ) {
			dispatch( event );
		} );

		$document.on( "update-room", function ( event, roomName, room ) {
			dispatch( event, roomName, room );
		} );

		$document.on( "update-zone", function ( event, zoneName, zone ) {
			dispatch( event, zoneName, zone );
		} );

		// --- listen for these events from the automation api and relay them to jQuery's document object ---

		$rootScope.$on( "defaults-loaded", function ( event, data ) {
			relay( event, data );
		} );

		$rootScope.$on( "defaults-load-error", function ( event, data ) {
			relay( event, data );
		} );

		$rootScope.$on( "room-updated", function ( event, roomName, data ) {
			relay( event, roomName, data );
		} );

		$rootScope.$on( "room-update-error", function ( event, roomName, data ) {
			relay( event, roomName, data );
		} );

		$rootScope.$on( "zone-updated", function ( event, zoneName, data ) {
			relay( event, zoneName, data );
		} );

		$rootScope.$on( "zone-update-error", function ( event, zoneName, data ) {
			relay( event, zoneName, data );
		} );

	}] );