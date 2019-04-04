var chalk = require('chalk').default;

module.exports = exports = {
  syntax: 'clone <repo> [submodules...]',

  description: 'Clones [--all] submodules from a repo',

  options: [
    ['--all', 'Clone all submodules']
  ],

  action: function (_repo, _submodules) {
    var submodules = _submodules.map(s => chalk.blueBright(s));
    var repo = chalk.yellow(_repo);

    var submodulesStr = '';

    if (submodules) {
      if (submodules.length > 1) {
        var last = submodules.pop();
        var others = submodules.join(', ');

        submodulesStr += `submodules ${others} and ${last}`;
      } else if (submodules.length === 1) {
        submodulesStr += 'submodule ' + String(submodules[0]);
      } else {
        submodulesStr = 'shallow';
      }
    } else if (this.all) {
      submodulesStr = chalk.blueBright('all submodules');
    }

    submodulesStr = submodulesStr ? ` ${submodulesStr} ` : '';

    console.log(`Cloning${submodulesStr}from ${repo}...`);
  }
}
