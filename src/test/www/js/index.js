/**
 * We aren't testing the application entry point here, that's a bit challenging, and somewhat unnecessary.  We will
 * however test the index dependencies (src/main/www/js/index/*.js)
 *
 * With an application architected with appropriate separation of concerns, we can test business logic without testing
 * rendering logic.  However, in order to provide unit testing for this jQuery example, the only available code to test is
 * mediator code which directly affects the view.  Strictly separating view from control and model (as we do in AngularJS)
 * gives us a much better foundation to test against.
 *
 * Building UI's with jQuery unfortunately ties the controller to the view (and it's structure) so tightly that it's easy
 * to break.
 */

var APIConsumer = require( "index/APIConsumer" );

describe( 'APIConsumer', function () {
	var consumer;

	// You could test the automation submodule implementation here, but we'll avoid that in favour of testing automation
	// directly in automation.js
	// beforeEach( angular.mock.module( 'index' ) );

	beforeEach( function () {
		var $consumer = affix( "#modalAPIConsumer" );
		$consumer.affix( ".all-zones" );
		$consumer.affix( ".all-rooms" );

		var $idRoomTmpl = affix( "script#room-template" ),
			$roomTmpl = $idRoomTmpl.affix( ".room-template" );
		$roomTmpl.affix( ".room-name" );
		$roomTmpl.affix( ".btn.lights" );

		var $idZoneTmpl = affix( "script#zone-template" ),
			$zoneTmpl = $idZoneTmpl.affix( ".zone-template" );
		$zoneTmpl.affix( ".zone-name" );
		// provide the one anchor tag that we'll match below for the test zone
		$zoneTmpl.affix( ".dropdown-menu li a[data-temp=23]" );
		$zoneTmpl.affix( ".current-temperature" );

		consumer = new APIConsumer();
	} );

	it( 'should have been initialized', function () {
		expect( consumer.initialized ).toBeTruthy();
	} );

	// ensure that the text fixtures are set up correctly
	it( 'should have populated fixtures', function () {
		expect( consumer.$doc.length ).toBe( 1 );
		expect( consumer.$p.length ).toBe( 1 );
		expect( consumer.$rooms.length ).toBe( 1 );
		expect( consumer.$zones.length ).toBe( 1 );
		expect( consumer.$roomTpl.length ).toBe( 1 );
		expect( consumer.$zoneTpl.length ).toBe( 1 );
	} );

	describe( 'with data', function () {
		var updateZoneDispatched = false,
			updateRoomDispatched = false;

		beforeEach( function () {
			consumer.setData( {
				"rooms": {
					"room1": {
						lights: true,
						curtains: false
					},
					"room2": {
						lights: false,
						curtains: true
					}
				},
				"zones": {
					"zone1": {
						temperature: 23,
						fan: false
					}
				}
			} );

			updateZoneDispatched = false;
			updateRoomDispatched = false;

			$( document ).on( "update-zone", function ( event ) {
				updateZoneDispatched = true;
			} );

			$( document ).on( "update-room", function ( event ) {
				updateRoomDispatched = true;
			} );
		} );

		it( 'to have 2 room renderers', function () {
			expect( consumer.data.rooms.room1 ).toBeTruthy();
			expect( consumer.data.rooms.room2 ).toBeTruthy();
			expect( document.querySelectorAll( '#modalAPIConsumer .room-template' ).length ).toBe( 2 );
		} );

		it( 'to have a properly populated room renderer', function () {
			expect( $( "#modalAPIConsumer .room-template.room1 .room-name" ).text() ).toBe( "room1" );
			expect( $( "#modalAPIConsumer .room-template.room1 .btn.lights" ).hasClass( "active" ) ).toBeTruthy();
			expect( $( "#modalAPIConsumer .room-template.room2 .btn.lights" ).hasClass( "active" ) ).toBeFalsy();

		} );

		it( 'to have a properly populated zone renderer', function () {
			expect( $( "#modalAPIConsumer .zone-template.zone1 .zone-name" ).text() ).toBe( "zone1" );
			expect( $( "#modalAPIConsumer .zone-template.zone1 .dropdown-menu li a[data-temp='23']" ).parent().hasClass( "disabled" ) ).toBeTruthy();
		} );

		it( 'to dispatch the update-zone API event when changing temperature', function () {
			expect( updateZoneDispatched ).toBeFalsy();
			$( "#modalAPIConsumer .zone-template.zone1 a[data-temp='23']" ).click();
			expect( updateZoneDispatched ).toBeTruthy();
		} );

		it( 'to dispatch the update-room API event when toggling lights', function () {
			expect( updateRoomDispatched ).toBeFalsy();
			$( "#modalAPIConsumer .room-template.room1 .btn.lights" ).click();
			expect( updateRoomDispatched ).toBeTruthy();
		} );
	} );

} );