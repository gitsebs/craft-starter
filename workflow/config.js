var webpack = require('webpack');
module.exports = {
  proxyPaths:['**', '!/assets/**/*'],
  domain: 'craft.dev',
  port: 3333,
  entry: {
    style: './craft/templates/vars.scss',
    script: './craft/templates/_index.js',
  },
  output: {
    path: './assets/',
    style: './assets/bundle.css',
    script: 'bundle.js'
  },
  watch: './craft/templates',
  autoprefixerOptions: {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
  },
  webpack: {
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] }
      ]
    }
    }
}
