import { ICommandConfig } from '.';

export default {
  syntax: 'uninstall [<names...>]',

  description: 'Gracefully uninstall unneeded submodules',

  alias: 'un',

  options: [
    ['-t, --type', 'Define the type of submodules'],
    ['-p, --path', 'Specifiy a custom path for submodules']
  ],

  action() {
    console.log('Not yet implemented.');
  }
} as ICommandConfig;
