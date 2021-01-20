function routerConfig($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider.state('landing', {
    url: '',
    abstract: true,
    views: {
      '': {
        templateUrl: 'screens/landing.view.html'
      },
      'header@landing': {
        templateUrl: 'templates/landing-header.tpl.html'
      },
      'loader@landing': {
        templateUrl: 'templates/loader.tpl.html'
      },
      'footer@landing': {
        templateUrl: 'templates/landing-footer.tpl.html'
      }
    }
  }).state('landing.home', {
    url: '/',
    viewName: "Home",
    views: {
      '': {
        templateUrl: 'screens/home.view.html',
      }
    }
  });
  $urlRouterProvider.otherwise('/');
}

routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
export default routerConfig;
