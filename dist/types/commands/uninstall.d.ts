import { Command, flags } from '@oclif/command';
export default class Uninstall extends Command {
    static strict: boolean;
    static usage: string;
    static description: string;
    static flags: {
        type: flags.IOptionFlag<string | undefined>;
        path: flags.IOptionFlag<string | undefined>;
    };
    static aliases: string[];
    static args: {
        name: string;
        description: string;
        multiple: boolean;
    }[];
    run(): Promise<void>;
}
