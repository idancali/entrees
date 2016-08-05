var entrees = require('..');

module.exports = function(command) {
  if (!command.options.template) {
    throw new Error('Please specify a template');
  }

  if (!command.options.name) {
    throw new Error('Please specify a name');
  }

  var template = command.options.template;
  var context = {
    appName: command.options.name
  }

  var dir = entrees.generateTarget(template, context);

  console.log('Your new entree is served: ' + dir);
}
