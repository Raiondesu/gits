import { Command, flags } from '@oclif/command';
import { Colorized } from '../colorize';

@Colorized
export default class Uninstall extends Command {
  public static strict = false;

  public static usage = 'unnstall [<modules...>] [--type=module|asset] [--path ./to/my/modules]';

  public static description = 'Gracefully uninstall unneeded modules in one line!';

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

  public static aliases = ['un', 'remove'];

  public static args = [
    {
      name: 'modules',
      description: 'Submodules for removal',
      multiple: true,
    }
  ];

  public async run() {
    this.log('Not implemented yet...');
  }
}
