import { existsSync } from 'fs';
import { spawnSync } from 'child_process';

import chalk from 'chalk';
import parse = require('parse-git-config');

import { ICommandConfig } from '.';

function cloneRepo(repoUrl: string, repoName: string) {
  spawnSync('git', ['clone', repoUrl, repoName], { stdio: 'inherit' });
}

function cloneSubmodules(repoName: string, submodules: string[]) {
  if (submodules.length === 0) {
    return [];
  }

  const gitmodulesURI = repoName + '/.gitmodules';

  // If no submodules, but passed submodules names as args
  if (!existsSync(gitmodulesURI) && submodules && submodules.length > 0) {
    throw new Error(`Repository ${repoName} does not contain any submodules!`);
  }

  const gitmodules = parse.sync({
    cwd: process.cwd() + '/' + repoName,
    path: '.gitmodules'
  });


  const validSubmodules = submodules.filter(s => !!gitmodules[`submodule "${s}"`]);

  const submodulePaths = validSubmodules.map(submodule => (
    gitmodules[`submodule "${submodule}"`].path
  ));

  spawnSync('git', ['submodule', 'update', '--init', '--', ...submodulePaths], {
    stdio: 'inherit',
    cwd: process.cwd() + '/' + repoName
  });

  return validSubmodules;
}

export default {
  syntax: 'clone <repo> [submodules...]',

  description: 'Clone submodules from a repo',

  options: [
    ['--shalow', 'Do not clone submodules (identical to a simple git clone)'],
    ['-i, --install', 'Install all dependencies recursively (identical to git clone --recursive)']
  ],

  action(repoUrl: string, submodules: string[]) {
    let submodulesLog = submodules.map(s => chalk.blueBright(s));
    let repoLog = chalk.yellow(repoUrl);

    let submodulesStr = '';

    if (submodulesLog) {
      if (submodulesLog.length > 1) {
        var last = submodulesLog[submodulesLog.length - 1];
        var others = submodulesLog.slice(0, submodulesLog.length - 1).join(', ');

        submodulesStr += `submodules ${others} and ${last}`;
      } else if (submodulesLog.length === 1) {
        submodulesStr += 'submodule ' + String(submodulesLog[0]);
      } else {
        submodulesStr = 'shallow';
      }
    }

    if (this.shallow) {
      submodulesStr = chalk.blueBright('all submodules');
    }

    submodulesStr = submodulesStr ? `${submodulesStr}` : '';

    const repoName = (repoUrl.match(/([a-z0-9-]+)\.git$/) || [])[1];

    if (!repoName) {
      console.error('Invalid git repo url!');
      return process.exit(1);
    }

    this.log(
      `\nCloning ${
        submodulesStr
      }\n\tfrom ${
        repoLog
      }\n\tinto ${
        process.cwd().replace(/\\/g, '/')
      }/${repoName}...\n`
    );

    // Clone main repo
    cloneRepo(repoUrl, repoName);

    // Clone submodules
    const validSubmodules = cloneSubmodules(repoName, submodules);

    if (this.install) {
      validSubmodules.forEach(name => {
        spawnSync('gits', ['install'], {
          stdio: 'inherit',
          cwd: process.cwd() + '/' + repoName + '/' + name
        });
      });
    }
  }
} as ICommandConfig;
