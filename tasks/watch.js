'use strict';

const Gulp = require('gulp');
const Paths = require('../config/assets');

Gulp.task('watch', ['dev-build'], function() {
    Gulp.watch(Paths.get('/fonts'), ['fonts']);
    Gulp.watch(Paths.get('/styles'), ['styles']);
    Gulp.watch(Paths.get('/misc'), ['misc']);
    Gulp.watch(Paths.get('/images'), ['images']);
    // Js watch is done with webpack for performance
});
