var bs = require("browser-sync").create();
var config = require('./config');
var buildStyles = require('./tasks/styles');
var buildScripts = require('./tasks/scripts');

// BROWSER-SYNC
bs.init({
    server: {
      baseDir: './',
      middleware: [
        require('http-proxy-middleware')(config.proxyPaths, {
            target: 'http://'+config.domain,
            autoRewrite: true,
            changeOrigin: true,
        })
      ]
    },
    rewriteRules: [
      {
        match: new RegExp(config.domain, 'g'),
        fn: function (match) {
          return 'localhost:'+config.port;
        }
      }
    ],
    port: config.port,
    open: false,
    reloadOnRestart: true,
});

//initial build
buildStyles();
buildScripts();


//watch
bs.watch(config.watch, function (event, file) {
    if (event === "change") {
      var arr = file.split('.')
      switch (arr[arr.length-1]) {
        case 'scss':
          buildStyles(function(file){
            bs.reload(file)
          });
          break;
        case 'js':
          buildScripts(function(file){
            bs.reload(file)
          });
          break;
        case 'html':
          bs.reload(file);
          break;
      }
    }
});
