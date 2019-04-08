"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var child_process_1 = require("child_process");
var install_1 = require("./install");
function cloneRepo(repoUrl, repoName) {
    child_process_1.spawnSync('git', ['clone', repoUrl, repoName], { stdio: 'inherit' });
}
exports.default = {
    syntax: 'clone <repo> [submodules...]',
    description: 'Clone submodules from a repo',
    alias: 'c',
    options: [
        ['-s, --shallow', "\n      If no submodules passed - do not clone submodules (identical to a simple git clone),\n      if passed submodules - do not install dependencies (clone only the first level)\n    "],
        ['-d, --dir', "\n      Custom directory for cloning\n    "]
    ],
    action: function (repoUrl, submodules) {
        var submodulesLog = submodules.map(function (s) { return chalk_1.default.blueBright(s); });
        var repoLog = chalk_1.default.yellow(repoUrl);
        var submodulesStr = '';
        if (submodulesLog) {
            if (submodulesLog.length > 1) {
                var last = submodulesLog[submodulesLog.length - 1];
                var others = submodulesLog.slice(0, submodulesLog.length - 1).join(', ');
                submodulesStr += "submodules " + others + " and " + last;
            }
            else if (submodulesLog.length === 1) {
                submodulesStr += 'submodule ' + String(submodulesLog[0]);
            }
            else {
                submodulesStr = 'shallow';
            }
        }
        // if (this.shallow) {
        // submodulesStr = chalk.blueBright('all submodules');
        // }
        submodulesStr = submodulesStr ? "" + submodulesStr : '';
        var repoName = (repoUrl.match(/([a-z0-9-]+)\.git$/) || [])[1];
        if (!repoName) {
            console.error('Invalid git repo url!');
            return process.exit(1);
        }
        console.log("\nCloning " + submodulesStr + "\n\tfrom " + repoLog + "\n\tinto " + process.cwd().replace(/\\/g, '/') + "/" + chalk_1.default.yellowBright(repoName) + "...\n");
        // Clone main repo
        cloneRepo(repoUrl, this.dir || repoName);
        if (submodules.length > 0 || !this.shallow) {
            install_1.default.install.apply(this, [submodules, repoName, this.shallow]);
        }
    }
};
