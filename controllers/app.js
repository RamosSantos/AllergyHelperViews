var indexApp = angular.module('indexApp',[]);
indexApp.config(["$routeProvider",function($routeProvider){
	$routeProvider.when('substancies'{
		templateUrl : "substancies.html"
		controller 	: "controller/substanciesCtrl.js"
	}).when('allergies',{
		templateUrl : "allergies.html"
	})
}]);