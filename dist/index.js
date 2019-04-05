"use strict";
const chalk_1 = require("chalk");
const command_1 = require("@oclif/command");
module.exports = class Gits extends command_1.Command {
    async run() {
        // const { args, flags } = this.parse(this.constructor as typeof Gits);
        this.log('here');
        this.config.version = chalk_1.default.greenBright(this.config.version);
        const minimumArgsLength = 2;
        // Check the program.args obj
        const NO_COMMAND_SPECIFIED = process.argv.length <= minimumArgsLength;
        if (NO_COMMAND_SPECIFIED) {
            this._help();
        }
        else {
            command_1.run(process.argv);
        }
    }
};
