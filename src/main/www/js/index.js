angular.module( "index", ["ui.bootstrap"] )

	.controller( 'WelcomeCtrl', ['$scope', '$http',
		function ( $scope, $http ) {
			$scope.quotes = [
				"Untethered drastically simplified my UI dev environment.",
				"I don't know how I could live without Untethered.",
				"Untethered is a great combination of Bower, Grunt, Yeoman, Node.js.",
				"Our teams efficiency has improved by 294% since adopting Untethered.",
				"Everyone else jumped on the bandwagon, so we did too!"
			];

			$http.get( "http://api.randomuser.me/?results=5" )
				.success(function ( data, status, headers, config ) {
					// this callback will be called asynchronously
					// when the response is available
					console.log(data);

					$scope.users = data.results;
				} );
		}
	] )

	.filter('titlecase', function () {
		return function (input) {
			var words = input.split(' ');

			for (var i = 0; i < words.length; i++) {
				words[i] = words[i].toLowerCase().charAt(0).toUpperCase() + words[i].slice(1);
			}

			return words.join(' ');
		};
	});
