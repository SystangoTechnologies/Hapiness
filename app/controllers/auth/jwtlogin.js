'use strict';
var Boom = require('boom');
var proxy = require('../../utils/proxy');
var JWT   = require('jsonwebtoken');
const Joi = require('joi');
const Config = require('../../../config/config');
const Mongoose = require('mongoose');
const User = Mongoose.model('User');
const isThirdParty = require('config').get('api.login.isThirdParty');

exports.postCredentials = {
    description: 'jwt login',
    validate: {
        headers: Joi.object({
            auth_id: Joi.string().required()
        }).unknown(),
        payload: {
            email: Joi.string().min(3).email().required(),
            password: Joi.string().min(5).required()
        },
        failAction: function(request, reply, source, error) {
            // Username, passowrd minimum validation failed
            console.log('Validation failed' + error.data.details[0].message);
            return reply({ status: 0, msg: error.data.details[0].message.replace(/['"]+/g, '') });
        }
    },
    handler: function(request, reply) {
        console.log('post jwt-login reached');
        if(isThirdParty) {
            proxy.externalAppLogin(request,reply,function(err,is_authenticated,msg){
                if(err){
                   reply(Boom.unauthorized(msg));
                }
                if(is_authenticated){
                    let secret = Config.get('/jwtAuthOptions/key');
                    let obj = {
                        auth_id: request.headers.auth_id,
                        'username': request.payload.email
                    }; // object info you want to sign
                    let jwtToken = JWT.sign(obj, secret, { expiresIn: '1 day' });
                    reply({text: msg}).header('Authorization', jwtToken);
                }
            });
        } else {
            User.findByCredentials(request.payload.email, request.payload.password, function(err, user, msg) {
                if (err) {
                    // Boom bad implementation
                    return reply({ status: 0, msg: 'An internal server error occurred' });
                }
                if (user) {
                    let secret = Config.get('/jwtAuthOptions/key');
                    let obj = {
                        auth_id: request.headers.auth_id,
                        'username': request.payload.email
                    }; // object info you want to sign
                    let jwtToken = JWT.sign(obj, secret, { expiresIn: '1 day' });
                    reply({ status: 1, msg: 'success' }).header('Authorization', jwtToken);
                } else {
                    // User not found in database
                    return reply({ status: 0, msg: 'Incorrect Credentials' });
                }
            });
        }
    },
    tags: ['api'] //swagger documentation
};