'use strict';

var Gulp = require('gulp');
var RevAll = require('gulp-rev-all');


Gulp.task('rev', ['styles'], function() {
    return Gulp.src(['.build/css/index.css'])
        .pipe(RevAll.revision())
        .pipe(Gulp.dest('.build'))
        .pipe(RevAll.manifestFile())
        .pipe(Gulp.dest('.build'));
});
