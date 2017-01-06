'use strict';

const Gulp = require('gulp');
const RequireDir = require('require-dir');

// Load tasks
RequireDir('./tasks');


//  Build task definitions
Gulp.task('prod-build', ['fonts', 'images', 'misc', 'styles', 'webpack:build', 'lint']);
Gulp.task('dev-build', ['fonts', 'images', 'misc', 'styles', 'webpack:dev-build', 'lint']);

Gulp.task('dev', ['dotenv','dev-build', 'watch', 'nodemon']);
Gulp.task('prod', ['dotenv','prod-build','pm2']); // 'dotenv' should be removed from prod task in a production environment.

Gulp.task('default', ['dev']);
