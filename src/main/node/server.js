var express = require("express");

var logger = function(req, res, next) {
    console.log("Received request: " + req.originalUrl);
    next(); 
}

var app = express();
var port = process.env.PORT || 8888;
var webroot = __dirname + "/../www";
var stubroot = __dirname + "/../stubs";

app.configure(function(){
    app.use(logger); // Here you add your logger to the stack.
    app.use(app.router); // The Express routes handler.
});

console.log("Enabling gzip compression");
app.use(express.compress());

console.log("Serving files from " + webroot);
app.use(express.static(webroot));
app.use("/api", express.static(stubroot));

console.log("Running on " + port);
app.listen(port);
