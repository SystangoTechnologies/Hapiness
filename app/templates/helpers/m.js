'use strict';

/* Manifest file reader for grabbing new static assets */
var manifest;
try {
    manifest = require('../../../.build/rev-manifest');
} catch (err){
    manifest = {};
}
module.exports = function m(filename) {
  return manifest[filename];
};
