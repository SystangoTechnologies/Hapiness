'use strict';

const https = require('https');
const dmConfig = require('config').get('api.dmConfig.' + process.env.NODE_ENV);

exports.externalAppLogin = function(req, res, callback) {
  let post_data = {
    'email' : req.payload.email,
    'password' : req.payload.password
  };

  let post_options = {
    host: dmConfig.host,
    port: dmConfig.port,
    path: dmConfig.path,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'cache-control': 'no-cache'
    }
  };

  let postRequest = https.request(post_options, function (postResponse) {
    let response_body = '';
    console.log('STATUS: ' + postResponse.statusCode);
    console.log('HEADERS: ' + JSON.stringify(postResponse.headers));
    postResponse.setEncoding('utf8');
    postResponse.on('data', function (data) {
      console.log('BODY: ' + data);
      response_body += data;
    });
    postResponse.on('end', function() {
        if (postResponse.statusCode === 200){
          var parsed = JSON.parse(response_body);
          if(parsed.status){
            console.log('login Successfully');
            return callback(null,true,parsed.msg);
          }else{
            console.log(parsed.msg);
            return callback(true, false,parsed.msg);
          }
        }
        else{
           console.log('Invalid Credentials');
           return callback(null, false);
        }
      }
    );
  });

  postRequest.write(JSON.stringify(post_data));

  postRequest.on('error', function(err) {
    console.log('problem with request: ' + err.message);
    return callback(err);
  });

  postRequest.end();
};