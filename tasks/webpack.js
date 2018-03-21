'use strict';
const Gulp = require('gulp');
const Gutil = require('gulp-util');
const Webpack = require('webpack');
const path = require('path');

var webpackConfig = {
    entry: {
        vendor: ['jquery','bootstrap','chart.js'],
        app: path.join(__dirname, '../assets/scripts/index.js')
    },
    output: {
        path: path.join(__dirname, '../.build/js/'),
        filename: 'bundle.js'
    },
    cache: true,
    debug: false,
    devtool: 'cheap-module-source-map',
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            query: { compact: false },
            exclude: /(node_modules|bower_components)/
        }]
    },
    plugins: [
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            minChunks: 2
        }),
        new Webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'root.jQuery': 'jquery'
        })
    ]
};

// Webpack production build
Gulp.task('webpack:build', function() {

    var prodConfig = Object.create(webpackConfig);

    prodConfig.plugins = prodConfig.plugins.concat(
        new Webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react and other lib size
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new Webpack.optimize.DedupePlugin(),
        new Webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );

    Webpack(prodConfig, function(err, stats) {

        if (err) {
            throw new Gutil.PluginError('webpack', err);
        }
        Gutil.log('[webpack]', stats.toString({
            colors: true
        }));
    });
});


// Set dev config for webpack
var devConfig = Object.create(webpackConfig);
devConfig.devtool = 'sourcemap';
devConfig.debug = true;

// Create a single instance of the compiler to allow caching
var devCompiler = Webpack(devConfig);

Gulp.task('webpack:dev-build', function() {

    devCompiler.watch({}, function(err, stats) {
        if (err) {
            throw new Gutil.PluginError('webpack', err);
        }
        Gutil.log('[webpack:build-dev]', stats.toString({
            colors: true,
            chunks: false
        }));
    });
});
