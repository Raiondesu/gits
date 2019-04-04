import { ICommandConfig } from '.';

export default {
  syntax: 'install <names...>',

  description: '',

  alias: ['i', 'add'],

  options: [
    ['-t, --type', 'Define the type of a submodule'],
    ['-p, --path', 'Specifiy a custom path for installation']
  ],

  action() {
    console.log('Not yet implemented.');
  }
} as ICommandConfig;
