import { spawnSync } from 'child_process';

import chalk from 'chalk';

import { ICommandConfig } from '.';

import Install from './install';

function cloneRepo(repoUrl: string, repoName: string) {
  spawnSync('git', ['clone', repoUrl, repoName], { stdio: 'inherit' });
}

export default {
  syntax: 'clone <repo> [submodules...]',

  description: 'Clone submodules from a repo',

  alias: 'c',

  options: [
    [
      '-s, --shallow', `
        If no submodules passed - do not clone submodules (identical to a simple git clone),
        if passed submodules - do not install dependencies (clone only the first level)
      `
    ],
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

    // if (this.shallow) {
      // submodulesStr = chalk.blueBright('all submodules');
    // }

    submodulesStr = submodulesStr ? `${submodulesStr}` : '';

    const repoName = (repoUrl.match(/([a-z0-9-]+)\.git$/) || [])[1];

    if (!repoName) {
      console.error('Invalid git repo url!');
      return process.exit(1);
    }

    console.log(
      `\nCloning ${
        submodulesStr
      }\n\tfrom ${
        repoLog
      }\n\tinto ${
        process.cwd().replace(/\\/g, '/')
      }/${chalk.yellowBright(repoName)}...\n`
    );

    // Clone main repo
    cloneRepo(repoUrl, repoName);

    if (submodules.length > 0 && !this.shallow) {
      Install.action.apply(this, [repoUrl, submodules]);
    }
  }
} as ICommandConfig;
