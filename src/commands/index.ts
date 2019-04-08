import chalk from 'chalk';
import { readdirSync } from 'fs';

const allCommands: ICommandConfig[] = readdirSync(__dirname)
  .map((file: string) => {
    if (!/index/.test(file)) {
      return require('./' + file).default;
    }
  })
  .filter((i: any) => !!i);

export interface ICommandConfig {
  syntax: string;
  description?: string;

  options?: [string, string][];
  alias?: string;

  action(this: typeof import('commander'), ...args: any[]): void;
}

export default function (program: typeof import('commander')) {
  allCommands.forEach(config => {
    const localCommand = program.command(config.syntax);

    if (config.alias) {
      localCommand.alias(config.alias);
    }

    if (config.description) {
      localCommand.description(chalk.greenBright(config.description));
    }

    if (config.options) {
      const optionDescPadding = '               '

      config.options.forEach(option => {
        option[1] = chalk.cyanBright(
          option[1]
            .replace(/^\n\s*/, '')
            .replace(/\n\s*/g, '\n' + optionDescPadding)
        );

        localCommand.option.apply(localCommand, option);
      });
    }

    localCommand.action(config.action);
  });
};
