/*
 * Keep the service configuration separate from the logic so that we can load different configurations for different
 * environments.
 *
 * This is the configuration for the gh-pages instance.
 */

module.exports = angular.module( "automation.config", [] )

	.value( "defaultsUrl", "/aem-example/bin/house/defaults.json" )
	.value( "roomSetUrl", "/aem-example/bin/house/room.json" )
	.value( "zoneSetUrl", "/aem-example/bin/house/zone.json" )
	.value( "lightsOnUrl", "/aem-example/bin/house/lights/on.json" )
	.value( "lightsOffUrl", "/aem-example/bin/house/lights/off.json" )
	.value( "temperatureSetUrl", "/aem-example/bin/house/temperature/set.json" );
