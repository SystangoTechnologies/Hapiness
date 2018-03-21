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
        type: String
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
UserSchema.pre('save', function (next) {
    if (this.password && this.isModified('password') && this.password.length >= 6) {
        this.salt = Crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return Crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'sha512').toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

Mongoose.model('User', UserSchema);