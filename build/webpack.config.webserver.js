const { join } = require('path');

const config = require('./config');
const base = require('./base');

module.exports = Object.assign({}, base, {
  context: join(config.srcPath, 'webserver'),

  entry: {
    webserver: [
      './index',
    ],
  },

  output: {
    path: config.distPath,
    filename: 'webserver.js',
    publicPath: '/',
  },

  resolve: {
    alias: Object.assign({}, base.resolve.alias, {
      webserver: join(config.srcPath, 'webserver'),
    }),
  },

  target: 'node',
});
