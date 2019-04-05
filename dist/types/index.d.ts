import { Command } from '@oclif/command';
declare const _default: {
    new (argv: string[], config: import("@oclif/config").IConfig): {
        run(): Promise<void>;
        argv: string[];
        config: import("@oclif/config").IConfig;
        id: string | undefined;
        debug: (...args: any[]) => void;
        readonly ctor: typeof Command;
        _run<T>(): Promise<T | undefined>;
        exit(code?: number | undefined): never;
        warn(input: string | Error): void;
        error(input: string | Error, options: {
            code?: string | undefined;
            exit: false;
        }): void;
        error(input: string | Error, options?: {
            code?: string | undefined;
            exit?: number | undefined;
        } | undefined): never;
        log(message?: string | undefined, ...args: any[]): void;
        init(): Promise<any>;
        parse<F, A extends {
            [name: string]: any;
        }>(options?: import("@oclif/parser").Input<F> | undefined, argv?: string[] | undefined): import("@oclif/parser").Output<F, A>;
        catch(err: any): Promise<any>;
        finally(_: Error | undefined): Promise<any>;
        _help(): never;
        _helpOverride(): boolean;
        _version(): never;
        _swallowEPIPE(): void;
    };
    _base: string;
    id: string;
    title: string | undefined;
    description: string | undefined;
    hidden: boolean;
    usage: string | string[] | undefined;
    help: string | undefined;
    aliases: string[];
    strict: boolean;
    parse: boolean;
    flags?: import("@oclif/command/lib/flags").Input<any> | undefined;
    args?: import("@oclif/parser/lib/args").IArg<string>[] | undefined;
    plugin: import("@oclif/config").IPlugin | undefined;
    examples: string[] | undefined;
    parserOptions: {};
    run: (argv?: string[] | undefined, config?: import("@oclif/config").LoadOptions) => PromiseLike<any>;
};
export = _default;
