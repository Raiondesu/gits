import Command from '@oclif/command';
import { Input } from '@oclif/parser/lib/flags';
import { IArg } from '@oclif/parser/lib/args';
export default class Clone extends Command {
    static strict: boolean;
    static usage: string;
    static description: string;
    static flags: Input<any>;
    static args: IArg<string>[];
    run(): Promise<void>;
    cloneRepo(repoUrl: string, repoName: string): void;
    cloneSubmodules(repoName: string, submodules: string[]): string[];
}
