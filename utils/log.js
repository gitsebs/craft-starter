var chalk = require('chalk');
module.exports = {
  error: function(prefix,error){
    console.log('['+chalk.grey(prefix)+'] '+chalk.red(error));
  },
  warn: function(prefix,error){
    console.log('['+chalk.grey(prefix)+'] '+chalk.yellow(error));
  },
  log: function(prefix,message,number,comment) {
    if (!number) {
      number = ''
    }
    if (!comment) {
      comment = ''
    }
    console.log('['+chalk.grey(prefix)+'] '+chalk.green(message)+' '+chalk.magenta(number)+' '+chalk.black(comment));
  }
}
