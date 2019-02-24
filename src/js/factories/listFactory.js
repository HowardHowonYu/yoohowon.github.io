/**
 * Created by NamDaeHyun on 2017. 2. 17..
 */

angular.module("DanialGithubPage.Main")
  .factory("listFactory", function(){

    function getLanguageOption(){
      return [
        {
          "txt"  : "English",
          "code" : "en"
        },
        {
          "txt"  : "Korean",
          "code" : "ko"
        },
        // {
        //   "txt"  : "Mandarin",
        //   "code" : "zh-hans"
        // }
      ];
    }

    return {
      getLanguageOption:getLanguageOption
    };

  });
