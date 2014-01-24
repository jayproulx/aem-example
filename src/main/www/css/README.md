Styles
======

We're using Bootstrap here, so most of the styles are handled by Bootstrap.  There are only a few small adjustments that are made, along with some styles to represent the business logic of the application.

For clarity, maintainability and compatibility reasons, the autoprefixer plugin for Grunt has been used to automatically add vendor specific prefixes to some of the CSS properties.  The generated file ends up in ```.../dist/index.css```.