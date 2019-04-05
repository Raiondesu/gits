"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { cli } from 'cli-ux';
const child_process_1 = require("child_process");
const hook = async function (_opts) {
    child_process_1.spawnSync('git', process.argv.slice(3), { stdio: 'inherit' });
};
exports.default = hook;
