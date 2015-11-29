var webpack = require('webpack');
var path = require('path');

module.exports = {
  // debug: true,
  devtool: '#eval-source-map',
  // context: path.join(__dirname, 'assets'),

  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './craft/templates/_index'
  ],

  output: {
    path: path.join(__dirname, 'assets'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['monkey-hot','babel'] }
    ]
  }
}
