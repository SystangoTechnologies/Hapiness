'use strict';

const Gulp = require('gulp');
const Eslint = require('gulp-eslint');

const Paths = require('../config/assets');

Gulp.task('lint', function() {
    return Gulp.src(Paths.get('/lint'))
        .pipe(Eslint())
        .pipe(Eslint.format())
        .pipe(Eslint.failAfterError());
});
