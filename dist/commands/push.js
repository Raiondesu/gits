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
let Push = class Push extends command_1.Command {
    async run() {
        this.log('Not implemented yet...');
    }
};
Push.description = 'Pushe commits to submodules and update root';
Push.flags = {
    force: command_1.flags.boolean({ char: 'f', description: 'Force push' })
};
Push.args = [{ name: 'file' }];
Push = __decorate([
    colorize_1.Colorized
], Push);
exports.default = Push;
