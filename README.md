AEM JavaScript Example
======================

Running the Example
-------------------

http://jayproulx.github.com/aem-example/

Requirements
------------

A JavaScript application simulating house automation: pressing a button on a control panel would visually turn on a
light, change the temperature or close the curtains. Some constraints:

- the application must use jQuery
- the components must have HTTP based "server" interaction (use a static file for simplicity, data persistence is not required). For example, the heating component retrieves the current temperature from the server and also sends the desired one back to the server.
- the solution has to be extensible and documented, so that we can develop our own components that react to events

The application will be executed on a plain HTTP server with no possibility to run code server side and is being viewed
in 2 major browsers of your choice.

Meeting the Requirements
------------------------

_The application must use jQuery_

jQuery is used to consume the events dispatched by the Automation API, render all updates, and provide  a simple form for updating the data.  Click the "API Consumer" menu item at the top of the screen to see a pure jQuery UI that dispatches and responds to events.

_The components must have HTTP based server interaction_

The Automation API sends mock requests to the server to store and update data.  In some cases, we don't use the response because of the static nature of the mock data.  For the purposes of this example, the jQuery API consumer posts logging
 data to a fictitious logging service.

_The solution has to be extensible and documented_

There are annotations in all relevant source code directories [src/main/www/**](https://github.com/jayproulx/aem-example/tree/master/src/main/www/), and comments in the code.  The code comments are not meant to be exhaustively or extensively documented, and assumes the reader has knowledge of the language and frameworks used.  Code that is not immediately clear or highly formulaic will be commented for the reader to quickly understand the intentions.

To demonstrate extensibility, a jQuery API consumer has been provided as an example, along with a UI to manipulate the available data.

[__The API is fully documented here__](https://github.com/jayproulx/aem-example/blob/master/API.md)

Self-prescribed Requirements
----------------------------

_Provide common continuous integration functionality_

It's 2014, we expect more from our code, performance and quality than is available out of the box.  Code should be optimized, minified and unit tested.

_Provide both AngularJS and jQuery examples_

The assignment requirements include a jQuery requirement, however there has been quite a bit of talk with the hiring manager and team about AngularJS as a primary context.  I've included AngularJS to demonstrate some of that skill set, and to "prove" the provided Automation API, I've built a jQuery API consumer that does some basic dom manipulation and an AJAX request.

Notes on Inclusions and Exclusions
----------------------------------

This sample is meant to be just that, a sample.  There are plenty of opportunities to add more validation and error reporting everywhere. I've added basic validation where necessary or risky, but I haven't validated and reported every possible error to keep application structure, business logic, and rendering code clean and clear.

```createDocumentFragment()``` is more efficient than direct DOM manipulation with jQuery in most cases, accessing certain element properties or calling certain methods can cause extra paints, and some combinations of CSS classes cause excessive rendering time.  This sample has taken some steps towards rendering performance, but there are always more steps that can be taken to improve it further.

Basically, this is a sample, it's not an exhaustive list of best practices and solutions.

Running the Node.js HTTP Server
-------------------------------

There are instructions on starting up the HTTP server over on the Untethered repo:

https://github.com/jayproulx/generator-untethered#developing-an-untethered-ui

Tested On
---------

- OSX Firefox Latest
- OSX Chrome Latest
- OSX Safari Latest
- iPad iOS 7

I expect this should work on most modern browsers.  Animations run more smoothly on Chrome, Safari and iOS than Firefox.

Attribution
-----------

### White House SVG ###

http://commons.wikimedia.org/wiki/File:White_House_FloorPlan2.svg


