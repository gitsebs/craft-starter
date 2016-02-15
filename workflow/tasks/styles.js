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

var chalk = require('chalk');

var processors = [
  atImport({
    path: ['./craft/templates'],
  }),
  rucksack(),
  precss(),
  autoprefixer(config.autoprefixerOptions),
  cssnano(),
  reporter({
    throwError:true
  })
];

function buildStyles(cb){
  fs.readFile(config.entry.style, function(err,data){
    postcss(processors)
    .process(data, {
      from: config.entry.style,
      to: config.output.style,
      syntax: scss,
      map: {
        inline: process.env.NODE_ENV != 'production'
      }
    })
    .then(function (result) {
      fs.writeFile(config.output.style, result.css, function(){
        if (cb) cb(config.output.style)
        var size = fs.statSync(config.output.style)["size"]
        console.log(chalk.grey('[CSS]'),chalk.green('bundle.css'),chalk.magenta(size/1000+'kb'));
      });

    }).catch(function (error) {
        console.warn(chalk.grey('[ERR]'),chalk.red(error.message));
    });;
  })
}
module.exports = buildStyles;
