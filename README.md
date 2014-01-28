AEM JavaScript Example
======================

Running the Example
-------------------

http://jayproulx.github.com/aem-example/

Requirements
------------

A JavaScript application simulating house automation: pressing a button on a control panel would visually turn on a light, change the temperature or close the curtains. Some constraints:
- the application must use jQuery
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

Meeting the Requirements
------------------------

_The application must use jQuery_

jQuery is used to consume the events dispatched by the Automation API, render all updates, and provide  a simple form
for updating the data.

_The components must have HTTP based server interaction_

The Automation API sends mock requests to the server to store and update data.  In some cases, we don't use the response
because of the static nature of the mock data.  The jQuery

_The solution has to be extensible and documented_

There are annotations in all relevant source code directories (src/main/www/**), and comments in the code.  The code
comments are not meant to be exhaustively or extensively documented, and assumes the reader has knowledge of the
language and frameworks used.  Code that is not immediately clear or highly formulaic will be commented for the reader
to quickly understand the intentions.

TODO's
------

[x] Encapsulate Automation UI
[x] Refactor temperature / lights API's into Room/Zone storage
[ ] Adapt AngularJS events to document events for non-angular API consumers.
[ ] Write jQuery API consumer
[ ] Create HTTP logging API for jQuery to send data to
[x] Convert FloorplanCtrl to a directive
[ ] Write Unit Tests

Attribution
-----------

### White House SVG ###

http://commons.wikimedia.org/wiki/File:White_House_FloorPlan2.svg


