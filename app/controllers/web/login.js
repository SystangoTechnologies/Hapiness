'use strict';

const Mongoose = require('mongoose');
const Joi = require('joi');
const User = Mongoose.model('User');
const loginHelper = require('../../helpers/login');

exports.showForm = {
    description: 'Returns the login page',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: (request, h) => {  
        if (request.auth.isAuthenticated) {
            var userDetails = request.auth.credentials;
            return h.redirect('/dashboard', {user: userDetails});
        }
       return h.view('auth/login');
    }
};

exports.postForm = {
    description: 'Post to the login page',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    plugins: {
        crumb: {
            key: 'crumb',
            source: 'payload',
        }
    },
    validate: {
        payload: {
            email: Joi.string().min(3).email().required(),
            password: Joi.string().min(5).required()
        },
        failAction: (request, h, error) => {
            // Username, passowrd minimum validation failed
            request.yar.flash('error', error.details[0].message.replace(/['"]+/g, ''));
            return h.redirect('/').takeover();
        }
    },
    handler: async (request, h) => {  
        try {
            console.log('post login reached');
            if (request.auth.isAuthenticated) {
                return h.redirect('/dashboard');
            }
            let resultData = await loginHelper.findByCredentials(request.payload.email, request.payload.password); 
            if (resultData.statusCode === 200) {
                    request.cookieAuth.set(resultData.user);
                    return h.redirect('/dashboard');
            } else {
                    // User not fond in database
                    request.yar.flash('error', resultData.message);
                    return h.redirect('/');
             }
        } catch (error) {
                  // Boom bad implementation
            request.yar.flash('error', error.message);
            return h.redirect('/');
        }
    }

};
