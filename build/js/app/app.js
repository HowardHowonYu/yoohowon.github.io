'use strict';

/**
 * Created by NamDaeHyun on 2016. 12. 28..
 */
var myModule = angular.module('DanialGithubPage', ['ngRoute', 'ngAnimate', 'DanialGithubPage.Main', 'angular-google-analytics']);

myModule.config(["$routeProvider", "AnalyticsProvider", function ($routeProvider, AnalyticsProvider) {
  $routeProvider
  // .when('/welcome', {
  //     templateUrl: 'public/html/welcome.html'
  // })
  .when('/main/:section', {
    templateUrl: 'public/html/main.html'
    // controller: 'SettingCtrl',
    // controllerAs: 'set'
  }).otherwise({ redirectTo: '/main/work' });
  window.dataLayer = window.dataLayer || [];
  var url = window.location.href; // Returns full URL
  if (!url.includes("127.0.0.1:8080")) {
    AnalyticsProvider.setAccount('UA-134152064-1');
  }
}]);

myModule.run(["Analytics", "languageService", function (Analytics, languageService) {
  languageService.setLanguage("ko");
}]);

angular.element(function () {
  // angular.bootstrap(document, ['DanialGithubPage']);
});