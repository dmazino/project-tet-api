'use strict';
var util = require('util');
const bluetooth = require('../../bluetooth');
const websocket = require('../../websocket');

module.exports = {
  hello: hello,
  lightOn,
  lightOff,
  lightStatus
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function hello(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
}

function lightOn(req, res) {
  bluetooth.turnOnLEDs();
  websocket.updateState(websocket.states.LIGHT_ON);
  res.json('Turned on');
}

function lightOff(req, res) {
  bluetooth.turnOffLEDs();
  websocket.updateState(websocket.states.LIGHT_OFF);
  res.json('Turned off');
}

function lightStatus(req, res) {
  res.json(bluetooth.getStatus());
}