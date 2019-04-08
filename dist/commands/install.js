"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var parse = require("parse-git-config");
var chalk_1 = require("chalk");
var dependencies = {};
function getSubmodule(gitmodules, submodule) {
    return gitmodules["submodule \"" + submodule + "\""];
}
var install = {
    syntax: 'install [<submodules...>]',
    description: "\n    Install dependencies into a currently active repository.\n\n    <submodules...> can be submodule names,\n    if already stated as dependencies or if --org is passed.\n\n    If <submodules...> are new to be installed - full git URLs are required.\n  ",
    alias: 'i',
    options: [
        ['-p, --path', "\n      A custom path for installation of all new dependencies\n    "],
        ['-o, --origin <origin>', "\n      Organization or user alias to refer to by default,\n      or a URL origin of repositories\n    "],
        ['-s, --shallow', "\n\n    "]
    ],
    action: function (submodules) {
        install.install.apply(this, [submodules]);
    },
    install: function (submodules, repoPath, shallow) {
        var _this = this;
        this.shallow = shallow || this.shallow;
        if (!repoPath) {
            repoPath = '.';
        }
        if (submodules && !Array.isArray(submodules)) {
            submodules = [submodules];
        }
        var gitmodulesURI = repoPath + '/.gitmodules';
        var passedSubmodules = (submodules && submodules.length > 0);
        // If no submodules, but passed submodules names as args
        if (!fs_1.existsSync(gitmodulesURI) && passedSubmodules) {
            // init submodules
        }
        var cwd = process.cwd() + '/' + repoPath;
        var gitmodules = parse.sync({
            cwd: cwd,
            path: '.gitmodules'
        });
        var submodulePaths = [];
        if (passedSubmodules) {
            var newSubmodules = submodules.filter(function (s) { return !gitmodules["submodule \"" + s + "\""]; });
            if (newSubmodules.length > 0) {
                console.log(chalk_1.default.greenBright("Installing new dependencies: " + newSubmodules.join(' ')));
            }
            for (var _i = 0, _a = submodules; _i < _a.length; _i++) {
                var subName = _a[_i];
                var submoduleName = subName;
                var submoduleURL = subName;
                if (!this.origin) {
                    submoduleName = (subName.match(/([a-z0-9-]+)\.git$/) || [])[1];
                }
                else {
                    if (this.origin.startsWith('http')) {
                        submoduleURL = this.origin + "/" + subName + ".git";
                    }
                    else {
                        submoduleURL = "https://github.com/" + this.origin + "/" + subName;
                    }
                }
                var gitmodule = getSubmodule(gitmodules, submoduleName);
                var backupPath = (this.path || '.') + '/' + submoduleName;
                var path = gitmodule ? gitmodule.path : backupPath;
                submodulePaths.push(path);
                // Symlink a dependency, if already met before
                if (dependencies[submoduleURL]) {
                    // TODO: it's not enough, redo this
                    fs_1.symlinkSync(path, dependencies[submoduleURL].path, 'dir');
                }
                // Add new submodules by their repo names
                child_process_1.spawnSync('git', [
                    'submodule',
                    'add',
                    '--force',
                    '--name', submoduleName,
                    '--', submoduleURL,
                    path
                ], {
                    stdio: 'inherit',
                    cwd: process.cwd() + '/' + repoPath
                });
            }
        }
        else {
            submodulePaths = Object.keys(gitmodules).map(function (gitmodule) {
                var submoduleProps = gitmodules[gitmodule];
                dependencies[submoduleProps.url] = submoduleProps;
                dependencies[submoduleProps.url].path = cwd + '/' + dependencies[submoduleProps.url].path;
                return submoduleProps.path;
            });
        }
        child_process_1.spawnSync('git', ['submodule', 'update', '--init'].concat((!this.shallow ? ['--recursive'] : []), ['--'], submodulePaths), {
            stdio: 'inherit',
            cwd: process.cwd() + '/' + repoPath
        });
        submodulePaths.forEach(function (path) {
            if (fs_1.existsSync(path + '/.gitmodules')) {
                install.action.call(_this, [, path]);
            }
        });
    }
};
exports.default = install;
