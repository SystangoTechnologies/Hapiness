'use strict';
const Mongoose = require('mongoose');
const User = Mongoose.model('User');
const Joi = require('joi');
const Email = require('./email');


//get admin profile page
exports.showProfile = {
    description: 'Returns the dashboard',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: async (request, h) => {
        if (request.auth.isAuthenticated) {
            var user = {
                email: request.auth.credentials.email,
                name: request.auth.credentials.name
            };
            return h.view('profile/profile', {
                user: user
            });
        } else {
            return h.redirect('/');
        }
    },
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
         failAction: (request, h, error) => {
            request.yar.flash('error', error.details[0].message);
            return h.redirect('/setting').takeover();
        }
    },
    handler: async (request, h) => {
        // Edit profile controller here.
        return h.redirect('/profile');
    },
    tags: ['alias'] //swagger documentation
};

