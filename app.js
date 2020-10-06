'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const bluetooth = require('./bluetooth');
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  /* IOT STUFF */
  bluetooth.init();
  // bluetooth.turnOffLEDs();

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }

  if(swaggerExpress.runner.swagger.paths['/lights/on']){
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/lights/on');
  }

  if(swaggerExpress.runner.swagger.paths['/lights/off']){
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/lights/off');
  }
});
