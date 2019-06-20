'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');

var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = process.env.PORT || 3000;
// import other file from the server
var { setupDataLayer } = require('./utils/Data.js');
var router = require('./utils/Router.js');
// var auth = require('./utils/Authentication');

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, 'swagger.json'),
  controllers: path.join(__dirname, 'controller'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'openapi/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

//Setup cookie-session
let secretSession1 = process.env.SECRET_SESSION1 || 'key1';
let secretSession2 = process.env.SECRET_SESSION2 || 'key2';
app.use(cookieSession({
  name: 'user_session',
  maxAge: 900000,
  // expires: new Date(Date.now() + 3600000),
  path: '/test',
  signed: true,
  keys: [secretSession1, secretSession2]
}));
// app.use(function (req, res, next) {
//   console.log(req.session.views);
//   var n = req.session.views || 0
//   req.session.views = n + 1;
//   // console.log(req.session.views);
//   // res.end(n + ' views')
//   next();
// });
app.use(function (req, res, next) {
  
    // req.sessionOptions.expires = req.sessionOptions.expires + 900000;
  if(!req.session.isNew) {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
    if(req.session.loggedin) {
      res.cookie('logged', req.session.loggedin, { maxAge: req.sessionOptions.maxAge });
    }
    let loggedin = req.session.loggedin
  }
  next();
})

app.use('/', router);
app.use(express.static(path.join(__dirname,'public')));
// app.use('/public',serveStatic(path.join(__dirname, "public")));
// app.use('/pages',serveStatic(path.join(__dirname, "public", "pages")));
// app.use('/assets',serveStatic(path.join(__dirname, "public", "assets")));
// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // app.use(middleware.swaggerSecurity({
  //   //manage token function in the 'auth' module
  //   Bearer: auth.verifyToken
  // }));

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());




  setupDataLayer()
  .then(() => {
    // Start the server
    http.createServer(app).listen(serverPort, function () {
      console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
      console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    });
  })
  .catch(val => console.log(val));


});
