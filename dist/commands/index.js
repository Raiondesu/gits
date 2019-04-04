"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var fs_1 = require("fs");
var allCommands = fs_1.readdirSync(__dirname)
    .map(function (file) {
    if (!/index/.test(file)) {
        return require('./' + file).default;
    }
})
    .filter(function (i) { return !!i; });
function default_1(program) {
    allCommands.forEach(function (config) {
        var localCommand = program.command(config.syntax);
        if (config.alias) {
            localCommand.alias(config.alias);
        }
        if (config.description) {
            localCommand.description('|  ' + chalk_1.default.greenBright(config.description));
        }
        if (config.options) {
            config.options.forEach(function (option) { return (localCommand.option.apply(localCommand, option)); });
        }
        localCommand.action(config.action);
    });
}
exports.default = default_1;
;
