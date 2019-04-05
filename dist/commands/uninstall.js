"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const colorize_1 = require("../colorize");
let Uninstall = class Uninstall extends command_1.Command {
    async run() {
        this.log('Not implemented yet...');
    }
};
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
Uninstall = __decorate([
    colorize_1.Colorized
], Uninstall);
exports.default = Uninstall;
