angular.module("DanialGithubPage.Main")
  .directive('mainSection', ["$timeout", "$location", "$window",
  function(timeout, location, $window) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'public/html/mainSection.html',
      link: function(scope, element, attrs, controller) {
        timeout(function(){
          scope.expendSectionBox = true;

        }, 300);

        scope.sectionWrapStyle = {
          "height" : ($window.innerHeight - 160) + "px"
        };

        function setAboutTextHeight(){
          infoHeight = 126;
          scope.aboutTextHeight = {
            "height" : ($window.innerHeight - 236 - infoHeight) + "px"
          };
        };

        function setAboutInfoCardStyle(){
          var aboutInfoWidth = $window.innerWidth * 0.8;
          aboutInfoWidth = aboutInfoWidth > 440 ? 440 : aboutInfoWidth;
          scope.aboutInfoCardStyle = {
            "width" : aboutInfoWidth + "px",
            "margin-left" : - aboutInfoWidth/2 + "px"
          };

        };

        function getSkills(){
          var result = [];
          var skills = [
            "#Data Analysis", "#Deep Learning", "#Neural Network", "#JAVA", "#HTML/CSS", "#AngularJS 1.X", "#Kafka",
            "#Python", "#Flask", "#Web Crawling", "#Scrapy", "#Neural Network", "#Linux", "AWS", "#Spring Boot", "#MySQL", "#MongoDB", "#Gulp",
            "#NodeJs", "#Sketch", "#JPA"
          ];
          for(var i = 0; i < skills.length; i++){
            result.push({
              "txt" : skills[i]
            });
          };

          return result;
        }

        setAboutInfoCardStyle();

        setAboutTextHeight();

        angular.element($window).bind('resize', function(){
          scope.sectionWrapStyle["height"] = ($window.innerHeight - 160) + "px";
          setAboutTextHeight();
          setAboutInfoCardStyle();
          scope.$digest();
        });

        scope.skills = getSkills();

      }
    };

  }]);
