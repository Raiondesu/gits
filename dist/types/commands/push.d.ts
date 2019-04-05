import { Command } from '@oclif/command';
import { Input } from '@oclif/parser/lib/flags';
export default class Push extends Command {
    static description: string;
    static flags: Input<any>;
    static args: {
        name: string;
    }[];
    run(): Promise<void>;
}
