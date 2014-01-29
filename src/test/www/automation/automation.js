/**
 * AngularJS is very testable through an explicit separation of concerns
 */
var mocks = {
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
};

/**
 * The Receiver is an object which can watch for events and tally up the event dispatches so that
 * we can ensure the API events are firing as we'd expect.
 */
var Receiver = {
	received: {},

	handler: function ( event ) {
		// checking the type/name property allows us to handle jQuery/document events, and name for AngularJS events.
		var key = event.hasOwnProperty( 'type' ) ? event.type : event.name;
		if ( this.received[key] === undefined ) {
			this.received[key] = 0;
		}

		this.received[key]++;
	},

	reset: function () {
		this.received = {};
	}
};

describe( "Automation API", function () {
	beforeEach( angular.mock.module( 'automation' ) );

	describe( "AutomationCtrl", function () {
		var scope,
			rootScope,
			$httpBackend,
			DefaultsService,
			receiver;

		beforeEach( inject( function ( _$httpBackend_, $rootScope, $controller, defaultsUrl, _DefaultsService_ ) {
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET( defaultsUrl ).respond( mocks );
			DefaultsService = _DefaultsService_;
			receiver = Object.create( Receiver );
			rootScope = $rootScope;
			scope = $rootScope.$new();

			spyOn( DefaultsService, "getDefaults" ).andCallThrough();

			scope.$on( "defaults-loaded", receiver.handler.bind( receiver ) );
			scope.$on( "update-zone", receiver.handler.bind( receiver ) );
			scope.$on( "update-room", receiver.handler.bind( receiver ) );

			$controller( 'AutomationCtrl', {
				$rootScope: $rootScope,
				$scope: scope,
				DefaultsService: DefaultsService
			} );

			receiver.reset();
		} ) );

		it( 'has an array of temperatures', function () {
			expect( scope.temperatures.length ).toBeGreaterThan( 1 );
		} );

		it( 'should call DefaultsService.getDefaults()', function () {
			expect( DefaultsService.getDefaults ).toHaveBeenCalled();
		} );

		it( 'should broadcast a defaults-loaded event', function () {
			$httpBackend.flush();
			expect( receiver.received["defaults-loaded"] ).toBeTruthy();
		} );

		it( 'should have default data in the scope', function () {
			// expect( scope.data ).toEqual( undefined );
			$httpBackend.flush();
			expect( scope.zones ).toEqual( mocks.zones );
			expect( scope.rooms ).toEqual( mocks.rooms );
		} );

		it( 'should have dispatched update-zone and update-room events for each of the records', function () {
			$httpBackend.flush();
			expect( receiver.received["update-room"] ).toBe( 2 );
			expect( receiver.received["update-zone"] ).toBe( 1 );
		} );

		it( 'should reload defaults when the load-defaults event is handled', function () {
			spyOn( scope, "loadDefaults" );
			rootScope.$broadcast( "load-defaults" );
			expect( scope.loadDefaults ).toHaveBeenCalled();
		} );
	} );

	describe( "RoomCtrl", function () {
		var scope,
			rootScope,
			$httpBackend,
			RoomService,
			receiver;

		beforeEach( inject( function ( _$httpBackend_, $rootScope, $controller, roomSetUrl, _RoomService_ ) {
			$httpBackend = _$httpBackend_;
			// we need to use a regex here to match the URL, the request will have get params attached
			$httpBackend.expectGET( /.*?room.json.*/ ).respond( mocks.rooms.room1 );
			RoomService = _RoomService_;
			receiver = Object.create( Receiver );
			rootScope = $rootScope;
			scope = $rootScope.$new();
			scope.name = "room1"; // the room name is provided by the view in ng-init

			scope.$on( "room-updated", receiver.handler.bind( receiver ) );

			$controller( 'RoomCtrl', {$element: $("<div></div>" ).attr("id", scope.name), $rootScope: rootScope, $scope: scope, RoomService: RoomService} );

			receiver.reset();
		} ) );

		it( 'has default values set', function () {
			expect( scope.room ).toBeTruthy();
			expect( scope.room.lights ).toBeFalsy();
			expect( scope.room.curtains ).toBeFalsy();
			expect( scope.name ).toBe( "room1" );
		} );

		it( 'should update the model when toggling the lights', function () {
			spyOn( scope, "setRoom" );
			scope.toggleLights();
			// also make sure the lights have been toggled
			expect( scope.setRoom ).toHaveBeenCalledWith( scope.name, {lights: !scope.room.lights, curtains: scope.room.curtains} );
		} );

		it( 'should update the room when the update-room event is handled', function () {
			spyOn( scope, "setRoom" );

			rootScope.$broadcast( "update-room", "room1", mocks.rooms.room1 );
			expect( scope.setRoom ).toHaveBeenCalled();
			// falsy because we're spying on setRoom, we're not actually executing it.
			expect( receiver.received["room-updated"] ).toBeFalsy();
		} );

		it( 'should only update the view when update-room provides dontPersist', function () {
			spyOn( scope, "setRoom" );

			rootScope.$broadcast( "update-room", "room1", mocks.rooms.room1, true );
			expect( scope.setRoom ).not.toHaveBeenCalled();
			expect( scope.room.lights ).toBeTruthy();
			expect( receiver.received["room-updated"] ).toBeTruthy();
		} );

		it( 'should set the lights to undefined while we wait for a server response', function () {
			scope.setRoom( "room1", mocks.rooms.room1 );
			expect( scope.room.lights ).toBe( undefined );
		} );

		it( 'should set the lights to the requested value on a successful request', function () {
			scope.setRoom( "room1", mocks.rooms.room1 );
			expect( scope.room.lights ).toBe( undefined );
			$httpBackend.flush();
			expect( receiver.received["room-updated"] ).toBeTruthy();
			expect( scope.room.lights ).toBe( mocks.rooms.room1.lights );
		} );

	} );

	describe( "ZoneCtrl", function () {
		var scope,
			rootScope,
			$httpBackend,
			ZoneService,
			receiver;

		beforeEach( inject( function ( _$httpBackend_, $rootScope, $controller, zoneSetUrl, _ZoneService_ ) {
			$httpBackend = _$httpBackend_;
			// we need to use a regex here to match the URL, the request will have get params attached
			$httpBackend.expectGET( /.*?zone.json.*/ ).respond( mocks.zones.zone1 );
			ZoneService = _ZoneService_;
			receiver = Object.create( Receiver );
			rootScope = $rootScope;
			scope = $rootScope.$new();
			scope.name = "zone1"; // the zone name is provided by the view in ng-init

			scope.$on( "zone-updated", receiver.handler.bind( receiver ) );

			$controller( 'ZoneCtrl', {$element: $("<div></div>" ).attr("id", scope.name), $rootScope: rootScope, $scope: scope, ZoneService: ZoneService} );

			receiver.reset();
		} ) );

		it( 'has default values set', function () {
			expect( scope.zone ).toBeTruthy();
			expect( scope.zone.temperature ).toBe( 20 );
			expect( scope.zone.fan ).toBeFalsy();
			expect( scope.name ).toBe( "zone1" );
		} );

		it( 'should update the zone when the update-zone event is handled', function () {
			spyOn( scope, "updateZone" );

			rootScope.$broadcast( "update-zone", "zone1", mocks.zones.zone1 );
			expect( scope.updateZone ).toHaveBeenCalled();
			// falsy because we're spying on updateZone, we're not actually executing it.
			expect( receiver.received["zone-updated"] ).toBeFalsy();
		} );

		it( 'should only update the view when update-zone provides dontPersist', function () {
			spyOn( scope, "updateZone" );

			rootScope.$broadcast( "update-zone", "zone1", mocks.zones.zone1, true );
			expect( scope.updateZone ).not.toHaveBeenCalled();
			expect( scope.zone.temperature ).toBe( mocks.zones.zone1.temperature );
			expect( receiver.received["zone-updated"] ).toBeTruthy();
		} );

		it( 'should set the temperature to the requested value on a successful request', function () {
			scope.updateZone( mocks.zones.zone1 );
			expect( scope.zone.temperature ).toBe( 20 ); // default value
			$httpBackend.flush();
			expect( receiver.received["zone-updated"] ).toBeTruthy();
			expect( scope.zone.temperature ).toBe( mocks.zones.zone1.temperature );
		} );

	} );

	describe( "Adapter", function () {
		var receiver, rootScope, doc;

		beforeEach( inject( function ( $rootScope, $document ) {
			doc = $document;
			rootScope = $rootScope;

			receiver = Object.create( Receiver );

			$rootScope.$on( "load-defaults", receiver.handler.bind( receiver ) );
			$rootScope.$on( "update-room", receiver.handler.bind( receiver ) );
			$rootScope.$on( "update-zone", receiver.handler.bind( receiver ) );
			$document.on( "defaults-loaded", receiver.handler.bind( receiver ) );
			$document.on( "defaults-load-error", receiver.handler.bind( receiver ) );
			$document.on( "room-updated", receiver.handler.bind( receiver ) );
			$document.on( "room-update-error", receiver.handler.bind( receiver ) );
			$document.on( "zone-updated", receiver.handler.bind( receiver ) );
			$document.on( "zone-update-error", receiver.handler.bind( receiver ) );

			receiver.reset();
		} ) );

		it( 'dispatches an angular load-defaults event when handling the equivalent document event', function () {
			doc.trigger( "load-defaults" );
			expect( receiver.received["load-defaults"] ).toBe( 1 );
		} );

		it( 'dispatches an angular update-room event when handling the equivalent document event', function () {
			doc.trigger( "update-room" );
			expect( receiver.received["update-room"] ).toBe( 1 );
		} );

		it( 'dispatches an angular update-zone event when handling the equivalent document event', function () {
			doc.trigger( "update-zone" );
			expect( receiver.received["update-zone"] ).toBe( 1 );
		} );

		it( 'dispatches a document defaults-loaded event when handling the equivalent angular event', function () {
			doc.trigger( "defaults-loaded" );
			expect( receiver.received["defaults-loaded"] ).toBe( 1 );
		} );

		it( 'dispatches a document defaults-load-error event when handling the equivalent angular event', function () {
			doc.trigger( "defaults-load-error" );
			expect( receiver.received["defaults-load-error"] ).toBe( 1 );
		} );

		it( 'dispatches a document room-updated event when handling the equivalent angular event', function () {
			doc.trigger( "room-updated" );
			expect( receiver.received["room-updated"] ).toBe( 1 );
		} );

		it( 'dispatches a document room-update-error event when handling the equivalent angular event', function () {
			doc.trigger( "room-update-error" );
			expect( receiver.received["room-update-error"] ).toBe( 1 );
		} );

		it( 'dispatches a document zone-updated event when handling the equivalent angular event', function () {
			doc.trigger( "zone-updated" );
			expect( receiver.received["zone-updated"] ).toBe( 1 );
		} );

		it( 'dispatches a document zone-update-error event when handling the equivalent angular event', function () {
			doc.trigger( "zone-update-error" );
			expect( receiver.received["zone-update-error"] ).toBe( 1 );
		} );

	} );

} );
