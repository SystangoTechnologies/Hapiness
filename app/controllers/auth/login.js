'use strict';

const Mongoose = require('mongoose');
const Joi = require('joi');
const User = Mongoose.model('User');

exports.showForm = {
    description: 'Returns the login page',
    auth: {
        mode: 'try',
        strategy: 'standard'
    },
    handler: function(request, reply) {

        if (request.auth.isAuthenticated) {
            var userDetails = request.auth.credentials;
            return reply.redirect('/dashboard', {user: userDetails});
        }
        reply.view('auth/login');

    },
    tags: ['api'] //swagger documentation
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
        failAction: function(request, reply, source, error) {
            console.log('Username, passowrd minimum validation failed');
            // Username, passowrd minimum validation failed
            request.yar.flash('error', 'Invalid username or password');
            return reply.redirect('/');
        }
    },
    handler: function(request, reply) {
        console.log('post login reached');
        if (request.auth.isAuthenticated) {
            return reply.redirect('/dashboard');
        }

        User.findByCredentials(request.payload.email, request.payload.password, function(err, user, msg) {
            if (err) {
                // Boom bad implementation
                request.yar.flash('error', 'An internal server error occurred');
                return reply.redirect('/');
            }
            if (user) {
                request.cookieAuth.set(user);
                return reply.redirect('/dashboard');
            } else {
                // User not fond in database
                request.yar.flash('error', 'Invalid username or password');
                return reply.redirect('/');
            }
        });

    },
    tags: ['api'] //swagger documentation
};
