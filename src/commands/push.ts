import { ICommandConfig } from './index';

export default {
  syntax: 'push',

  description: 'Pushes commits to submodules and updates root',

  action() {
    console.log('Pushing...');
  }
} as ICommandConfig;
