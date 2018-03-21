
const Mongoose = require('mongoose');
const User = Mongoose.model('User');
const Joi = require('joi');
const Email = require('../email/email');
const settingHelper = require('../../../helpers/setting');

//get admin password change page
exports.setting = {
    description: 'Setting page',
    handler: async (request, h) => {
       return h.view('setting/setting');
    }
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
         failAction: (request, h, error) => {
            request.yar.flash('error', error.details[0].message);
            return h.redirect('/setting').takeover();
        }
    },
    handler: async (request, h) => {
        try {
            var old_pwd = request.payload.oldPassword;
            var new_pwd = request.payload.newPassword;
            if (request.payload.newPassword !== request.payload.confirmNewPassword) {
                request.yar.flash('error', 'Password does not match');
                return h.redirect('/setting');
            }
            //verify and update password from user table
           let data = await settingHelper.updatePassword(request, old_pwd, new_pwd);
           if(data.statusCode === 200){
             request.yar.flash('success', data.message);
             return h.redirect('/logout');
           }else{
            request.yar.flash('error', data.message);
            return h.redirect('/logout');  
           }
        } catch (error) {
            request.yar.flash('error', error.message);
            return h.redirect('/setting');
        }
    },
    tags: ['alias'] //swagger documentation
};


exports.showForgotPassword = {
    description: 'Forgot Password Page',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: async (request, h) => {
       return h.view('forgotPassword/forgotPassword');
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
         failAction: (request, h, error) => {
            request.yar.flash('error', error.details[0].message);
            return h.redirect('/forgot').takeover();
        }
    },
    handler: async (request, h) => {
        try {
            var email = request.payload.email;
            let data = await settingHelper.generateResetPasswordToken(email);
            var baseURL = request.connection.info.uri;
            let message = await Email.sentForgotPasswordMail(data, baseURL);
            request.yar.flash('success', message);
            return h.redirect('/forgot');
        } catch (error) {
            request.yar.flash('error', error);
            return h.redirect('/forgot');
        }
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
         failAction: (request, h, error) => {
            request.yar.flash('error', error.details[0].message);
            return h.redirect('/forgot').takeover();
        }
    },
    handler: async (request, h) => {
        var token = request.params.token;
        return h.view('forgotPassword/resetPassword', {'token':token});
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
         failAction: (request, h, error) => {
            request.yar.flash('error', error.details[0].message.replace(/['"]+/g, ''));
            return h.redirect('/reset/'+request.payload.token).takeover();
        }
    },
    handler: async (request, h) => {
        var newPwd = request.payload.newPassword;
        var token = request.payload.token;
        try {
            if (newPwd !== request.payload.confirmNewPassword) {
                request.yar.flash('error', 'Password does not match');
                return h.redirect('/reset/'+token);
            }
            //verify and update password from user table
            let data = await settingHelper.resetForgotPassword(request, newPwd, token);
            request.yar.flash('success', data);
            return h.redirect('/login');  
        } catch (error) {
            request.yar.flash('error', error);
            return h.redirect('/reset/'+token);
        }
    }
};
