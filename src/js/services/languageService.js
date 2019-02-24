/**
 * Created by NamDaeHyun on 2017. 2. 17..
 */
angular.module("DanialGithubPage.Main")
  .service("languageService", ["$rootScope", "languageFactory", "loadingViewService", "$timeout",
    function($rootScope, languageFactory, loadingViewService, $timeout){
      var service = this;

      service.setLanguage = function(lang){
        $rootScope.languageSelectFlag = !$rootScope.languageSelectFlag;
        if($rootScope.globLang != lang){
          var isLoadingOn = false;
          if($rootScope.globLang != undefined && !isLoadingOn){
            isLoadingOn = true;
            loadingViewService.getLoadingView();
          };
          languageFactory.getLanguage(lang).then(function(response){
            $rootScope.globLang = lang;
            $rootScope.glob = response.data;
            if(isLoadingOn){
              $timeout(function () {
                isLoadingOn = false;
                loadingViewService.removeLoadingView();
              }, 1000);
            };
          }, function (reason) {
            console.log("Occured error.");
          });
        };

      };

  }]);
