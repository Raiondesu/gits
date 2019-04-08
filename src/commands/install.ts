import { ICommandConfig } from '.';
import { existsSync } from 'fs';
import { spawnSync } from 'child_process';
import parse = require('parse-git-config');
import chalk from 'chalk';

export default {
  syntax: 'install [<path>] [<submodules...>]',

  description: `
    Install dependencies into a repo by <path>.
    If installing into a current repo - pass '.' as <path>.

    <submodules...> can be submodule names,
    if already stated as dependencies or if --org is passed.

    If <submodules...> are new to be installed - full git URLs are required.
  `,

  alias: 'i',

  options: [
    ['-p, --path', `
      A custom path for installation of all new dependencies
    `],

    ['-o, --origin <origin>', `
      Organization or user alias to refer to by default,
      or a URL origin of repositories
    `],

    ['-s, --shallow', `
      Organization or user alias to refer to by default,
      or a URL origin of repositories
    `]
  ],

  action(repoName?: string, submodules?: string[], shallow?: boolean) {
    this.shallow = shallow || this.shallow;

    if (!repoName) {
      repoName = '.';
    }

    if (submodules && !Array.isArray(submodules)) {
      submodules = [submodules];
    }

    const gitmodulesURI = repoName + '/.gitmodules';
    const passedSubmodules = (submodules && submodules.length > 0);

    // If no submodules, but passed submodules names as args
    if (!existsSync(gitmodulesURI) && passedSubmodules) {
      console.error(`Repository ${repoName} does not contain any submodules!`);
    }

    const gitmodules = parse.sync({
      cwd: process.cwd() + '/' + repoName,
      path: '.gitmodules'
    });

    const submodulePaths: string[] = Object.values(gitmodules).map(v => v.path);;

    if (passedSubmodules) {
      const newSubmodules = submodules!.filter(s => !gitmodules[`submodule "${s}"`]);

      console.log(chalk.greenBright`Installing new dependencies: ${newSubmodules.join(', ')}`);

      if (newSubmodules.length > 0) {
        newSubmodules.forEach(submoduleURL => {
          let submoduleName: string;

          if (!this.origin) {
            submoduleName = (submoduleURL.match(/([a-z0-9-]+)\.git$/) || [])[1];
          } else if (this.origin.startsWith('http')) {
            submoduleName = submoduleURL;
            submoduleURL = `${this.origin}/${submoduleURL}.git`;
          } else {
            submoduleName = submoduleURL;
            submoduleURL = `https://github.com/${this.origin}/${submoduleURL}.git`;
          }

          const path = (this.path || '.') + '/' + submoduleName;

          // Add new submodules by their repo names
          spawnSync('git', [
              'submodule',
              'add',
              '--force',
              '--name', submoduleName,
              '--', submoduleURL,
              path
            ],
            {
              stdio: 'inherit',
              cwd: process.cwd() + '/' + repoName
            }
          );

          submodulePaths.push(path);
        });
      }
    }

    spawnSync('git', ['submodule', 'update', '--init', ...(!this.shallow ? ['--recursive'] : []), '--', ...submodulePaths], {
      stdio: 'inherit',
      cwd: process.cwd() + '/' + repoName
    });
  }
} as ICommandConfig;
