Automation API
==============

nb. In demonstrating the functionality, you can control lights and rooms and temperature in zones, curtains and fans are there for robustness (lets call it that :), and so that we don't have data structures with only a single property.

Also, as mentioned in [README.md](README.md), when calling API's, there are ranges of acceptable values, validation is performed where necessary, your mileage may vary when providing values outside of the range or of the wrong type.  The UI provides restricted values, and all of those values are known to function.  Another area where I've chosen to focus on the requirements of the provided sample and focus on clarity.

Loading the API
---------------

While the API was written in AngularJS, all events are adapted and dispatched from ```document``` using jQuery so that any JavaScript library can access the events.

1. Include [dist/automation.js](src/main/www/dist/automation.js) in your HTML document
1. Load the Angular application: You can add it directly as ```ng-app="automation"```, or you can add ```automation``` as a dependency to your own Angular application (as we've done in [index.html](src/main/www/index.html) and [index.js](src/main/www/js/index.js))
1. Create an API Consumer (as we've done in [APIConsumer.js](src/main/www/js/index/apiconsumer.js)), or alternatively, for testing, you can simply dispatch events from the Web Inspector and watch the updates take place.

Events
------

Events are the primary mode of communication with the Automation API.  You have two options, you can either broadcast/consume the events using an AngularJS ```$rootScope```, or you can trigger/listen for the events on ```$(document)```.  Documentation here is only provided for the ```$(document)``` implementation.

Have a look at the [adapter](src/main/www/js/automation/adapter.js) to see how events are translated from AngularJS to jQuery space.  Examples of the API events in use can be seen in [apiconsumer.js](src/main/www/js/index/apiconsumer.js).

Read "Data Structures" below for a reference to the format of the data to pass to the events.

nb. When loading data from the static local stub files, you're extremely unlikely to get load errors.  I've intentionally dispatched the errors but left out handling them to try to reduce bloat.

### Loading Default Values ###

At times, you've made a bunch of changes to the UI, now it's too hot in the office, lights are on in the closet, and you just need to bring it all back to normal.

__Ask the API to load the defaults values for you:__

```javascript
$(document).trigger("load-defaults");
```

__Respond to newly loaded default values:__

```javascript
$(document).on("defaults-loaded", function(event, defaultsData) { ... });
```

__If the API fails to load defaults for some reason, handle the error:__

```javascript
$(document).on("defaults-load-error", function(event, errorData) { ... });
```

### Updating Rooms ###

__Ask the API to update a room for you:__

```javascript
// note that roomName and roomObject arguments are passed as an array
$(document).trigger("update-room", [roomName, roomObject]);

// example
$(document).trigger("update-room", ["queens-bedroom", {lights: true, curtains: false}]);
```

__Respond to a newly updated room__

```javascript
$(document).on("room-updated", function(event, roomName, roomObject) { ... });
```

__If the API fails to load the room for some reason, handle the error:__

```javascript
$(document).on("room-update-error", function(event, errorData) { ... });
```

### Updating Zones ###

__Ask the API to update a zone for you:__

```javascript
// note that zoneName and zoneObject arguments are passed as an array
$(document).trigger("update-zone", [zoneName, zoneObject]);

// example
$(document).trigger("update-zone", ["east-wing", {temperature: 25, fan: false}]);
```

__Respond to a newly updated zone__

```javascript
$(document).on("zone-updated", function(event, zoneName, zoneObject) { ... });
```

__If the API fails to load the zone for some reason, handle the error:__

```javascript
$(document).on("zone-update-error", function(event, errorData) { ... });
```

Data Structures
---------------

### Room ###

A room has lights and curtains that can be controlled.

Acceptable values:

- lights: ```false|true``` (```undefined``` produces an intermediate wait state while loading data from the server)
- curtains: ```false|true```

__Example:__

```json
{
    "lights": false,
    "curtains": false
}
```

### Zone ###

A zone could be considered an area of a building that has a dedicated furnace, larger buildings have more than one zone.

Acceptable values:

- temperature: 15-25 inclusively
- fan: ```false|true```

__Example:__

```json
{
    "temperature": 20,
    "fan": false
}
```

### Default Values ###

Default values can be loaded for all configured rooms and zones in the building.  Rooms and zones are maps in this data structure.

nb. Why maps and not arrays?  To demonstrate the functionality without bloat, it's much more straightforward to reference data in a JSON/POJSO object by a key than it is to filter arrays by a property.

__Example:__

```json
{
	"rooms": {
		"room-name1": { /* ... room object ... */ },
		"room-name2": { /* ... room object ... */ },
		"room-name3": { /* ... room object ... */ }
	},
	"zones": {
		"zone-name1": { /* ... zone object ... */ },
		"zone-name2": { /* ... zone object ... */ },
		"zone-name3": { /* ... zone object ... */ }
	}
}
```

### Error Data ###

If there's an error encountered while loading or sending requests to the server, you can access connection specific data.  [Format of these objects is available here under 'Usage'](http://docs.angularjs.org/api/ng.$http).

```json
{
    "data": data, 
    "status": status, 
    "headers": headers, 
    "config": config
}
```