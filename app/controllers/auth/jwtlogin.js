'use strict';
var Boom = require('boom');
var proxy = require('../../utils/proxy');
var JWT   = require('jsonwebtoken');
const Joi = require('joi');
const Config = require('../../../config/config');

exports.postCredentials = {
    description: 'jwt login',
    validate: {
        payload: {
            email: Joi.string().min(3).max(20).email().required(),
            password: Joi.string().min(6).max(20).required(),
            id: Joi.string().required()
        },
        failAction: function(request, reply, source, error) {
            // Username, passowrd minimum validation failed
            console.log('Username, Invalid username or password');
            return reply.redirect('/');
        }
    },
    handler: function(request, reply) {
        console.log('post jwt-login reached');
        proxy.externalAppLogin(request,reply,function(err,is_authenticated,msg){
            if(err){
               reply(Boom.unauthorized(msg));
            }
            if(is_authenticated){
                let secret = Config.get('/jwtAuthOptions/key');
                let obj   = { 
                             id:request.payload.id,
                             'username': request.payload.email
                            }; // object info you want to sign
                let jwtToken = JWT.sign(obj, secret, { expiresIn: '1 day' });
                reply({text: msg}).header('Authorization', jwtToken);
            }
        });
    },
    tags: ['api'] //swagger documentation
};