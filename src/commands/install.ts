import { Command, flags } from '@oclif/command';
import { Colorized } from '../colorize';

@Colorized
export default class Install extends Command {
  public static strict = false;

  public static usage = 'install [<modules...>] [--type=module|asset] [--path ./to/my/modules]';

  public static description = 'Install necessary modules in one line!';

  public static flags = {
    type: flags.string({
      char: 't',
      description: 'Define the type of submodules',
      default: 'module',
      required: false,
    }),
    path: flags.string({
      char: 'p',
      description: 'Specifiy a custom path for submodules',
      default: 'src/modules',
      required: false,
    }),
  };

  public static aliases = ['i', 'add'];

  public static args = [
    {
      name: 'modules',
      description: 'Submodules for installation',
      multiple: true,
    }
  ];

  public async run() {
    this.log('Not implemented yet...');
  }
}
