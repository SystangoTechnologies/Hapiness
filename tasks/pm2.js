'use strict';
const Gulp = require('gulp');
const pm2 = require('pm2');

Gulp.task('pm2', function() {

    pm2.connect(true,function(err) {
        if (err) {
            console.error(err);
            process.exit(2);
        }
        pm2.start({
            name: 'Hapiness',
            script    : 'server.js',      // Script to be run
            exec_mode : 'cluster',        // Allow your app to be clustered
            instances : 4,                // Optional: Scale your app by 4
            max_memory_restart : '500M'   // Optional: Restart your app if it reaches 100Mo
        }, function(err, apps) {
            pm2.disconnect();   // Disconnect from PM2
            if (err) {
                throw err;
            }
        });
    });
});
