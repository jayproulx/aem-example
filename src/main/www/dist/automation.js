require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var controllers=require("automation/controllers"),directives=require("automation/directives"),adapter=require("automation/adapter");module.exports=angular.module("automation",["ui.bootstrap","automation.controllers","automation.directives","automation.adapter"]);
},{"automation/adapter":"UOS8QZ","automation/controllers":"lq1gDp","automation/directives":"F79/c7"}],"automation/adapter":[function(require,module,exports){
module.exports=require('UOS8QZ');
},{}],"UOS8QZ":[function(require,module,exports){
module.exports=angular.module("automation.adapter",[]).run(["$rootScope","$document",function(o,n){var t=function(o){var t=Array.prototype.slice.call(arguments,1);n.trigger(o.name,t)},a=function(n){var t=Array.prototype.slice.call(arguments,1);t.unshift(n.type),o.$broadcast.apply(o,t)};n.on("load-defaults",function(o){a(o)}),n.on("update-room",function(o,n,t){a(o,n,t)}),n.on("update-zone",function(o,n,t){a(o,n,t)}),o.$on("defaults-loaded",function(o,n){t(o,n)}),o.$on("defaults-load-error",function(o,n){t(o,n)}),o.$on("room-updated",function(o,n,a){t(o,n,a)}),o.$on("room-update-error",function(o,n,a){t(o,n,a)}),o.$on("zone-updated",function(o,n,a){t(o,n,a)}),o.$on("zone-update-error",function(o,n,a){t(o,n,a)})}]);
},{}],"A86jH9":[function(require,module,exports){
module.exports=angular.module("automation.config",[]).value("defaultsUrl","/aem-example/bin/house/defaults.json").value("roomSetUrl","/aem-example/bin/house/room.json").value("zoneSetUrl","/aem-example/bin/house/zone.json").value("lightsOnUrl","/aem-example/bin/house/lights/on.json").value("lightsOffUrl","/aem-example/bin/house/lights/off.json").value("temperatureSetUrl","/aem-example/bin/house/temperature/set.json");
},{}],"automation/config.gh-pages":[function(require,module,exports){
module.exports=require('A86jH9');
},{}],"T2ncs/":[function(require,module,exports){
module.exports=angular.module("automation.config",[]).value("defaultsUrl","/bin/house/defaults.json").value("roomSetUrl","/bin/house/room.json").value("zoneSetUrl","/bin/house/zone.json").value("lightsOnUrl","/bin/house/lights/on.json").value("lightsOffUrl","/bin/house/lights/off.json").value("temperatureSetUrl","/bin/house/temperature/set.json");
},{}],"automation/config":[function(require,module,exports){
module.exports=require('T2ncs/');
},{}],"lq1gDp":[function(require,module,exports){
var services=require("automation/services");module.exports=angular.module("automation.controllers",["automation.services"]).controller("AutomationCtrl",["$rootScope","$scope","DefaultsService",function(o,e,a){e.temperatures=[{label:"15°C",value:15},{label:"16°C",value:16},{label:"17°C",value:17},{label:"18°C",value:18},{label:"19°C",value:19},{label:"20°C",value:20},{label:"21°C",value:21},{label:"22°C",value:22},{label:"23°C",value:23},{label:"24°C",value:24},{label:"25°C",value:25}],e.loadDefaults=function(){a.getDefaults().success(function(a){var t,n;e.zones=a.zones,e.rooms=a.rooms,o.$broadcast("defaults-loaded",a);for(t in e.rooms)e.rooms.hasOwnProperty(t)&&e.updateRoom(t,!0);for(n in e.zones)e.zones.hasOwnProperty(n)&&e.updateZone(n,!0)}).error(function(e,a,t,n){o.$broadcast("defaults-load-error",{data:e,status:a,headers:t,config:n})})},e.loadDefaults(),e.$on("load-defaults",function(){e.loadDefaults()}),e.updateZone=function(o,a){e.$broadcast("update-zone",o,e.zones[o],a)},e.updateRoom=function(o,a){e.$broadcast("update-room",o,e.rooms[o],a)}}]).controller("RoomCtrl",["$rootScope","$scope","RoomService",function(o,e,a){e.name=e.name||"unknown-room",e.room={lights:!1,curtains:!1},e.toggleLights=function(){var o=Object.create(e.room);o.lights=!o.lights,e.setRoom(e.name,o)},e.$on("update-room",function(a,t,n,r){e.name===t&&(r?(e.room=n,o.$broadcast("room-updated",t,n)):e.setRoom(t,n))}),e.setRoom=function(t,n){var r=e.room;e.room.lights=void 0,a.setRoom(t,n).success(function(){e.room.lights=n.lights,o.$broadcast("room-updated",t,n)}).error(function(a,n,s,u){o.$broadcast("room-update-error",t,{data:a,status:n,headers:s,config:u}),e.room=r})}}]).controller("ZoneCtrl",["$rootScope","$scope","ZoneService",function(o,e,a){e.name=e.name||"unknown-zone",e.zone={fan:!1,temperature:20},e.$on("update-zone",function(a,t,n,r){e.name==t&&(r?(e.zone=n,o.$broadcast("zone-updated",t,e.zone)):e.updateZone(n))}),e.updateZone=function(t){var n=e.zone;a.setZone(e.name,t).success(function(){e.zone=t,o.$broadcast("zone-updated",e.name,e.zone)}).error(function(a,t,r,s){o.$broadcast("zone-update-error",e.name,{data:a,status:t,headers:r,config:s}),e.zone=n})}}]);
},{"automation/services":"+c2s+C"}],"automation/controllers":[function(require,module,exports){
module.exports=require('lq1gDp');
},{}],"F79/c7":[function(require,module,exports){
module.exports=angular.module("automation.directives",[]).directive("floorplan",["$window",function(e){return{restrict:"E",transclude:!1,controller:["$scope","$element",function(t,o){t.lastHeight=void 0;var n=e.onresize;e.onresize=function(){t.resizeFloorplan(),"function"==typeof n&&n.apply(e,arguments)},t.resizeFloorplan=function(){var e=o.find("svg"),n=.6*e[0].offsetWidth+"px";n!=t.lastHeight&&(e.css("height",n),t.lastHeight=n)}}],templateUrl:"partials/floorplan.html"}}]);
},{}],"automation/directives":[function(require,module,exports){
module.exports=require('F79/c7');
},{}],"+c2s+C":[function(require,module,exports){
var config=require("automation/config");module.exports=angular.module("automation.services",["automation.config"]).factory("DefaultsService",["$http","defaultsUrl",function(r,t){var e={};return e.getDefaults=function(){return r({method:"GET",url:t})},e}]).factory("RoomService",["$http","roomSetUrl",function(r,t){var e={};return e.setRoom=function(e,n){return r({method:"GET",url:t,params:{name:e,lights:n.lights,curtains:n.curtains}})},e}]).factory("LightsService",["$http","lightsOffUrl","lightsOnUrl",function(r,t,e){var n={};return n.turnOff=function(e){return r({method:"GET",url:t,params:{room:e}})},n.turnOn=function(t){return r({method:"GET",url:e,params:{room:t}})},n}]).factory("ZoneService",["$http","zoneSetUrl",function(r,t){var e={};return e.setZone=function(e,n){return r({method:"GET",url:t,params:{name:e,temperature:n.temperature,fan:n.fan}})},e}]).factory("TemperatureService",["$http","temperatureSetUrl",function(r,t){var e={};return e.setTemperature=function(e,n){return r({method:"GET",url:t,params:{zone:e,temperature:n}})},e}]);
},{"automation/config":"T2ncs/"}],"automation/services":[function(require,module,exports){
module.exports=require('+c2s+C');
},{}]},{},[1])
;