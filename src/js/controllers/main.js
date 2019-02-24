angular.module("DanialGithubPage.Main", []);

angular.module("DanialGithubPage.Main")
  .controller("MainCtrl" , ["$scope", "languageService", "listFactory", "$timeout", "$location", "$rootScope", "$routeParams", "loadingViewService",
  function($scope, languageService, listFactory, $timeout, $location, $rootScope, $routeParams, loadingViewService){
      var main = this;

      var isJustIn = true;

      // languageService.setLanguage("en");

      function getNavs(section){
        if(main.navs != undefined) return;
        if(section == undefined) section = "work";
        main.navs = [
          {
            "txt" : "Work",
            "active" : section == "work" ? true : false,
            "code" : "work"
          },
          {
            "txt" : "About",
            "active" : section == "about" ? true : false,
            "code" : "about"
          },
          {
            "txt" : "Contact",
            "active" : section == "contact" ? true : false,
            "code" : "contact"
          }
        ];
      }

      function checkNavActive(section){
        var active_index = -1;
        for(var i = 0; i < main.navs.length; i ++){
          if(main.navs[i].active){
            active_index = i;
          }
        }
        code = main.navs[active_index].code;
        if(code != section){
          for(var i = 0; i < main.navs.length; i ++){
            if(main.navs[i].code == section){
              active_index = i;
            };
            main.navs[i].active = false;
          }
          main.navs[active_index].active = true;
        }
      }

      $rootScope.$watch('languageSelectFlag',function(newVal, oldVal){
        getNavs(main.section);
      });

      $scope.$on('$routeChangeStart', function($event, next, current) {
        if("$$route" in next){
          originalPath = next.$$route.originalPath;
          route = originalPath.split("/")[1];
          section = next.params.section;

          if(isJustIn){
            main.section = section;
            checkNavActive(section);
            isJustIn = false;
          }

          if(route == "main"){
            if(!main.showNav) main.showNav = true;
            if(main.section != section){
              $timeout(function () {
                loadingViewService.removeLoadingView();
                if(section != undefined){
                  main.section = section;
                  checkNavActive(section);
                }
              }, 500);
            }
          }else{
            main.showNav = false;
          }
        }
      });

      main.goToHome = function(){
        main.clickNav(0);
        // main.showNav = false;
        // $location.path("/");
        // main.navs.length = 0;
      }

      main.clickNav = function(index){
        var active_index = -1;
        for(var i = 0; i < main.navs.length; i ++){
          if(main.navs[i].active){
            active_index = i;
          }
          main.navs[i].active = false;
        }
        main.navs[index].active = true;
        if(active_index != index){
          loadingViewService.getLoadingView();
          main.section = undefined;
          $timeout(function(){
            $location.path("/main/" + main.navs[index].code);
          }, 500);
        }
      }

  }]);
