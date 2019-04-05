import { existsSync } from 'fs';
import { spawnSync } from 'child_process';

import chalk from 'chalk';
import parse = require('parse-git-config');

import { Command, flags } from '@oclif/command';
import { IArg } from '@oclif/parser/lib/args';

export default class Clone extends Command {
  public static strict = false;

  public static usage = 'clone [options] <REPOURL> [-m <submodules>...]';

  public static description = 'Clone [--all] submodules from a repo';

  public static flags = {
    shallow: flags.boolean({
      char: 's',
      description: 'Shallow clone (equvalent to standart git clone)',
      required: false,
    }),
    install: flags.boolean({
      char: 'i',
      description: 'Install all dependencies recursively',
      required: false,
    }),
    modules: flags.string({
      char: 'm',
      multiple: true,
      hidden: true,
      description: 'Submodules for installation',
    })
  };

  public static args: IArg<string>[] = [
    {
      name: 'repoUrl',
      description: 'Repository URL for cloning',
      required: true
    }
  ];

  public async run() {
    const { args, flags } = this.parse(Clone);

    const { repoUrl } = args;
    const { modules: submodules, /* install, */ shallow } = flags;

    let submodulesLog = (submodules || []).map(s => chalk.blueBright(s));
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
    } else if (!shallow) {
      submodulesStr = chalk.blueBright('all submodules');
    }

    submodulesStr = submodulesStr ? `${submodulesStr}` : '';

    const repoName = (repoUrl.match(/([a-z0-9-]+)\.git$/) || [])[1];

    if (!repoName) {
      this.error('Invalid git repo url!', { exit: 1 });
    }

    console.log(
      `Cloning ${
        submodulesStr
      }\nfrom ${
        repoLog
      }\ninto ${
        process.cwd().replace(/\\/g, '/')
      }/${repoName}...\n`
    );

    // Clone main repo
    this.cloneRepo(repoUrl, repoName);

    // Clone submodules
    this.cloneSubmodules(repoName, submodules);
    /*


    if (this.install) {
      submodules
    } */
  }

  public cloneRepo(repoUrl: string, repoName: string) {
    spawnSync('git', ['clone', repoUrl, repoName], { stdio: 'inherit' });
  }

  public cloneSubmodules(repoName: string, submodules: string[]) {
    if (submodules.length === 0) {
      return;
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

    const submodulePaths = submodules.map(submodule => (
      gitmodules[`submodule "${submodule}"`].path
    ));

    spawnSync('git', ['submodule', 'update', '--init', '--', ...submodulePaths], {
      stdio: 'inherit',
      cwd: process.cwd() + '/' + repoName
    });
  }
}
