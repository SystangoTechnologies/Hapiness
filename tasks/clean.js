'use strict';

const Gulp = require('gulp');
const Del = require('del');

Gulp.task('clean', function() {

    Del('.build').then(function(paths) {
        console.log('Deleted files/folders:\n', paths);
    });
});
