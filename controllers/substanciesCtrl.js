var subs = angular.module("substanciesApp",["firebase"]);
        subs.controller("substanciesCrtl",function($scope,$firebaseArray){
          var ref = new Firebase("https://allergyhelper3.firebaseio.com/substancies");
          $scope.dataList = $firebaseArray(ref);
          console.log($scope.dataList);
    
          var isInputRendered =true;
          $scope.editItem = function(element){ 
            var element = element.target;
            var desc = $(element).closest('td').prev('td').prev('td').text();
            var name = $(element).closest('td').prev('td').prev('td').prev('td').text();
            $(element).closest('td').next('td').find('button').removeAttr('disabled');
            
});

angular.element(document).ready(function() {
  angular.bootstrap(document, ['substanciesCrtl']);
});
