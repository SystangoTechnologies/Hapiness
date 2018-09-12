'use strict';

const Gulp = require('gulp');
const RequireDir = require('require-dir');
RequireDir('./tasks'); // Load tasks


//  Build task definitions
Gulp.task('dev-build', ['fonts', 'images', 'misc', 'styles', 'webpack:dev-build', 'lint']);
Gulp.task('dev', ['dotenv','dev-build', 'watch', 'nodemon']);

Gulp.task('prod-build', ['fonts','images', 'misc', 'styles', 'webpack:build']);
Gulp.task('prod', ['prod-build', 'forever']);

Gulp.task('default', ['prod']);