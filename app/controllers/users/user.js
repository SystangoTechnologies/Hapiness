const Mongoose = require('mongoose');
const User = Mongoose.model('User');
const Joi = require('joi');
const Email = require('../email/email');

//Controller for web api

//get admin password change page
exports.setting = {
    description: 'Setting page',
    handler: function(request, reply) {
        reply.view('setting/setting');

    }
};

//get admin profile page
exports.showProfile = {
    description: 'Returns the dashboard',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: function(request, reply) {

        if (request.auth.isAuthenticated) {
            var user = {
                email: request.auth.credentials.email,
                name: request.auth.credentials.name
            };
            reply.view('profile/profile', {
                user: user
            });
        } else {
            return reply.redirect('/');
        }
    },
    tags: ['api'] //swagger documentation
};

//change admin password
exports.changePassword = {
    description: 'Update the User Password',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    validate: {
        payload: {
            oldPassword: Joi.string().min(6).max(20).required(),
            newPassword: Joi.string().min(6).max(20).required(),
            confirmNewPassword: Joi.string().min(6).max(20).required()
        },
        failAction: function(request, reply, source, error) {
            request.yar.flash('error', error.data.details[0].message);
            return reply.redirect('/setting');
        }
    },
    handler: function(request, reply) {
        var old_pwd = request.payload.oldPassword;
        var new_pwd = request.payload.newPassword;
        if (request.payload.newPassword !== request.payload.confirmNewPassword) {
            request.yar.flash('error', 'Password does not match');
            return reply.redirect('/setting');
        }
        //verify and update password from user table
        User.updatePassword(request, reply, old_pwd, new_pwd);
    },
    tags: ['alias'] //swagger documentation
};

//edit admin profile
exports.editProfile = {
    description: 'Edit the User profile',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    validate: {
        payload: {
            name: Joi.string().required(),
        },
        failAction: function(request, reply, source, error) {
            request.yar.flash('error', error.data.details[0].message);
            return reply.redirect('/setting');
        }
    },
    handler: function(request, reply) {
        var old_pwd = request.payload.oldPassword;
        var new_pwd = request.payload.newPassword;
        if (request.payload.newPassword !== request.payload.confirmNewPassword) {
            request.yar.flash('error', 'Password does not match');
            return reply.redirect('/setting');
        }
        //verify and update password from user table
        User.updatePassword(request, reply, old_pwd, new_pwd);
    },
    tags: ['alias'] //swagger documentation
};

exports.showForgotPassword = {
    description: 'Forgot Password Page',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: function(request, reply) {
        reply.view('forgotPassword/forgotPassword');
    }
};

//Send Email to User for Password Reset
exports.sendPasswordResetLink = {
    description: 'Send Email to User for Password Reset',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    validate: {
        payload: {
            email: Joi.string().email().required()
        },
        failAction: function(request, reply, source, error) {
            request.yar.flash('error', error.data.details[0].message);
            return reply.redirect('/forgot');
        }
    },
    handler: function(request, reply) {
        var email = request.payload.email;
        User.generateResetPasswordToken(request, reply, email)
        .then(Email.sentForgotPasswordMail);
    }
};

//Show reset password form
exports.showResetPassword = {
    description: 'Show reset password form',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    validate: {
        params: {
            token: Joi.string().token().required()
        },
        failAction: function(request, reply, source, error) {
            request.yar.flash('error', error.data.details[0].message);
            return reply.redirect('/forgot');
        }
    },
    handler: function(request, reply) {
        var token = request.params.token;
        reply.view('forgotPassword/resetPassword', {'token':token});
    }
};

//Reset the user Password
exports.resetPassword = {
    description: 'Reset the user password',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    validate: {
        payload: {
            newPassword: Joi.string().min(6).max(20).required(),
            confirmNewPassword: Joi.string().min(6).max(20).required(),
            token: Joi.string().required()
        },
        failAction: function(request, reply, source, error) {
            request.yar.flash('error', error.data.details[0].message.replace(/['"]+/g, ''));
            return reply.redirect('/reset/'+request.payload.token);
        }
    },
    handler: function(request, reply) {
        var newPwd = request.payload.newPassword;
        var token = request.payload.token;
        if (newPwd !== request.payload.confirmNewPassword) {
            request.yar.flash('error', 'Password does not match');
            return reply.redirect('/reset/'+token);
        }
        //verify and update password from user table
        User.resetForgotPassword(request, reply, newPwd, token)
        .then(function(message){
            request.yar.flash('success', message);
            return reply.redirect('/login');
        })
        .catch(function(error){
            request.yar.flash('error', error);
            return reply.redirect('/reset/'+token);
        });
    }
};
