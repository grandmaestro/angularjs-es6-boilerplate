import angular from 'angular';

const bulk = require('bulk-require');
const componentModule = angular.module('appComponents', []);
const components = bulk(__dirname, ['./**/!(*index|*.spec).js']);

function declare(components) {
  Object.keys(components).forEach((key) => {
    let item = components[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      componentModule.component(item.name, item.fn);
    } else {
      declare(item);
    }
  });
}

declare(components);

export default componentModule;
