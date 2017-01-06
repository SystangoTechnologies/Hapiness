'use strict';

exports.css = {
    directory: {
        path: '.build/css'
    }
};

exports.img = {
    directory: {
        path: '.build/images'
    }
};

exports.js = {
    directory: {
        path: '.build/js'
    }
};
exports.fonts = {
    directory: {
        path: '.build/fonts'
    }
};

exports.favicon = {
    file: '.build/favicon.ico'
};

exports.heartbeat = {
    auth: false,
    handler: function(request, reply) {
        reply('OK');
    }
};
