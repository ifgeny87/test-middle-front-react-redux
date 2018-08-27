const express = require('express');
const path = require('path');

const isProd = !process.env.NODE_ENV || process.env.NODE_ENV === 'production';

const checkToken = (req, res, next) => {
  next();
};

const getConfig = (req, res) => {
  res.json({
    uptime: +Date.now(),
    url: 'http://ya.ru',
  });
};

module.exports = function init(port, app) {
  if (!app) app = require('express')();

  app.use('/api/ping', (req, res) => res.json({
    pong: new Date().toUTCString(),
  }));

  app.get('/api/config', [checkToken, getConfig]);

  if (isProd) {
    const rootPath = path.dirname(process.mainModule.filename);
    const publicPath = path.join(rootPath, 'public');
    global.console.log('📒 use static in', publicPath);
    app.use(express.static(publicPath));
  }

  app.listen(port, (err) => {
    if (err) {
      global.console.error('🔴 Error while listening middle', err);
    } else {
      global.console.log(`🌎 Listening middle to http://localhost:${port}`);
    }
  });
};
