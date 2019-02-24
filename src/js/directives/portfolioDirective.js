angular.module("DanialGithubPage.Main")
  .directive('portfolio', ["$timeout", "$location", "$window", "portfolioFactory", "$rootScope", "loadingViewService",
  function(timeout, location, $window, portfolioFactory, rootScope, loadingViewService) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'public/html/portfolio.html',
      link: function(scope, element, attrs, controller) {
        rootScope.showNotebookUrl = false;

        rootScope.notebookUrl = "";

        portfolioFactory.getPortfolios().then(function(response){
          scope.portfolios = portfolioFactory.csvToJSON(response.data);
        }, function (reason) {
          console.log("Occured error.");
        });

        setListMargin();
        setPortfolioWrapHeight();

        function setListMargin(){
          section_width = $('.section--box')[0].clientWidth;
          section_height = $('.section--box')[0].clientHeight;
          portfolio_ul_width = $('.portfolio--ul')[0].clientWidth;
          portfolio_ul_height = $('.portfolio--ul')[0].clientHeight;
          scope.showcaseWidthStyle = {
            "width" : portfolio_ul_width + 5 + "px",
            "height" : portfolio_ul_height - 20 + "px"
          };
          scope.descriptionHeight = portfolio_ul_height - 40 + "px";
          scope.closeBtnPosition = {
            "right" : (section_width - portfolio_ul_width)/2 - 15 + "px",
            "top" : "0px"
          };
          if(section_width > 800){
            scope.firstColumnMarginLeft = (800 - 645)/2 + "px";
          }else if(section_width > 645){
            scope.firstColumnMarginLeft = (section_width - 645)/2 + "px";
          }else{
            scope.firstColumnMarginLeft = "";
          }

        };

        function setPortfolioWrapHeight(){
          var width = $window.innerWidth;
          var thumbnailWidth = 300;
          scope.portfolioWrapHeight = {
            "height" : ($window.innerHeight - 156) + "px"
          };
          if(width > 900){
            scope.portfolioColStyle = {
              "width" : thumbnailWidth*3 + "px"
            }
          }else if(width > 600){
            scope.portfolioColStyle = {
              "width" : thumbnailWidth*2 + "px"
            }
          }else{
            scope.portfolioColStyle = {
              "width" : thumbnailWidth*1 + "px"
            }
          }

        };

        scope.$watch('portfolio', function(newVal, oldVal){
          setListMargin();
        });

        angular.element($window).bind('resize', function(){
          setListMargin();
          setPortfolioWrapHeight();
          scope.$digest();
        });

        scope.clickPortfolio = function(index){
          if(scope.showcaseWidthStyle.height == "0px") setListMargin();
          scope.showPortfolioDetail = true;
          scope.contents = {};
          angular.copy(scope.portfolios[index], scope.contents);
          timeout(function(){
            scope.isContentsReady = true;
          }, 500);
        }

        scope.closeShowcase = function(){
          scope.isContentsReady = false;
          scope.showPortfolioDetail = false;
          scope.contents.video_url = "";
          timeout(function(){
            scope.contents = {};
          }, 500);
        }

        scope.clickShowNotebookBtn = function(url){
          rootScope.showNotebookUrl = true;
          rootScope.notebookUrl = url;
        }

        rootScope.closeNotebookShowcase = function(){
          rootScope.showNotebookUrl = false;
          rootScope.notebookUrl = "";
        }

      }
    };

  }]);
