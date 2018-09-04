const { join } = require('path')

const rootPath = join(__dirname, '..')

const isProd = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

module.exports = {
  rootPath,
  srcPath: join(rootPath, 'src'),
  distPath: join(rootPath, 'dist'),
  isProd,
  isTest,
  isDev: !isProd && !isTest,
  vendors: [
    'react',
    'react-dom',
    'react-router'
  ]
}
