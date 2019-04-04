"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    syntax: 'uninstall [<names...>]',
    description: 'Gracefully uninstall unneeded submodules',
    alias: ['un', 'remove'],
    options: [
        ['-t, --type', 'Define the type of submodules'],
        ['-p, --path', 'Specifiy a custom path for submodules']
    ],
    action: function () {
        console.log('Not yet implemented.');
    }
};
