config*.js
----------

For convenience, automation depends on automation.config which has 2 different implementations, with different paths to
the stub files depending on where the application is being hosted.

services.js
-----------

__DefaultsService__

- Loads default (or perhaps current values for a live household) values for rooms and zones from the server.

__RoomService__

- Sends requests to the server to update the record for the specified room
- The server should respond with the current state of the room

__LightsService__

- Sends requests to the server to turn on/off the lights in a particular room
- The server should respond with the current state of the room

__TemperatureService__

- Allows the user to set the temperature for any of the zones (furnaces/air conditioners) in the building.
- The server should respond with the current state of that zone

__ZoneService__

- Allows the user to update the record for the specified zone
- The server should respond with the current state of that zone

controllers.js
--------------

__AutomationCtrl__

- Provides high level functionality for all Zones and Rooms
- Dispatch events (update-zone, update-room) to modify existing room and zone instances

__RoomCtrl__

- Act as a combination ViewMediator and Controller
- Provide local version of model for the View to render
- Handle update-room events from AutomationCtrl to update view and submit changes to server via the RoomService

__ZoneCtrl__

- Act as a combination ViewMediator and Controller
- Provide local version of model for the View to render
- Handle update-zone events from AutomationCtrl to update view and submit changes to server via the ZoneService

directives.js
-------------

__floorplan__

- Handle rendering quirks for dynamic width SVG's

adapter.js
----------

Provide a jQuery friendly adapter for dispatching Automation API events from ```$(document)``` so that an API Consumer
doesn't need to be built on AngularJS.


