"use strict";
/// <reference path="../typings/index.d.ts" />
var express = require("express");
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var routes = require("./routes/routes");
var cors = require('cors')
var app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));

app.use('/api', routes);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));

exports.app = app;
