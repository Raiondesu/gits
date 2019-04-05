import { Command, flags } from '@oclif/command';
import { Colorized } from '../colorize';
import { Input } from '@oclif/parser/lib/flags';

@Colorized
export default class Push extends Command {
  public static description = 'Pushe commits to submodules and update root';

  public static flags: Input<any> = {
    force: flags.boolean({ char: 'f', description: 'Force push' })
  };

  public static args = [{ name: 'file' }];

  public async run() {
    this.log('Not implemented yet...');
  }
}
