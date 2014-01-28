module.exports = angular.module( "automation.directives", [] )

	/*
	 * The SVG Floorplan will vary it's height when the window resizes if the height is not set explicitly.
	 */
	.directive( "floorplan", ["$window", function ( $window ) {
		return {
			restrict: "E",
			transclude: false,
			controller: ["$scope", "$element", function ( $scope, $element ) {
				$scope.lastHeight = undefined;

				// If the window resizes, check to see if we need to resize the floor plan.
				// If there's already an onresize handler, make sure that it doesn't get lost.
				var origResize = $window.onresize;
				$window.onresize = function () {
					$scope.resizeFloorplan();

					if(typeof origResize === "function") {
						origResize.apply($window, arguments);
					}
				};

				// The floorplan SVG has an aspect ratio of approximately 5:3, find it's width, then set its height.
				// If the height is the same, don't change it, or the browser will re-paint, which can strain performance
				// unnecessarily.
				$scope.resizeFloorplan = function () {
					var svg = $element.find( "svg" ),
						h = (svg[0].offsetWidth * 0.6) + "px";

					if ( h == $scope.lastHeight ) return;

					svg.css( "height", h );
					$scope.lastHeight = h;
				};
			}],
			templateUrl: "partials/floorplan.html"
		};
	}] );