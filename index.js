'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');

var app = require('express')();
var serveStatic = require('serve-static');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = process.env.PORT || 3000;
// import other file from the server
var { setupDataLayer } = require('./utils/Data.js');
var router = require('./utils/Router.js');

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, 'swagger.json'),
  controllers: path.join(__dirname, 'controller'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);


app.use('/', router);
app.use('/public',serveStatic(path.join(__dirname, "public")));
app.use('/pages',serveStatic(path.join(__dirname, "public", "pages")));
app.use('/assets',serveStatic(path.join(__dirname, "public", "assets")));
// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());




  setupDataLayer().then(() => {
    // Start the server
    http.createServer(app).listen(serverPort, function () {
      console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
      console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    });
  });


});
