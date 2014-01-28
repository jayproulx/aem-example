/**
 * AngularJS is very testable through an explicit separation of concerns
 */

var Helpers = {
	getPromise: function () {
		return {
			success: function ( callback ) {
				if ( callback ) {
					callback();
				}

				return this;
			},
			error: function ( callback ) {
				if ( callback ) {
					callback();
				}

				return this;
			}
		};
	},

	getCallback: function () {
		return function () {

		};
	}
};

describe( "Automation API", function () {
	beforeEach( angular.mock.module( 'automation' ) );

	describe( "AutomationCtrl", function () {
		var scope, rootScope, service;

		beforeEach( inject( function ( $rootScope, $controller ) {
			scope = $rootScope.$new();
			timeout = Helpers.getCallback();

			service = {
				getDefaults: function () {
					return Helpers.getPromise();
				}
			};

			$controller( 'AutomationCtrl', {$rootScope: $rootScope, $scope: scope, $timeout: timeout, DefaultsService: service} );

			spyOn( service, "getDefaults" );
			spyOn( scope, "loadDefaults" ).andCallThrough();
		} ) );

		it( 'has an array of temperatures', function () {
			expect( scope.temperatures.length ).toBeGreaterThan( 1 );
		} );

		xit( 'calls loadDefaults during initialization', function () {
			expect( service.getDefaults ).toHaveBeenCalled();
			expect( scope.loadDefaults ).toHaveBeenCalled();
		} );
	} );

	xdescribe( "RoomCtrl", function () {
		var scope, rootScope, service;

		beforeEach( inject( function ( $controller ) {
			scope = Helpers.getScope();
			rootScope = Helpers.getScope();
			timeout = Helpers.getCallback();
			service = {
				setRoomCalled: false,
				setRoom: function () {
					setRoomCalled = true;

					return Helpers.getPromise();
				}
			};

			$controller( 'RoomCtrl', {$rootScope: rootScope, $scope: scope, $timeout: timeout, RoomService: service} );
		} ) );

		it( 'has default values set', function () {
			expect( scope.room ).toBeTruthy();
			expect( scope.room.lights ).toBeFalsy();
			expect( scope.room.curtains ).toBeFalsy();
			expect( scope.name ).toBe( 'unknown-room' );
		} );


	} );

} );
