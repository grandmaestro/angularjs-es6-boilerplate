import angular from 'angular';

const bulk = require('bulk-require');
const filterModule = angular.module('appFilters', []);
const filters = bulk(__dirname, ['./**/!(*index|*.spec).js']);

function declare(filters) {
  Object.keys(filters).forEach((key) => {
    let item = filters[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      filterModule.filter(item.name, item.fn);
    } else {
      declare(item);
    }
  });
}

declare(filters);

export default filterModule;
