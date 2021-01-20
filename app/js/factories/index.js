import angular from 'angular';

const bulk = require('bulk-require');
const factoryModule = angular.module('appFactories', []);
const factories = bulk(__dirname, ['./**/!(*index|*.spec).js']);

function declare(factories) {
  Object.keys(factories).forEach((key) => {
    let item = factories[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      factoryModule.factory(item.name, item.fn);
    } else {
      declare(item);
    }
  });
}

declare(factories);

export default factoryModule;
