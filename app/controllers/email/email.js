'use strict';
var Email =  require('../../../lib/email');
const Promise = require('promise');

exports.sentForgotPasswordMail = function(data) {
    var to = data.to;
    var token = data.token;
    var request = data.request;
    var reply = data.reply;
    var resetURL = request.connection.info.uri+'/reset/'+token;
    var subject = 'Password Reset Request';
    var mailbody = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n'
                  + resetURL + '\n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n';
    Email.sendMail(to , subject, mailbody, function(respone) {
        if(respone.sent) {
            request.yar.flash('success', 'Reset link sent to your email');
            return reply.redirect('/forgot');
        } else {
            request.yar.flash('error', 'Email Error, Please try again later');
            return reply.redirect('/forgot');
        }
    });    
};
