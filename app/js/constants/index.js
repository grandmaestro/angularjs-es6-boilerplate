import angular from 'angular';

const bulk = require('bulk-require');
const constantModule = angular.module('appConstants', []);
const constants = bulk(__dirname, ['./**/!(*index|*.spec).js']);

function declare(constants) {
  Object.keys(constants).forEach((key) => {
    let item = constants[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      constantModule.constant(item.name, item.fn);
    } else {
      declare(item);
    }
  });
}

declare(constants);

export default constantModule;
