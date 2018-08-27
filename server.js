#!/usr/bin/env node


// Init Env
// ========


function printAndGetEnv(key, defaultValue) {
  const v1 = process.env[key];
  if (v1) {
    global.console.log(`🔹 ${key} is "${v1}"`);
    return v1;
  }
  process.env[key] = defaultValue;
  global.console.log(`🔹 ${key} is "${v1}", set to default value "${defaultValue}"`);
  return defaultValue;
}

printAndGetEnv('NODE_ENV', 'development');
const PORT = printAndGetEnv('PORT', 3000);
printAndGetEnv('FRONTEND_PORT', process.env.PORT * 1 + 1);


// Require modules and configuration
// =================================


const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const express = require('express');

const config = require('./build/config');
const frontendConfig = require('./build/webpack.config.frontend');


// Make and run dev server
// =======================


const frontendCompiler = webpack(frontendConfig);

if (config.isDev) {
  const devServer = express();
  devServer.use(WebpackDevMiddleware(frontendCompiler, {
    historyApiFallback: true,
    publicPath: frontendConfig.output.publicPath,
  }));
  devServer.use(WebpackHotMiddleware(frontendCompiler, {
    path: '/__webpack_hmr',
    heartbeat: 10000,
  }));

  require('./src/webserver/init')(PORT, devServer);
} else if (config.isProd) {
  const webserverConfig = require('./build/webpack.config.webserver');
  const webserverCompiler = webpack(webserverConfig);

  const foo = (name, compiler) => {
    compiler.run((err, stats) => {
      const length = stats.endTime - stats.startTime;
      global.console.log(`${name} build finished in ${length} ms`);
      if (err) {
        return global.console.error(`🔴 ${name} reject with err=`, err);
      }
      if (stats.compilation.errors && stats.compilation.errors.length) {
        return global.console.error(`🔴 ${name} has errors=`, stats.compilation.errors);
      }
    });
  };

  foo('Frontend', frontendCompiler);
  foo('Webserver', webserverCompiler);
}
