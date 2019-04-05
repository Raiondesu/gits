import { Command, flags } from '@oclif/command';

export default class Push extends Command {
  public static description = 'Pushe commits to submodules and update root';

  public static flags = {
    force: flags.boolean({ char: 'f', description: 'Force push' })
  };

  public static args = [{ name: 'file' }];

  public async run() {
    this.log('Not implemented yet...');
  }
}
