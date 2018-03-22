'use strict';

const Mongoose = require('mongoose');
const Joi = require('joi');
const Boom = require('boom');
const User = Mongoose.model('User');

exports.showForm = {
    description: 'Returns the signup page',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: (request, h) => {  
        if (request.auth.isAuthenticated) {
            var userDetails = request.auth.credentials;
            return h.redirect('/dashboard', {user: userDetails});
        }
       return h.view('auth/signup');
    }
};

exports.postForm = {
    description: 'Submit the signup page',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    validate: {
        payload: {
            name: Joi.string().required(),
            password: Joi.string().min(6).max(20).required(),
            verify: Joi.string().required(),
            email: Joi.string().email().required()
        },
        failAction: (request, h, error) => {
            // Boom bad request
            console.log('Validation Failed');
            request.yar.flash('error', error.details[0].message.replace(/['"]+/g, ''));
            return h.redirect('/signup').takeover();
        }
    },
    handler: async (request, h) => {
        try {

            if (request.auth.isAuthenticated) {
                // Redirect to dashboard if already logged in.
                return h.redirect('/dashboard');
            }
            if (request.payload.password !== request.payload.verify) {
                // password did not match
                request.yar.flash('error', 'Password does not match');
                return h.redirect('/signup');
            }
            // Although Joi does not allow any extra parameter.
            // This is just to safe check any dev/human error.
            var user = new User({
                name: request.payload.name,
                password: request.payload.password,
                email: request.payload.email,
            });
            // Then save the user
            let userData = await user.save();
            request.cookieAuth.set(user);
            return h.redirect('/dashboard');
        } catch (error) {
            if (error.code === 11000) {
                console.log('Email already exists.');
                request.yar.flash('error', 'Email already exists.');
            } else {
                // Boom bad implementation
                console.log('An internal server error occurred');
                request.yar.flash('error', error.message);
            }
            return h.redirect('/signup');
        }  
    }
};