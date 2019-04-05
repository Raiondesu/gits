"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
class Install extends command_1.Command {
    async run() {
        this.log('Not implemented yet...');
    }
}
Install.strict = false;
Install.usage = 'install [<modules...>] [--type=module|asset] [--path ./to/my/modules]';
Install.description = 'Install necessary modules in one line!';
Install.flags = {
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
Install.aliases = ['i', 'add'];
Install.args = [
    {
        name: 'modules',
        description: 'Submodules for installation',
        multiple: true,
    }
];
exports.default = Install;
