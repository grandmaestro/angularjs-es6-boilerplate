import angular from 'angular';

const bulk = require('bulk-require');
const serviceModule = angular.module('appServices', []);
const services = bulk(__dirname, ['./**/!(*index|*.spec).js']);

function declare(services) {
  Object.keys(services).forEach((key) => {
    let item = services[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      serviceModule.service(item.name, item.fn);
    } else {
      declare(item);
    }
  });
}

declare(services);

export default serviceModule;
