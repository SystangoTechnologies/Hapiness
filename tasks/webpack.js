'use strict';
const Gulp = require('gulp');
const Gutil = require('gulp-util');
const Webpack = require('webpack');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const NODE_ENV = process.env.NODE_ENV;
const setPath = function(folderName) {
  return path.join(__dirname, folderName);
};
const isProd = function() {
  return (process.env.NODE_ENV === 'production') ? true : false;
};
const buildingForLocal = () => {
  return (NODE_ENV === 'development');
};
const setPublicPath = () => {
  let env = NODE_ENV;
  if (env === 'production') {
    return 'https://your-host.com/production/';
  } else if (env === 'staging') {
    return 'https://your-host.com/staging/';
  } else {
    return '/';
  }
};


var webpackConfig = {
  /**
   * You can use these too for bigger projects. For now it is 0 conf mode for me!
   */
  entry: {
    vendor: ['jquery','bootstrap','chart.js'],
    app: path.join(setPath('../assets/scripts'), 'index.js')
  },
  output: {
    path:  setPath('../.build/js'),
    filename: 'bundle.js'
  }, 
  optimization:{
    runtimeChunk: false,
    splitChunks: {
      name: 'vendor',
      filename: 'vendor.js',
      minChunks: 2
    }
  },
  resolveLoader: {
    modules: [setPath('node_modules')]
  },
  mode: buildingForLocal() ? 'development' : 'production',
  devServer: {
    historyApiFallback: true,
    noInfo: false
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        isStaging: (NODE_ENV === 'development' || NODE_ENV === 'staging'),
        NODE_ENV: '"'+NODE_ENV+'"'
      }
    })
  ],
  loader: 
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: { compact: false },
        exclude: /(node_modules|bower_components)/
    },
//    module: {
//         rules: [
//         {
//             test: /\.jsx?$/,
//             loader: 'babel-loader',
//             query: { compact: false },
//             exclude: /(node_modules|bower_components)/
//         }
//         ]
//     }
};

// Webpack production build
Gulp.task('webpack:build', function() {
    var prodConfig = webpackConfig;

    prodConfig.plugins = prodConfig.plugins.concat(
        new Webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react and other lib size
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new Webpack.optimize.DedupePlugin(),
        // new Webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
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
webpackConfig.devtool = 'sourcemap';
// Create a single instance of the compiler to allow caching
var devCompiler = Webpack(webpackConfig);
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
