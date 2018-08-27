const { join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const uglifyJs = require('uglify-js');
const uglifyCss = require('uglifycss');

const config = require('./config');
const base = require('./base');

const extractStyles = new ExtractTextPlugin({
  filename: 'styles/[name].[hash].css',
  allChunks: true,
  disable: config.isDev, // disable hot reload
});


// Plugins
// -------


const plugins = base.plugins.concat(
  extractStyles,
  [
    new HtmlWebpackPlugin({
      template: join(config.srcPath, 'frontend', 'index.html'),
      filename: './index.html',
      inject: true,
      minify: { collapseWhitespace: config.isProd },
    }),
  ],
);
if (config.isDev) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoEmitOnErrorsPlugin());
  plugins.push(new webpack.NamedModulesPlugin());
} else {
  plugins.push(new CopyWebpackPlugin([{
    from: join(config.srcPath, 'public', 'assets'),
    to: '../public/assets',
    transform: (fileContent, filePath) => {
      if (filePath.match(/\.js$/)) {
        return uglifyJs.minify(fileContent.toString()).code.toString();
      }
      if (filePath.match(/\.css$/)) {
        return uglifyCss.processString(fileContent.toString(), { debug: config.dev, expandVars: true });
      }
      return fileContent;
    },
  }]));
}


// Build the configuration
// =======================


const webpackConfig = Object.assign({}, base, {
  context: join(config.srcPath, 'frontend'),

  entry: (() => {
    const entry = {
      frontend: [
        './index',
      ],
    };
    if (config.isDev) {
      entry.frontend.unshift(
        'webpack/hot/dev-server', // try: webpack/hot/only-dev-server
        'webpack-hot-middleware/client.js?path=/__webpack_hmr',
      );
    }
    return entry;
  }),

  output: {
    filename: config.isDev ? '[name].js' : '[name].[chunkhash].js',
    path: join(config.distPath, 'public'),
    publicPath: '/',
  },

  resolve: {
    alias: Object.assign({}, base.resolve.alias, {
      frontend: join(config.srcPath, 'frontend'),
    }),
  },

  module: Object.assign({}, base.module, {
    rules: base.module.rules.concat([
      {
        test: /\.(sass|scss)$/,
        loader: extractStyles.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: {
                  autoprefixer: {
                    add: true,
                    remove: true,
                    browsers: ['last 2 versions'],
                  },
                  discardComments: {
                    removeAll: true,
                  },
                  discardUnused: false,
                  mergeIdens: false,
                  reduceIdents: false,
                  safe: true,
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [join(config.srcPath, 'frontend', 'styles')],
              },
            },
          ],
        }),
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: ['svg-inline-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['url-loader'],
      },
    ]),
  }),

  plugins,

  devServer: {
    historyApiFallback: true,
    host: 'localhost',
    port: process.env.FRONTEND_PORT || 3000,
    hot: true,
    inline: true,
    proxy: {
      '^/api/*': {
        secure: false,
        target: `http://localhost:${process.env.MIDDLE_PORT}/api/`,
      },
    },
  },
});


// Fonts rules
// -----------


[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  ['svg', 'image/svg+xml'],
].forEach((font) => {
  const extension = font[0];
  const mimetype = font[1];

  webpackConfig.module.rules.push({
    test: new RegExp(`\\.${extension}$`),
    loader: 'url-loader',
    options: {
      name: 'fonts/[name].[ext]',
      limit: 10000,
      mimetype,
    },
  });
});


// Bundle splitting
// ----------------


if (!config.isTest) {
  if (config.vendors && config.vendors.length) {
    webpackConfig.entry.vendor = config.vendors;
  }
  webpackConfig.optimization = Object.assign(webpackConfig.optimization || {}, {
    runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
          minSize: 1,
          reuseExistingChunk: true,
        },
      },
    },
  });
}


// Production Optimizations
// ------------------------


if (config.isProd) {
  webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }));
  webpackConfig.optimization.minimizer = [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: false,
      uglifyOptions: {
        beautify: false,
        comments: false,
        compress: {
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
        ecma: 6,
        keep_classnames: true,
        keep_fnames: false,
        mangle: true,
        toplevel: false,
        warning: 'verbose',
      },
    }),
  ];
}

module.exports = webpackConfig;
