import { existsSync } from 'fs';
import { spawnSync } from 'child_process';

import { color } from '@oclif/color';
import parse = require('parse-git-config');

import Command, { flags } from '@oclif/command';
import { Input } from '@oclif/parser/lib/flags';
import { IArg } from '@oclif/parser/lib/args';
import minimist = require('minimist');
import { Colorized } from '../colorize';

// @Colorized
export default class Clone extends Command {
  public static strict = false;

  public static usage = 'clone [options] <REPOURL> [<SUBMODULES>...]';

  public static description = 'Clone [--all] submodules from a repo';

  public static flags: Input<any> = {
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

    try {
      var submodules = minimist(process.argv)._.slice(2);

      console.log(submodules);

    } catch (e) {
      console.log('eee', e);
    }

    submodules = [];

    const { install, shallow } = flags;

    let submodulesLog = (submodules || []).map(s => color.blueBright(s));
    let repoLog = color.yellow(repoUrl);

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
      submodulesStr = color.blueBright('all submodules');
    }

    submodulesStr = submodulesStr ? `${submodulesStr}` : '';

    const repoName = (repoUrl.match(/([a-z0-9-]+)\.git$/) || [])[1];

    if (!repoName) {
      this.error('Invalid git repo url!', { exit: 1 });
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
    this.cloneRepo(repoUrl, repoName);

    this.log('\n');

    // Clone submodules
    const validSubmodules = this.cloneSubmodules(repoName, submodules);

    if (install) {
      validSubmodules.forEach(name => {
        spawnSync('gits', ['install'], {
          stdio: 'inherit',
          cwd: process.cwd() + '/' + repoName + '/' + name
        });
      });
    }
  }

  public cloneRepo(repoUrl: string, repoName: string) {
    spawnSync('git', ['clone', repoUrl, repoName], { stdio: 'inherit' });
  }

  public cloneSubmodules(repoName: string, submodules: string[]): string[] {
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
}
