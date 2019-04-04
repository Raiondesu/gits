export interface ICommandConfig {
    syntax: string;
    description?: string;
    options?: [string, string][];
    alias?: string;
    action(this: typeof import('commander'), ...args: any[]): void;
}
export default function (program: typeof import('commander')): void;
