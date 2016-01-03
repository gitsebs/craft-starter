var webpack = require('webpack');
var path = require('path');

var logger = require('./utils/log')

module.exports = {
  devtool: 'source-map',
  entry: [
    './craft/templates/_index.js'
  ],
  output: {
    path: require('path').join(__dirname, 'assets'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    function(){
      this.plugin('invalid', function(){
        logger.warn('webpack','Building JS');
      })
      this.plugin('done',function(stats){
        logger.log('webpack','Finished JS',stats.endTime-stats.startTime+'ms');
      })
    }
  ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] }
    ]
  }
}
