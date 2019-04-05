"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const hook = async function (_opts) {
    child_process_1.spawnSync('git', process.argv.slice(3), { stdio: 'inherit' });
    this.exit(0);
};
exports.default = hook;
