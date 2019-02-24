/**
 * Created by NamDaeHyun on 2017. 2. 17..
 */
angular.module("DanialGithubPage.Main")
  .service("routerService", ["$rootScope", function($rootScope){
      var service = this;

      service.getLoadingView = function(){
        $rootScope.isLoading = true;
      }

      service.removeLoadingView = function(){
        $rootScope.isLoading = false;
      }

  }]);
