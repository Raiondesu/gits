"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var chalk_1 = require("chalk");
var parse = require("parse-git-config");
function cloneRepo(repoUrl, repoName) {
    child_process_1.spawnSync('git', ['clone', repoUrl, repoName], { stdio: 'inherit' });
}
function cloneSubmodules(repoName, submodules) {
    if (submodules.length === 0) {
        return;
    }
    var gitmodulesURI = repoName + '/.gitmodules';
    // If no submodules, but passed submodules names as args
    if (!fs_1.existsSync(gitmodulesURI) && submodules && submodules.length > 0) {
        throw new Error("Repository " + repoName + " does not contain any submodules!");
    }
    var gitmodules = parse.sync({
        cwd: process.cwd() + '/' + repoName,
        path: '.gitmodules'
    });
    var validSubmodules = submodules.filter(function (s) { return !!gitmodules["submodule \"" + s + "\""]; });
    var submodulePaths = validSubmodules.map(function (submodule) { return (gitmodules["submodule \"" + submodule + "\""].path); });
    child_process_1.spawnSync('git', ['submodule', 'update', '--init', '--'].concat(submodulePaths), {
        stdio: 'inherit',
        cwd: process.cwd() + '/' + repoName
    });
}
exports.default = {
    syntax: 'clone <repo> [submodules...]',
    description: 'Clone submodules from a repo',
    alias: 'c',
    options: [
        ['-s, --shallow', 'Do not clone submodules (identical to a simple git clone)'],
        ['-i, --install', 'Install all dependencies recursively (identical to git clone --recursive)']
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
        if (this.shallow) {
            submodulesStr = chalk_1.default.blueBright('all submodules');
        }
        submodulesStr = submodulesStr ? "" + submodulesStr : '';
        var repoName = (repoUrl.match(/([a-z0-9-]+)\.git$/) || [])[1];
        if (!repoName) {
            console.error('Invalid git repo url!');
            return process.exit(1);
        }
        console.log("\nCloning " + submodulesStr + "\n\tfrom " + repoLog + "\n\tinto " + process.cwd().replace(/\\/g, '/') + "/" + chalk_1.default.yellowBright(repoName) + "...\n");
        // Clone main repo
        cloneRepo(repoUrl, repoName);
        // Clone submodules
        cloneSubmodules(repoName, submodules);
        if (this.install) {
            child_process_1.spawnSync('gits', ['install'], {
                stdio: 'inherit',
                cwd: process.cwd() + '/' + repoName
            });
        }
    }
};
