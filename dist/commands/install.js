"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var parse = require("parse-git-config");
exports.default = {
    syntax: 'install [<path>] [<submodules...>]',
    description: "\n    Install dependencies into a repo by <path>.\n    If installing into a current repo - pass '.' as <path>.\n\n    <submodules...> can be submodule names,\n    if already stated as dependencies or if --org is passed.\n\n    If <submodules...> are new to be installed - full git URLs are required.\n  ",
    alias: 'i',
    options: [
        ['-p, --path', "\n      A custom path for installation of all new dependencies\n    "],
        ['-o, --org', "\n      Organization or user alias to refer to by default,\n      or a URL origin of repositories\n    "],
        ['-s, --shallow', "\n      Organization or user alias to refer to by default,\n      or a URL origin of repositories\n    "]
    ],
    action: function (repoName, submodules, shallow) {
        var _this = this;
        this.shallow = shallow || this.shallow;
        if (!repoName) {
            repoName = '.';
        }
        if (submodules && !Array.isArray(submodules)) {
            submodules = [submodules];
        }
        var gitmodulesURI = repoName + '/.gitmodules';
        var passedSubmodules = (submodules && submodules.length > 0);
        // If no submodules, but passed submodules names as args
        if (!fs_1.existsSync(gitmodulesURI) && passedSubmodules) {
            console.error("Repository " + repoName + " does not contain any submodules!");
        }
        var gitmodules = parse.sync({
            cwd: process.cwd() + '/' + repoName,
            path: '.gitmodules'
        });
        var submodulePaths;
        console.log('here', passedSubmodules);
        if (!passedSubmodules) {
            submodulePaths = Object.values(gitmodules).map(function (v) { return v.path; });
        }
        else {
            var newSubmodules = submodules.filter(function (s) { return !gitmodules["submodule \"" + s + "\""]; });
            console.log('new', newSubmodules);
            if (newSubmodules.length > 0) {
                newSubmodules.forEach(function (submoduleURL) {
                    var submoduleName;
                    if (!_this.org) {
                        submoduleName = (submoduleURL.match(/([a-z0-9-]+)\.git$/) || [])[1];
                    }
                    else {
                        submoduleName = "https://github.com/" + _this.org + "/" + submoduleURL + ".git";
                    }
                    // Add new submodules by their repo names
                    child_process_1.spawnSync('git', [
                        'submodule',
                        'add',
                        '--force',
                        '--name', submoduleName,
                        '--', submoduleURL
                    ].concat(_this.path ? [_this.path + '/' + submoduleName] : []), {
                        stdio: 'inherit',
                        cwd: process.cwd() + '/' + repoName
                    });
                });
            }
            submodulePaths = submodules.map(function (submodule) { return (gitmodules["submodule \"" + submodule + "\""].path); });
        }
        child_process_1.spawnSync('git', ['submodule', 'update', '--init'].concat((!this.shallow ? ['--recursive'] : []), ['--'], submodulePaths), {
            stdio: 'inherit',
            cwd: process.cwd() + '/' + repoName
        });
    }
};
