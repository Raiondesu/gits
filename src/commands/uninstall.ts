import { ICommandConfig } from '.';

export default {
  syntax: 'install [<names...>]',

  description: 'Gracefully uninstall unneeded submodules',

  alias: ['un', 'remove'],

  options: [
    ['-t, --type', 'Define the type of submodules'],
    ['-p, --path', 'Specifiy a custom path for submodules']
  ],

  action() {
    console.log('Not yet implemented.');
  }
} as ICommandConfig;
