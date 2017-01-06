'use strict';

var Gulp = require('gulp');
var RevAll = require('gulp-rev-all');

var revAll = new RevAll();

Gulp.task('rev', ['styles'], function() {
    return Gulp.src(['.build/css/index.css'])
        .pipe(revAll.revision())
        .pipe(Gulp.dest('.build'))
        .pipe(revAll.manifestFile())
        .pipe(Gulp.dest('.build'));
});
