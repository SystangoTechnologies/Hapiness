'use strict';

const Gulp = require('gulp');
var forever = require('forever-monitor');

Gulp.task('forever', (cb) => {
    new forever.Monitor('server.js').start();
});