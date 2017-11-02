'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Crypto = require('crypto');
const Nodemailer = require('nodemailer');
//const gmailConfig = require('config').get('email.gmail');
const Promise = require('promise');

/**
 * User Schema
 */
var UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    badges: {
        type: String
    },
    score: {
        type: Number
    },
    salt: {
        type: String
    },
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user']
    },
    resetPasswordToken: {
        type : String   
    },
    resetPasswordExpires: {
        type: Date   
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
    if (this.password && this.isModified('password') && this.password.length >= 6) {
        this.salt = Crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return Crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'sha512').toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

UserSchema.statics.findByCredentials = function(username, password, callback) {

    var self = this;
    var query = {};
    if (username.indexOf('@') > -1) {
        query.email = username.toLowerCase();
    } else {
        query.username = username.toLowerCase();
    }

    self.findOne(query, function(err, user) {
        if (err) {
            return callback(err);
        }
        if (!user || !user.authenticate(password)) {
            return callback(null, false, {
                message: 'Invalid username or password'
            });
        }

        return callback(null, user);
    });
};

UserSchema.statics.updatePassword = function(request, reply, old_pwd, new_pwd) {
    var self = this;
    self.findOne({ email: request.auth.credentials.email }, function(err, user) {
        if (err) {
            request.yar.flash('error', 'Mongo error');
            return reply.redirect('/setting');
        }
        if (!user || !user.authenticate(old_pwd)) {
            request.yar.flash('error', 'incorrect current password');
            reply.redirect('/setting');
        } else {
            //save new password
            user.password = new_pwd;
            user.save(function(err) {
                if (err) {
                    // Boom bad implementation
                    request.yar.flash('error', 'An internal server error occurred');
                    return reply.redirect('/setting');
                } else {
                    request.cookieAuth.set(user);
                    request.yar.flash('success', 'Password updated successfully!');
                    reply.redirect('/setting');
                }
            });
        }
    });
};

UserSchema.statics.generateResetPasswordToken = function(email) {
    var self = this;
    return new Promise(function(resolve, reject){
        self.findOne({ email: email }, function(err, user) {
            if (err) {
                return reject(err);
            }
            if (!user) {
                return reject('No  User Exists for Given Email');
            } else {
                var token = Crypto.randomBytes(20).toString('hex');
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    if(err) {
                        return reject(err);
                    }
                    return resolve({
                        to:email,
                        token: token
                    }); 
                });
            }
        });
    });   
};

UserSchema.statics.resetForgotPassword = function(request, reply, newPassword, token) {
    var self = this;
    return new Promise(function(resolve, reject){
        self.findOne({ resetPasswordToken: token }, function(err, user) {
            if (err) {
                return reject(err);
            }
            if (!user) {
                return reject('Invalid Token');
            } else {
                var expireTime = user.resetPasswordExpires;
                var currentTime = Date.now();

                if(currentTime > expireTime) {
                    return reject('Reset password link expired.');
                } else {
                    //save new password
                    user.password = newPassword;
                    user.resetPasswordToken = null;
                    user.resetPasswordExpires = null;
                    user.save(function(err) {
                        if (err) {
                            // Boom bad implementation
                            return reject(err);
                        } else {
                            return resolve('Password updated successfully');
                        }
                    });
                }
            }
        });
    });
};

Mongoose.model('User', UserSchema);
