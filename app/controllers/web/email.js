'use strict';
var Email =  require('../../../lib/email');
const Promise = require('promise');

exports.sentForgotPasswordMail = function(data, baseUrl) {
    return new Promise(async (resolve, reject) =>{
        try {
            var to = data.to;
            var token = data.token;
            var resetURL = baseUrl+'/reset/'+token;
            var subject = 'Password Reset Request';
            var mailbody = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                          'Please click on the following link, or paste this into your browser to complete the process:\n\n'
                          + resetURL + '\n\n' +
                          'If you did not request this, please ignore this email and your password will remain unchanged.\n';
            var mailResult = await Email.sendMail(to , subject, mailbody);
            if(mailResult.sent) {
                return resolve('Reset link sent to your email');
            } else {
                return reject('Email Error, Please try again later');
            } 
        } catch (error) {
            return reject(error.message);
        }
    });        
};
