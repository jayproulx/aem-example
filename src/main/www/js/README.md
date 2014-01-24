JavaScript and Business Logic
=============================

The great thing about AngularJS is its ability to cleanly separate individual pieces of Model, View and Controller and Service/Factory.  Models are represented by the nested ```$scope```, Views by HTML templates and Directives, controllers by (oddly enough) Controllers, and Services and Factories via Factories, ```$http``` and ```$resource```.

index.js
--------

```index.js``` is the entrypoint for our single page application.  It depends on, and inherits from the automation library (see below).  The index module can react to the events dispatched by automation, and dispatch its own events to control aspects of automation.

In ```APICtrl```, we listen for all of the events coming from automation and display them as messages in the API Output dialog.

At this time, there's a ```FloorplanCtrl``` which handles some of the resizing issues associated with dynamically scaled SVG's, this would be much better implemented as a Directive, I'd like to do that shortly.

automation.config*.js
---------------------

For convenience, automation depends on automation.config which has 2 different implementations, with different paths to the stub files depending on where the application is being hosted.

automation.js
-------------

```automation.js``` is where the majority of the business logic of this application lies.  The automation library provides the following services and controllers:

### Services ###

__DefaultsService__

- Loads default (or perhaps current values for a live household) values for rooms and zones from the server.
  
__LightsService__

- Sends requests to the server to turn on/off the lights in a particular room
- The server should respond with the current state of the room once the request has been made.

__TemperatureService__

- Allows the user to set the temperature for any of the zones (furnaces/air conditioners) in the building.  
- The server should respond with the current state of that furnace / air conditioner
  
### Controllers ###

__AutomationCtrl__

- Provides high level functionality for all Zones and Rooms
- Dispatch events (update-zone, update-room) to modify existing room and zone instances

__RoomCtrl__

- Act as a combination ViewMediator and Controller
- Provide local version of model for the View to render
- Handle update-room events from AutomationCtrl to update view and submit changes to server via the LightsService

__ZoneCtrl__

- Act as a combination ViewMediator and Controller
- Provide local version of model for the View to render
- Handle update-zone events from AutomationCtrl to update view and submit changes to server via the TemperatureService

### API Documentation ###

__Events Dispatched__

 * room-updated: function(event, roomName, roomObj) {}
   * Dispatched when the room view has been updated or the server has responded with an update
 * room-update-error: function(event, roomName, connectionData) {}
   * Dispatched when the server was unable to process the request
 * zone-updated: function(event, zoneName, zoneObj) {}
   * Dispatched when the zone view has been updated or the server has responded with an update
 * zone-update-error: function(event, zoneName, connectionData) {}
   * Dispatched when the server was unable to process the request
   
__Events Handled__

 * update-room: arguments: roomName, roomObj
   * 
 * update-zone: arguments: zoneName: zoneObj