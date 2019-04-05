"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
class Push extends command_1.Command {
    async run() {
        this.log('Not implemented yet...');
    }
}
Push.description = 'Pushe commits to submodules and update root';
Push.flags = {
    force: command_1.flags.boolean({ char: 'f', description: 'Force push' })
};
Push.args = [{ name: 'file' }];
exports.default = Push;
