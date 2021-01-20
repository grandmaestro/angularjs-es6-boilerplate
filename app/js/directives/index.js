import angular from 'angular';

const bulk = require('bulk-require');
const directiveModule = angular.module('appDirectives', []);
const directives = bulk(__dirname, ['./**/!(*index|*.spec).js']);

function declare(directives) {
  Object.keys(directives).forEach((key) => {
    let item = directives[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      directiveModule.directives(item.name, item.fn);
    } else {
      declare(item);
    }
  });
}

declare(directives);

export default directiveModule;
