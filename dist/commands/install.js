"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    syntax: 'install [<names...>]',
    description: 'Install necessary submodules right where you need them',
    alias: 'i',
    options: [
        ['-t, --type', 'Define the type for submodules'],
        ['-p, --path', 'Specifiy a custom path for installation']
    ],
    action: function () {
        console.log('Not yet implemented.');
    }
};
