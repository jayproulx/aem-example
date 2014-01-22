AEM JavaScript Example
======================

Running the Example
-------------------

http://jayproulx.github.com/aem-example/

Requirements
------------

A JavaScript application simulating house automation: pressing a button on a control panel would visually turn on a light, change the temperature or close the curtains. Some constraints:
- the application must use ~~jQuery~~ AngularJS
- the components must have HTTP based "server" interaction (use a static file for simplicity, data persistence is not required). For example, the heating component retrieves the current temperature from the server and also sends the desired one back to the server.
- the solution has to be extensible and documented, so that we can develop our own components that react to events
The application will be executed on a plain HTTP server with no possibility to run code server side and is being viewed in 2 major browsers of your choice.

Attribution
-----------

### White House SVG ###

http://commons.wikimedia.org/wiki/File:White_House_FloorPlan2.svg


