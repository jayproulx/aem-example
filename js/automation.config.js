/*
 * Keep the service configuration separate from the logic so that we can load different configurations for different
 * environments.
 */

module.exports = angular.module( "automation.config", [] )

	.value( "defaultsUrl", "/bin/house/defaults.json" )
	.value( "lightsOnUrl", "/bin/house/lights/on.json" )
	.value( "lightsOffUrl", "/bin/house/lights/off.json" )
	.value( "temperatureSetUrl", "/bin/house/temperature/set.json" );
