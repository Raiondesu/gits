"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
class Uninstall extends command_1.Command {
    async run() {
        this.log('Not implemented yet...');
    }
}
Uninstall.strict = false;
Uninstall.usage = 'unnstall [<modules...>] [--type=module|asset] [--path ./to/my/modules]';
Uninstall.description = 'Gracefully uninstall unneeded modules in one line!';
Uninstall.flags = {
    type: command_1.flags.string({
        char: 't',
        description: 'Define the type of submodules',
        default: 'module',
        required: false,
    }),
    path: command_1.flags.string({
        char: 'p',
        description: 'Specifiy a custom path for submodules',
        default: 'src/modules',
        required: false,
    }),
};
Uninstall.aliases = ['un', 'remove'];
Uninstall.args = [
    {
        name: 'modules',
        description: 'Submodules for removal',
        multiple: true,
    }
];
exports.default = Uninstall;
