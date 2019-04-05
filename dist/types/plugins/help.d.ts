import Help from '@oclif/plugin-help';
import { Command, Topic } from '@oclif/config';
export default class ColorizedHelp extends Help {
    showCommandHelp(command: Command, topics: Topic[]): void;
}
export * from '@oclif/plugin-help';
