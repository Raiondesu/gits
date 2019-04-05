import Command from '@oclif/command';
import { color } from '@oclif/color';

export const Colorized = function <T extends typeof Command>(target: T) {
  if (target.description) {
    target.description = color.greenBright(target.description);
  }

  if (target.args) {
    target.args.forEach(a => {
      if (a.description) {
        a.description = color.cyanBright(a.description);
      }
    });
  }

  if (target.flags) {
    for (const flag in target.flags) {
      const f = target.flags[flag];

      if (f && f.description) {
        f.description = color.blueBright(f.description);
      }
    }
  }

  return target;
};
