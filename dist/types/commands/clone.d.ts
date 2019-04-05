import { Command, flags } from '@oclif/command';
export default class Clone extends Command {
    static strict: boolean;
    static usage: string;
    static description: string;
    static flags: {
        all: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        install: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        modules: flags.IOptionFlag<string[]>;
    };
    static args: {
        name: string;
        description: string;
    }[];
    run(): Promise<void>;
}
