/**
 * Created by NamDaeHyun on 2017. 1. 3..
 */
angular.module("DanialGithubPage.Main")
    .directive('compileTemplate', ["$compile", "$parse", function($compile, $parse){
        return {
            link: function(scope, element, attr){
                var parsed = $parse(attr.ngBindHtml);
                function getStringValue() { return (parsed(scope) || '').toString(); }

                //Recompile if the template changes
                scope.$watch(getStringValue, function() {
                    $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
                });
            }
        }
    }]);
