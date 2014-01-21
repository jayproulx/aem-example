var gruntModules = require( "grunt-modules" );

module.exports = function ( grunt )
{
	"use strict";

	var minify = grunt.option( 'minify' ) === undefined || grunt.option( 'minify' ) === true;

	grunt.option( 'transform', minify ? 'uglifyify' : '' );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		watch: {
			express: {
				files: 'src/main/node/**/*.js',
				tasks: ['express:dev'],
				options: {
					nospawn: true
				}
			},

			browserify: {
				// match all .js files in www, unless it's in a dist folder.
				files: ['src/main/www/**/*.js', '!**/dist/**/*.js'],
				tasks: ['browserify']
			},

			autoprefixer: {
				// match all .css files in www, unless it's in a dist folder.
				files: ['src/main/www/**/*.css', '!**/dist/**/*.css'],
				tasks: ['autoprefixer']
			}
		},

		jshint: {
			// define the files to lint
			files: ['Gruntfile.js', 'src/main/www/**/*.js', 'src/test/www/**/*.js', '!**/dist/**/*.js', '!src/main/www/libs/**/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				// more options here if you want to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					require: true,
					angular: true
				}
			}
		},

		express: {
			server: {
				options: {
					script: 'src/main/node/server.js',
					background: true
				}
			}
		}
	} );

	/* Each page gets its own module (typically), define a new one by copying and pasting a line and the respective config file here */
	gruntModules( grunt, {
		vendor: require( "./grunt.vendor.js" ),
		index: require( "./grunt.index.js" )
	} );

	grunt.loadNpmTasks( 'grunt-browserify' );
	grunt.loadNpmTasks( 'grunt-autoprefixer' );
	grunt.loadNpmTasks( 'grunt-express-server' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-karma' );

	grunt.registerTask( 'default', [
		'browserify',
		'autoprefixer',
		'express',
		'watch'
	] );

	grunt.registerTask( 'ci', ['jshint', 'browserify', 'autoprefixer', 'karma'] );
};
