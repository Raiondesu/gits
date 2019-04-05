"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs_1 = require("fs");
const allCommands = fs_1.readdirSync(__dirname)
    .map((file) => {
    if (!/index/.test(file)) {
        return require('./' + file).default;
    }
})
    .filter((i) => !!i);
function default_1(program) {
    allCommands.forEach(config => {
        const localCommand = program.command(config.syntax);
        if (config.alias) {
            if (typeof config.alias === 'string') {
                localCommand.alias(config.alias);
            }
            else if (Array.isArray(config.alias)) {
                config.alias.forEach(alias => localCommand.alias(alias));
            }
        }
        if (config.description) {
            localCommand.description('|  ' + chalk_1.default.greenBright(config.description));
        }
        if (config.options) {
            config.options.forEach(option => (localCommand.option.apply(localCommand, option)));
        }
        localCommand.action(config.action);
    });
}
exports.default = default_1;
;
