angular.module("DanialGithubPage.Main")
  .directive('selectLanguage', ["$timeout", "$location", "languageService", "listFactory", "$window",
  function(timeout, location, languageService, listFactory, $window) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'public/html/selectLanguage.html',
      link: function(scope, element, attrs, controller) {
        timeout(function(){
          scope.isJustEntered = true;
        }, 300);

        scope.languageSelectWrapStyle = {
          "height" : ($window.innerHeight - 160) + "px"
        }

        angular.element($window).bind('resize', function(){
          scope.languageSelectWrapStyle["height"] = ($window.innerHeight - 160) + "px"
          scope.$digest();
        });

        scope.languageList = listFactory.getLanguageOption();

        scope.selectLanguage = function(index){
          languageService.setLanguage(scope.languageList[index].code);
          if(scope.isJustEntered){
            scope.isJustEntered = false;
            location.path("/main/about");
          };
        };

      }
    };

  }]);
