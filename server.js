'use strict';

const Composer = require('./index');
const Hoek = require('hoek');

Composer(function(err, server) {
    Hoek.assert(!err, err);
    server.start(function() {
      // Log to the console the host and port info
      server.connections.forEach(function(connection) {
           console.log('Server started at: ' + connection.info.uri);
      });
    });
});
