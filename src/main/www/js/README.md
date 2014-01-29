JavaScript and Business Logic
=============================

The great thing about AngularJS is its ability to cleanly separate individual pieces of Model, View and Controller and
Service/Factory.  Models are represented by the nested ```$scope```, Views by HTML templates and Directives, controllers
by (oddly enough) Controllers, and Services and Factories via Factories, ```$http``` and ```$resource```.

index.js
--------

[index.js](index.js) is the entrypoint for our single page application.  It depends on, and inherits from the automation
library (see below).

[APIConsumer](index/APIConsumer.js) provides a pure jQuery example of how to render a UI and respond to Automation API events.

automation.js
-------------

[automation.js](automation.js) is where the majority of the business logic of this application lies.  The automation library
provides the following API, which is available via both events from ```$(document)``` and ```$rootScope```, depending
on whether your preference is an AngularJS or jQuery consumer.

[The API is fully documented here.](../../../../API.md)