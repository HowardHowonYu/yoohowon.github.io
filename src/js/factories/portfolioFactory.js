/**
 * Created by NamDaeHyun on 2017. 2. 17..
 */

angular.module("DanialGithubPage.Main")
  .factory("portfolioFactory", ["$rootScope", "$sce", "$http", function(rootScope, sce, http){

    function setThumbnailStyle(url){
      return {
        "background-image" : "url(" + url + ")",
        "background-size" : "cover",
        "background-repeat" : "no-repeat",
        "background-position" : "50%"
      }
    }

    function csvToJSON(csv){
      var glob = rootScope.glob;
      var path = '../../img/work_thumb/'
      var splited_line = csv.split("\n");
      var keys = splited_line[0].split(",")
      var result = []
      for(var i=1; i<splited_line.length; i++){
        var row = {}
        var data = splited_line[i].split(",");
        for(var j=0; j<keys.length; j++){
          if(keys[j] == "thumbnail"){
            row[keys[j]] = setThumbnailStyle(path + data[j]);
          }else if(keys[j] == "product_url"){
            row[keys[j]] = sce.trustAsResourceUrl(data[j])
          }else{
            row[keys[j]] = data[j]
          }
        };
        result.push(row)
      };
      return result
    };

    function getPortfolios(){
      return http.get("public/asset/text/test.csv")
    };

    return {
      getPortfolios : getPortfolios,
      csvToJSON : csvToJSON
    };

  }]);
