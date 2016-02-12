var config = require('../config'),
  postcss = require('postcss'),
  fs = require('fs'),
  scss = require('postcss-scss'),
  reporter = require('postcss-reporter'),
  atImport = require("postcss-import"),
  cssnano = require('cssnano'),
  rucksack = require('rucksack-css'),
  precss = require('precss'),
  autoprefixer = require('autoprefixer');

  var cssstats = require('postcss-cssstats');

var processors = [
  atImport({
    path: ['./craft/templates'],
  }),
  rucksack(),
  precss(),
  autoprefixer(config.autoprefixerOptions),
  cssnano(),
  reporter()
];

function buildStyles(cb){
  fs.readFile(config.entry.style, function(err,data){
    postcss(processors)
    .process(data, {
      from: config.entry.style,
      to: config.output.style,
      syntax: scss,
      map: {
        inline: true
      }
    })
    .then(function (result) {
      fs.writeFile(config.output.style, result.css, function(){
        if (cb) cb(config.output.style)
        var size = fs.statSync(config.output.style)["size"]
        console.log('bundle.css',size/1000+'kb');
      });

    });
  })
}
module.exports = buildStyles;
