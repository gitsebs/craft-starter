var buildStyles = require('./tasks/styles');
var buildScripts = require('./tasks/scripts');

console.log('env',process.env.NODE_ENV);
buildStyles();
buildScripts();
