'use strict';

exports.register = function (server, options, next) {

  server.auth.strategy('jwt', 'jwt', {
    key: options.key,
    verifyOptions: {
      algorithms: options.algorithm
    },
    // Implement validation function
    validateFunc: (decoded, request, callback) => {
      let id;
      console.log('request.method : ' + request.method);
      if (request.method.toUpperCase() === 'GET') {
          id = request.query.id; 
          console.log('GET device id = ' + id);
      }
      else if(request.method.toUpperCase() === 'POST'){
          id = request.payload.id; 
          console.log('POST device id = ' + id);
      }

      console.log('Decoded device id = ' + decoded.id);
      if (id === decoded.id) {
        return callback(null, true);
      }
      else {
        console.log('Invalid Credential');
        return callback(null, false);
      }
    }
  });

  // Uncomment this to apply default auth to all routes
  //plugin.auth.default('jwt');

  next();
};

exports.register.attributes = {
  name: 'jwt-auth'
};