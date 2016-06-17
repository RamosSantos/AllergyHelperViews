var app = angular.module("allergiesApp", ["firebase"]);
app.controller("allergiesCtrl", function($scope, $firebaseArray, $firebaseObject, $timeout) {
	var ref = new Firebase("https://allergyhelper3.firebaseio.com/allergies");
	var refSubs = new Firebase("https://allergyhelper3.firebaseio.com/substancies");
    var arr = $firebaseArray(ref);
    var arrSubs = $firebaseArray(refSubs);
    var obj = $firebaseObject(ref);
    $scope.loader = true;

    $scope.allergiesList = arr;
    $scope.substanciesList = arrSubs;
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.limitPage = 0;
    $scope.toPickMap = [];
    $scope.toPickMapModal = [];
    $scope.numberOfPages=function(){
        $scope.limitPage = Math.ceil(arr.length/$scope.pageSize); 
        return $scope.limitPage;             
    };

    $scope.loadDual = function(){
        $scope.substMap = [].concat($scope.substanciesList);
        console.log('dual carregado');
    }

     $scope.editItem = function(argElement) {
        var element = argElement.target;
        element = $(element).parent().parent().closest('tr');
        $(element).find("td").each(function() {
            $(this).children().removeAttr('disabled');
            $(this).children("input[type='text']").removeClass('input-table-disable').addClass('form-control');
        });
    };

    $scope.copyOne = function() {
        var pickedIds = $scope.rSubstancies;
        var pickedPositions = findWithAttr($scope.substMap, '$id', pickedIds);
        for (var i = pickedPositions.length - 1; i >= 0; i--) {
            $scope.toPickMap.push($scope.substMap[pickedPositions[i]]);
            $scope.substMap.splice([pickedPositions[i]], 1);
        }
        
    };

    $scope.removeOne = function() {
        var pickedIds = $scope.lPicked;
        var pickedPositions = findWithAttr($scope.toPickMap, '$id', pickedIds);
        for (var i = pickedPositions.length - 1; i >= 0; i--) {
            $scope.substMap.push($scope.toPickMap[pickedPositions[i]]);
            $scope.toPickMap.splice([pickedPositions[i]], 1);
        }
    };

    $scope.copyOneModal = function() {
        var pickedIds = $scope.rSubstancesModal;
        var pickedPositions = findWithAttr($scope.substMapModal, '$id', pickedIds);
        for (var i = pickedPositions.length - 1; i >= 0; i--) {
            $scope.toPickMapModal.push($scope.substMap[pickedPositions[i]]);
            $scope.substMapModal.splice([pickedPositions[i]], 1);
        }
        
    };

    $scope.removeOneModal = function() {
        var pickedIds = $scope.lPickedModal;
        var pickedPositions = findWithAttr($scope.toPickMapModal, '$id', pickedIds);
        for (var i = pickedPositions.length - 1; i >= 0; i--) {
            $scope.substMapModal.push($scope.toPickMapModal[pickedPositions[i]]);
            $scope.toPickMapModal.splice([pickedPositions[i]], 1);
        }
    };

    $scope.selectModal = function(argElement) {
        var currentSimilars;
        $scope.toPickMapModal = [];
        $scope.substMapModal = [].concat($scope.substanciesList);
        $scope.modalItemId = this.allergyItem.$id;
        $scope.substMapModal = removeA($scope.substMapModal, this.allergyItem);
        if (this.allergyItem.substances !== undefined) {
            currentSimilars = this.allergyItem.substances;
            var keys = $.map(currentSimilars, function(v, i) {
                return i;
            });
            var blah = findWithAttr($scope.substMapModal, '$id', keys);
            for (var i = blah.length - 1; i >= 0; i--) {
                $scope.toPickMapModal.push($scope.substMapModal[blah[i]]);
                $scope.substMapModal.splice(blah[i], 1);
            }
        }
    };

    $scope.changeSimilar = function() {
        var newSimilarIds = $scope.toPickMapModal.map(
            function(a) {
                return a.$id;
            });
        var someItem = $scope.allergiesList.$getRecord($scope.modalItemId);
        var newSimilarTo = {};
        newSimilarIds.forEach(function(entry) {

            newSimilarTo[entry] = true;


        }, this);
        if (someItem.substances === undefined) {
            someItem.substances = newSimilarTo;
        } else {
            delete someItem.substances;
            someItem.substances = newSimilarTo;
        }
        $scope.allergiesList.$save(someItem).then(function() {
           $("#messagesModal").html("Alterado com sucesso").fadeIn(function() {
                $(this).fadeOut(3000);

            });
        });

    };

    $timeout(function() {
        $scope.$apply(function() {
            $scope.loader = false;
            
        });
    }, 1500).then(function(){
        $scope.loadDual();
    });

    $scope.addAllergy = function(){
    	var allergy = $scope.allergy;
    	var newSimilarIds = $scope.toPickMap.map(
            function(a) {
                return a.$id;
            });
        var newSimilarTo = {};
        newSimilarIds.forEach(function(entry) {
            newSimilarTo[entry] = true;
        }, this);
        allergy.substances = newSimilarTo;
        if($.isEmptyObject(newSimilarTo)){
          $("#messages").html("Preencha as substâncias").fadeIn(function() {
                $(this).fadeOut(3000);

            });
            return;  
        }
        $scope.allergiesList.$add(allergy).then(function(){
        	allergy.commonName ="";
        	allergy.description = "";
        	$scope.toPickMap = [];
        	$("#messages").html("Salvo com sucesso").fadeIn(function() {
                $(this).fadeOut(3000);

            });
        });
    	
    }

     
});
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
});

function findWithAttr(array, attr, value) {
    var indexes = [];
    if (value.length > 0 && attr !== '') {
        for (var i = 0; i < array.length; i += 1) {
            if ((value.indexOf(array[i][attr]) > -1)) {
                indexes.push(i);
            }
        }
    }
    return indexes;
}

function removeA(arr) {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}