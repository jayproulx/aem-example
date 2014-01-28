JavaScript and Business Logic
=============================

The great thing about AngularJS is its ability to cleanly separate individual pieces of Model, View and Controller and
Service/Factory.  Models are represented by the nested ```$scope```, Views by HTML templates and Directives, controllers
by (oddly enough) Controllers, and Services and Factories via Factories, ```$http``` and ```$resource```.

index.js
--------

```index.js``` is the entrypoint for our single page application.  It depends on, and inherits from the automation
library (see below).  The index module can react to the events dispatched by automation, and dispatch its own events
to control aspects of automation.

In ```APICtrl```, we listen for all of the events coming from automation and display them as messages in the API Output
dialog.

automation.js
-------------

```automation.js``` is where the majority of the business logic of this application lies.  The automation library
provides the following API, which is available via both events from ```$(document)``` and ```$rootScope```, depending
on whether your preference is an AngularJS or jQuery consumer.

### API Documentation ###

__Events Dispatched__

_defaults-loaded: function(event) {}_

* Dispatched when defaults have been loaded from the server

_defaults-load-error: function(event, roomName, connectionData) {}_

* Dispatched when the server was unable to process the request

_room-updated: function(event, roomName, roomObj) {}_

* Dispatched when the room view has been updated or the server has responded with an update

_room-update-error: function(event, roomName, connectionData) {}_

* Dispatched when the server was unable to process the request

_zone-updated: function(event, zoneName, zoneObj) {}_

* Dispatched when the zone view has been updated or the server has responded with an update

_zone-update-error: function(event, zoneName, connectionData) {}_

* Dispatched when the server was unable to process the request
   
__Events Handled__

_load-defaults: arguments: none_

* Load the default values and update the view.

_update-room: arguments: roomName, roomObj_

* Emit to update a room with the name ```roomName``` with the properties contained in ```roomObj```

```
{
	"lights": true, 
	"curtains": false
}
```

_update-zone: arguments: zoneName: zoneObj_

* Emit to update a zone with the name ```zoneName``` with the properties contained in ```zoneObj```

```
{
	"temperature": 20,
	"fan": true
}
```

