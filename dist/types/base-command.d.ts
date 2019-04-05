import Command from '@oclif/command';
import { IConfig } from '@oclif/config';
export declare abstract class BaseCommand extends Command {
    constructor(argv: string[], config: IConfig);
}
