import { ICommandConfig } from '.';
import { existsSync, symlinkSync } from 'fs';
import { spawnSync } from 'child_process';
import parse = require('parse-git-config');
import chalk from 'chalk';

interface IGitmodule {
  path: string;
  url: string;
  update?: string;
  branch?: string;
  shallow?: boolean;
  fetchRecurseSubmodules?: boolean;
  ignore?: 'all' | 'dirty' | 'untracked' | 'none';
}

type DependencyMap = { [name: string]: IGitmodule };

const dependencies: DependencyMap = {};

/**
 * Extracts submodules from a .gitmodules file of repo
 * and remembers them as depemdencies by name
 *
 * @param {string} repoName - the name of the repository's folder
 */
function getModules(repoName: string) {
  const cwd = process.cwd() + '/' + repoName;

  const gitmodules: DependencyMap = parse.sync({
    cwd,
    path: '.gitmodules'
  });

  return {
    gitmodules,

    submodulePaths: Object.keys(gitmodules).map(gitmodule => {
      const submoduleProps: IGitmodule = gitmodules[gitmodule];
      dependencies[submoduleProps.url] = submoduleProps;

      dependencies[submoduleProps.url].path = cwd + '/' + dependencies[submoduleProps.url].path;

      return submoduleProps.path;
    })
  };
}

const install: ICommandConfig = {
  syntax: 'install [<submodules...>]',

  description: `
    Install dependencies into a currently active repository.

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

  action(submodules?: string[], repoPath?: string, shallow?: boolean) {
    this.shallow = shallow || this.shallow;

    if (!repoPath) {
      repoPath = '.';
    }

    if (submodules && !Array.isArray(submodules)) {
      submodules = [submodules];
    }

    const gitmodulesURI = repoPath + '/.gitmodules';
    const passedSubmodules = (submodules && submodules.length > 0);

    // If no submodules, but passed submodules names as args
    if (!existsSync(gitmodulesURI) && passedSubmodules) {
      console.error(`Repository ${repoPath} does not contain any submodules!`);
    }

    const { gitmodules, submodulePaths } = getModules(repoPath);

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
              cwd: process.cwd() + '/' + repoPath
            }
          );

          submodulePaths.push(path);
        });
      }
    }

    spawnSync('git', ['submodule', 'update', '--init', ...(!this.shallow ? ['--recursive'] : []), '--', ...submodulePaths], {
      stdio: 'inherit',
      cwd: process.cwd() + '/' + repoPath
    });

    submodulePaths.forEach(path => {
      install.action.call(this, [, path]);
    });
  }
};

export default install;
