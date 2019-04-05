"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("@oclif/color");
exports.Colorized = function (target) {
    if (target.description) {
        target.description = color_1.color.greenBright(target.description);
    }
    if (target.args) {
        target.args.forEach(a => {
            if (a.description) {
                a.description = color_1.color.cyanBright(a.description);
            }
        });
    }
    if (target.flags) {
        for (const flag in target.flags) {
            const f = target.flags[flag];
            if (f && f.description) {
                f.description = color_1.color.blueBright(f.description);
            }
        }
    }
    return target;
};
