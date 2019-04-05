import { Hook } from '@oclif/config';
import { spawnSync } from 'child_process';

const hook: Hook.CommandNotFound = async function (_opts) {
  spawnSync('git', process.argv.slice(3), { stdio: 'inherit' });

  this.exit(0);
};

export default hook;
