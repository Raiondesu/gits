import { Command } from '@oclif/command';
export default class Push extends Command {
    static description: string;
    static flags: {
        force: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: {
        name: string;
    }[];
    run(): Promise<void>;
}
