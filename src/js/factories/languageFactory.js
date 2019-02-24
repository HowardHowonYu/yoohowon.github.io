/**
 * Created by NamDaeHyun on 2017. 2. 17..
 */

angular.module("DanialGithubPage.Main")
  .factory("languageFactory", ["$http", function($http){

      function getLanguage(lang){
        return $http.get("public/asset/text/" + lang + ".json")
      };

      return {
        getLanguage:getLanguage
      };

  }]);
