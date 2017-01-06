'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Crypto = require('crypto');

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
        return Crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
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


Mongoose.model('User', UserSchema);
