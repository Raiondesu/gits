import chalk from 'chalk';

import { ICommandConfig } from '.';
import { spawnSync } from 'child_process';

export default {
  syntax: 'clone <repo> [submodules...]',

  description: 'Clones [--all] submodules from a repo',

  options: [
    ['--all', 'Clone all submodules']
  ],

  async action(_repo: string, _submodules: string[]) {
    let submodules = _submodules.map(s => chalk.blueBright(s));
    let repo = chalk.yellow(_repo);

    let submodulesStr = '';

    if (submodules) {
      if (submodules.length > 1) {
        var last = submodules[submodules.length - 1];
        var others = submodules.slice(0, submodules.length - 1).join(', ');

        submodulesStr += `submodules ${others} and ${last}`;
      } else if (submodules.length === 1) {
        submodulesStr += 'submodule ' + String(submodules[0]);
      } else {
        submodulesStr = 'shallow';
      }
    }

    if (this.opts().all) {
      submodulesStr = chalk.blueBright('all submodules');
    }

    submodulesStr = submodulesStr ? `${submodulesStr}` : '';

    const repoName = (_repo.match(/([a-z0-9-]+)\.git$/) || [])[1];

    if (!repoName) {
      console.error('Invalid git repo url!');
      process.exit(1);
    }

    console.log(`Cloning ${submodulesStr}\nfrom ${repo}\ninto ${process.cwd().replace(/\\/g, '/')}/${repoName}...`);

    spawnSync('git', ['clone', _repo, repoName], { stdio: 'inherit' });

    spawnSync('git', ['submodule', 'update', '--init', '--', ..._submodules], {
      stdio: 'inherit',
      cwd: process.cwd() + '/' + repoName
    });

    // const git = simpleGit(process.cwd());

    // git.clone(_repo, './' + repoName)
      // .then(() => {
        // git.subModule(['update --init -- ' + _submodules.map(s => './' + s).join(' ')]);
      // });
  }
} as ICommandConfig;
