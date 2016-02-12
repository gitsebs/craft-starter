var config = require('../config'),
    webpack = require('webpack'),
    rollup = require('rollup')

var babel = require('rollup-plugin-babel')
var uglify = require('rollup-plugin-uglify')

config.webpack.entry = config.entry.script
config.webpack.output = {
  path: config.output.path,
  filename: config.output.script
}

function buildScripts(cb){

  config.webpack.plugins[3] = (function(){
    this.plugin('done',function(stats){
      var stats = stats.toJson();
      console.log(stats.assets[0].name,stats.assets[0].size/1000+'kb',stats.time+'ms');
      if (cb) cb(config.output.path + config.output.script);
    })
  })

  webpack(config.webpack, function(err, stats) {
      //Done
    }
  )
}

module.exports = buildScripts;
