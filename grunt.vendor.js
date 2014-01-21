module.exports = function ( grunt, moduleName )
{
	return {
		browserify: {
			src: [
				// jquery, if you want to use it, needs to be aliased and shimmed below
				//"src/main/www/libs/jquery/jquery.min.js",
				// bootstrap.js is not necessary if we're using angular-bootstrap below
				//"src/main/www/libs/bootstrap/dist/js/bootstrap.min.js",
				"src/main/www/libs/angular/angular.js",
				"src/main/www/libs/angular-bootstrap/ui-bootstrap.min.js",
				"src/main/www/libs/angular-bootstrap/ui-bootstrap-tpls.min.js"
			],
			dest: "src/main/www/dist/vendor.js",
			options: {
				alias: [
					//"src/main/www/libs/jquery/jquery.min.js:jquery",
					"src/main/www/libs/angular/angular.js:angular"
				],
				shim: {
					/*jquery: {
						path: 'src/main/www/libs/jquery/jquery.min.js',
						exports: '$'
					},*/
					angular: {
						path: 'src/main/www/libs/angular/angular.js',
						exports: 'angular'
					}
				},
				transform: [grunt.option( 'transform' )]
			}
		}
	}
};
