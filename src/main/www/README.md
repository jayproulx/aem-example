Web Root
========

Folder Structure
----------------

- css: plain old CSS styles
- dist: concatenated and minified versions of the original source files
- images: For this project, there's just house.svg
- js: JavaScript source
- libs: 3rd party libraries, installed using Bower
- partials: partial HTML files to be included using ng-include

index.html
----------

This is the entry point for this single-page-application. It provides the basic scaffolding for the application, some of the components are loaded from partials in ```partials/```, some of them are directly embedded.

CSS is loaded in the ```<head>``` of the document so that styles are available as soon as possible, however, JavaScript is loaded at the end of the ```<body>``` because the business logic can be deferred until after the page has loaded for performance reasons.  Where possible, all scripts are minified.

Usage Instructions
------------------

- Click the "Instructions" menu item to display a modal that describes how to use the features of the page
- Click the "API Consumer" menu item to display a user interface that allows control through a jQuery implementation of the Automation UI