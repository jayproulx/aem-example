module.exports = function ( grunt, moduleName )
{
	return {
		browserify: {
			src: 'src/main/www/js/index.js',
			dest: 'src/main/www/dist/index.js',
			options: {
				transform: [grunt.option( 'transform' )]//,
//				aliasMappings: [
//					{
//						cwd: 'src/main/www/js',
//						src: ['**/*.js'],
//						dest: 'index'
//					}
//				]
			}
		},

		autoprefixer: {
			options: {
				browsers: ["last 4 version"]
			},

			expand: true,
			flatten: true,
			src: 'src/main/www/css/**/*.css',
			dest: 'src/main/www/dist'
		},

		karma: {
			configFile: 'src/test/www/js/karma.conf.js',
			singleRun: true
		}

	}
};