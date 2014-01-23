module.exports = function ( grunt, moduleName )
{
	return {
		browserify: {
			src: 'src/main/www/js/automation.js',
			dest: 'src/main/www/dist/automation.js',
			options: {
				transform: [grunt.option( 'transform' )],
				aliasMappings: [
					{
						cwd: 'src/main/www/js',
						src: ['**/automation*.js'],
						dest: 'automation'
					}
				]
			}
		},

		karma: {
			configFile: 'src/test/www/js/karma.conf.js',
			singleRun: true
		}

	}
};
