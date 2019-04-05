import { Command, flags } from '@oclif/command';
import { IArg } from '@oclif/parser/lib/args';
export default class Clone extends Command {
    static strict: boolean;
    static usage: string;
    static description: string;
    static flags: {
        shallow: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        install: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        modules: flags.IOptionFlag<string[]>;
    };
    static args: IArg<string>[];
    run(): Promise<void>;
    cloneRepo(repoUrl: string, repoName: string): void;
    cloneSubmodules(repoName: string, submodules: string[]): void;
}
