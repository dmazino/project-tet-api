'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const bluetooth = require('./bluetooth');
const websocket = require('./websocket');
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, async function (err, swaggerExpress) {
  if (err) { throw err; }

  /* IOT STUFF */
  console.log('Initializing bluetooth devices...');
  try {
    await bluetooth.init();
  }
  catch (e) {
    console.log(e)
  };

  /* API STUFF */
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  const httpServer = app.listen(port);

  websocket.init(httpServer);

  if (swaggerExpress.runner.swagger.paths['/lights/on']) {
    console.log('LET THERE BE LIGHT!: curl http://127.0.0.1:' + port + '/lights/on');
  }

});
