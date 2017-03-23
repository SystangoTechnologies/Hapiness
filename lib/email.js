'use strict';

const Nodemailer = require('nodemailer');

exports.register = function(plugin, options, next) {
    const smtpTransport = Nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: options.email,
          pass: options.password
        }
    });

    exports.sendMail = function mail(to, subject, mailbody, response){
        var from = options.senderName+' Team<' + options.senderEmail + '>';
        var mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: mailbody
        };
        var responseObject = {};
        smtpTransport.sendMail(mailOptions, function(err) {
            if (err) {
                return response({
                    sent: false,
                    msg: err
                });
            }
            return response({
                sent: true
            });
        });
    };
    next();
};

exports.register.attributes = {
    name: 'email',
    version: require('../package.json').version
};
