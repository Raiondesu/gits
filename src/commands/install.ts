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

function getSubmodule(gitmodules: DependencyMap, submodule: string) {
  return gitmodules[`submodule "${submodule}"`];
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

    `]
  ],

  action(submodules?: string[]) {
    install.install.apply(this, [submodules]);
  },

  install(this: import('commander').CommanderStatic, submodules?: string[], repoPath?: string, shallow?: boolean) {
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
      // init submodules
    }

    const cwd = process.cwd() + (repoPath && repoPath === '.' ? '' : ('/' + repoPath));

    const gitmodules: DependencyMap = parse.sync({
      cwd,
      path: '.gitmodules'
    });

    let submodulePaths: string[] = [];

    if (passedSubmodules) {
      const newSubmodules = submodules!.filter(s => !gitmodules[`submodule "${s}"`]);

      if (newSubmodules.length > 0) {
        console.log(chalk.greenBright(`Installing new dependencies: ${newSubmodules.join(' ')}`));
      }

      for (const subName of submodules!) {
        let submoduleName: string = subName;
        let submoduleURL: string = subName;

        if (!this.origin) {
          submoduleName = (subName.match(/([a-z0-9-]+)\.git$/) || [])[1];
        } else {
          if (this.origin.startsWith('http')) {
            submoduleURL = `${this.origin}/${subName}.git`;
          } else {
            submoduleURL = `https://github.com/${this.origin}/${subName}`;
          }
        }

        const gitmodule = getSubmodule(gitmodules, submoduleName);
        const backupPath = (this.path || '.') + '/' + submoduleName;

        const path = gitmodule ? gitmodule.path : backupPath;

        submodulePaths.push(path);

        // Symlink a dependency, if already met before
        if (dependencies[submoduleURL]) {
          // TODO: it's not enough, redo this
          symlinkSync(path, dependencies[submoduleURL].path, 'dir');
        }

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
      }
    } else {
      submodulePaths = Object.keys(gitmodules).map(gitmodule => {
        const submoduleProps: IGitmodule = gitmodules[gitmodule];
        dependencies[submoduleProps.url] = submoduleProps;

        dependencies[submoduleProps.url].path = cwd + '/' + dependencies[submoduleProps.url].path;

        return submoduleProps.path;
      });
    }

    spawnSync('git', ['submodule', 'update', '--init', ...(!this.shallow ? ['--recursive'] : []), '--', ...submodulePaths], {
      stdio: 'inherit',
      cwd: process.cwd() + '/' + repoPath
    });

    submodulePaths.forEach(path => {
      if (existsSync(path + '/.gitmodules')) {
        install.action.call(this, [, path]);
      }
    });
  }
};

export default install;
