var chalk = require('chalk').default;

var normalizedPath = require('path').join(__dirname, './');

var allCommands = require('fs').readdirSync(normalizedPath).map(function(file) {
  if (!/index/.test(file)) {
    return require('./' + file);
  }
}).filter(i => !!i);


module.exports = exports = function (program) {
  allCommands.forEach(function (config) {
    var localCommand = program.command(config.syntax);

    if (config.alias) {
      localCommand.alias(config.alias);
    }

    if (config.description) {
      localCommand.description('|  ' + chalk.greenBright(config.description));
    }

    if (config.options) {
      config.options.forEach(function (option) {
        localCommand.option.apply(localCommand, option);
      });
    }

    localCommand.action(config.action);
  });
};
