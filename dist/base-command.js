"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const color_1 = require("@oclif/color");
class BaseCommand extends command_1.default {
    constructor(argv, config) {
        config.commands.forEach(c => {
            c.args.forEach(a => {
                if (a.description) {
                    a.description = color_1.color.greenBright(a.description);
                }
            });
            c.f;
        });
        super(argv, config);
    }
}
exports.BaseCommand = BaseCommand;
