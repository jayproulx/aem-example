angular.module( "index", ["ui.bootstrap"] )

	.controller( 'RoomCtrl', ["$scope", function ( $scope ) {
		$scope.name = $scope.name || "unknown-room";

		$scope.toggleLights = function () {
			$scope.lights = !$scope.lights;
		};
	}] );