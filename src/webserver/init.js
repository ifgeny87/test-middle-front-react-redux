const express = require('express')
const { dirname, join } = require('path')

const isProd = !process.env.NODE_ENV || process.env.NODE_ENV === 'production'

const checkToken = (req, res, next) => {
  next()
}

const getConfig = (req, res) => {
  res.json({
    uptime: +Date.now(),
    url: 'http://ya.ru'
  })
}

module.exports = function init (port, app) {
  if (!app) app = require('express')()

  app.use('/api/ping', (req, res) => res.json({
    pong: new Date().toUTCString()
  }))

  app.get('/api/config', [checkToken, getConfig])

  const publicPath = isProd
    ? join(dirname(process.mainModule.filename), 'public')
    : join(__dirname, '..', 'public')
  global.console.log('📒 use static in', publicPath)
  app.use(express.static(publicPath))

  app.listen(port, (err) => {
    if (err) {
      global.console.error('🔴 Error while listening middle', err)
    } else {
      global.console.log(`🌎 Listening middle to http://localhost:${port}`)
    }
  })
}
