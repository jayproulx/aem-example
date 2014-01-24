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

Tested On
---------

- OSX Firefox Latest
- OSX Chrome Latest
- OSX Safari Latest
- iPad iOS 7

I expect this should work on most modern browsers.  Animations run more smoothly on Chrome, Safari and iOS than Firefox.

Running the Node.js HTTP Server
-------------------------------

There are instructions on starting up the HTTP server over on the Untethered repo:

https://github.com/jayproulx/generator-untethered#developing-an-untethered-ui

Project Description
-------------------

The vast majority of projects and applications out there are dry HTML forms and tables that talk to databases.  As an industry, we've moved well beyond "the basic" as an acceptable standard.  Our clients and users demand tactile interfaces and visualisations.

As a result, I've chosen a slightly obscure means for delivering a user interface: marrying HTML and SVG components with AngularJS.

Source code has README's at https://github.com/jayproulx/aem-example/tree/master/src/main/www/

TODO's
------

- Write Unit Tests

Attribution
-----------

### White House SVG ###

http://commons.wikimedia.org/wiki/File:White_House_FloorPlan2.svg


