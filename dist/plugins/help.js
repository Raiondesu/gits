"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_help_1 = require("@oclif/plugin-help");
const colorize_1 = require("../colorize");
const color_1 = require("@oclif/color");
class ColorizedHelp extends plugin_help_1.default {
    showCommandHelp(command, topics) {
        const colorCommand = colorize_1.Colorized(Object.assign({}, command, { aliases: command.aliases ? [...command.aliases] : command.aliases, args: command.args ? command.args.map(a => (Object.assign({}, a))) : command.args, flags: command.flags ? Object.keys(command.flags).reduce((acc, f) => {
                acc[f] = Object.assign({}, command.flags[f]);
                return acc;
            }, {}) : command.flags }));
        const colorTopics = topics.map(t => (Object.assign({}, t.description && { description: color_1.default.greenBright(t.description) }, { hidden: t.hidden, name: t.name })));
        return super.showCommandHelp(colorCommand, colorTopics);
    }
}
exports.default = ColorizedHelp;
__export(require("@oclif/plugin-help"));
