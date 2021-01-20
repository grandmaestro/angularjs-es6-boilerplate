import angular from 'angular';

import appServices from './js/services';
import appFilters from './js/filters';
import appFactories from './js/factories';
import appDirectives from './js/directives';
import appControllers from './js/controllers';
import appComponents from './js/components';
import appConstants from './js/constants';
import onConfig from './js/app.config'
import onRun from './js/app.run'
import routes from './js/app.routes';
import router from 'angular-ui-router';
import translate from 'angular-translate';
import cookies from 'angular-cookies';
import staticLoader from 'angular-translate-loader-static-files';
import translateStorageCookie from 'angular-translate-storage-cookie';
import translateStorageLocal from 'angular-translate-storage-local';
import moment from 'moment';
import templates from './templates';



const appDependencies = ['appServices', 'appFilters', 'appFactories', 'appDirectives', 'appControllers', 'appComponents', 'appConstants', 'ui.router', 'pascalprecht.translate', 'ngCookies', 'templates'];


window.app = angular.module('App', appDependencies);
angular.module('App')
  .config(onConfig)
  .config(routes)
  .run(onRun);

angular.bootstrap(document, ['App'], {
  strictDi: true
});
