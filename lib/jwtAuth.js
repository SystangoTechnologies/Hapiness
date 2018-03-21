'use strict';


exports.plugin = {  
  register: (server, options) => {
    server.auth.strategy('jwt', 'jwt', {
      key: options.key,
      validate: validate,            // validate function defined above
      verifyOptions: {
        algorithms: options.algorithm
      }
       // Uncomment this to apply default auth to all routes
  //plugin.auth.default('jwt');
    });
  },
  name : 'jwt-auth'
};


// bring your own validation function
const validate = function (decoded, request) {
 
  // do your checks to see if the person is valid
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
    return { isValid: true };
  }
  else {
    console.log('Invalid Credential');
    return { isValid: false };
  }
};