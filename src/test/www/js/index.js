describe( 'Index Tests', function ()
{

	beforeEach( angular.mock.module( 'index' ) );

	it('should run at least 1 test', function() {
		expect('a test').toBeTruthy();
	});	
} );
