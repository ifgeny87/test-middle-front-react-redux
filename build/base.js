const webpack = require('webpack');
const { join } = require('path');

const config = require('./config');

module.exports = {
  mode: config.isProd ? 'production' : 'development',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [config.srcPath],
        use: ['babel-loader'],
      },
    ],
  },

  resolve: {
    alias: {
      utils: join(config.srcPath, 'utils'),
    },
    modules: ['node_modules'],
  },

  devtool: config.isDev ? 'eval-source-map' : 'source-map',

  plugins: [(() => {
    const plugins = [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') }),
    ];

    if (!config.isDev) {
      plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
    }

    return plugins;
  })],
};
