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
    handler: function(request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/dashboard');
        }
        console.log('auth/signup');
        reply.view('auth/signup');
    },
    tags: ['api'] //swagger documentation
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
        failAction: function(request, reply, source, error) {
            // Boom bad request
            console.log('Validation Failed');
            request.yar.flash('error', 'Bad request');
            return reply.redirect('/signup');
        }
    },
    handler: function(request, reply) {
        if (request.auth.isAuthenticated) {
            console.log('account');
            return reply.redirect('/dashboard');
        }
        if (request.payload.password !== request.payload.verify) {
            console.log('Password does not match');
            request.yar.flash('error', 'Password does not match');
            return reply.redirect('/signup');
        }
        // Although Joi does not allow any extra parameter.
        // This is just to safe check any dev/human error.
        var user = new User({
            name: request.payload.name,
            password: request.payload.password,
            email: request.payload.email,
        });

        // Then save the user
        user.save(function(err) {
            if (err) {
                if (err.code === 11000) {
                    console.log('Email already exists.');
                    request.yar.flash('error', 'Email already exists.');
                } else {
                    // Boom bad implementation
                    console.log('An internal server error occurred');
                    request.yar.flash('error', 'An internal server error occurred');
                }
                return reply.redirect('/signup');

            } else {
                console.log('request.cookieAuth.set(user)');
                request.cookieAuth.set(user);
                return reply.redirect('/dashboard');
            }
        });

    },
    tags: ['api'] //swagger documentation
};