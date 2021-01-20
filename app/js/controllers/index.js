import angular from 'angular';

const bulk = require('bulk-require');
const controllerModule = angular.module('appControllers', []);
const controllers = bulk(__dirname, ['./**/!(*index|*.spec).js']);

function declare(controllers) {
  Object.keys(controllers).forEach((key) => {
    let item = controllers[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      controllerModule.controller(item.name, item.fn);
    } else {
      declare(item);
    }
  });
}

declare(controllers);

export default controllerModule;
