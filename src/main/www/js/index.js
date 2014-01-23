angular.module( "index", ["automation"] )

	/*
	 * APICtrl is an example of how we might pick up broadcast events from inside the automation implementation and react to those changes.
	 */
	.controller( "APICtrl", ["$rootScope", "$scope", function($rootScope, $scope) {
		$scope.messages = [];

		$rootScope.$on("defaults-loaded", function(event, data) {
			$scope.messages.push(new Date() + ": " + event.name + " fired");
		});

		$rootScope.$on("room-updated", function(event, roomName, data) {
			$scope.messages.push(new Date() + ": " + event.name + " fired for room " + roomName);
		});

		$rootScope.$on("room-update-error", function(event, roomName, data) {
			$scope.messages.push(new Date() + ": " + event.name + " fired for room " + roomName);
		});

		$rootScope.$on("zone-updated", function(event, zoneName, data) {
			$scope.messages.push(new Date() + ": " + event.name + " fired for zone " + zoneName);
		});

		$rootScope.$on("zone-update-error", function(event, zoneName, data) {
			$scope.messages.push(new Date() + ": " + event.name + " fired for zone " + zoneName);
		});
	}]);