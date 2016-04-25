$(function() {
    $(".subst-select").select2({
        placeholder: 'Use o enter para separar as substancias.',
        minimumInputLength: 2,
        dataType: 'json',
        language: {
            inputTooShort: function() {
                return 'Começe a digitar para pesquisar substâncias ou cria-las';
            }
        },
        createTag: function(params) {
            return null;
        },
        ajax: {
            url: 'https://allergyhelper3.firebaseio.com/substancies.json?',
            dataType: 'json',
            data: function(params) {
                var unicode = "\uf8ff";
                var startAt = '"' + params.term + '"';
                var endAt = '"' + params.term + unicode + '"';
                var query = {
                    orderBy: "\"lowerCaseName\"",
                    startAt: startAt.toLowerCase(),
                    endAt: endAt.toLowerCase(),
                    print: "\"pretty\""
                };
                // Query paramters will be ?search=[term]&page=[page]
                return query;
            },
            processResults: function(data, key) {
                responsejson = {
                    results: $.map(data, function(obj, key) {
                        return {
                            id: key,
                            lower: obj.lowerCaseName,
                            text: obj.commonName
                        };
                    })
                };
                return responsejson;
            }
        }
    });
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

var app = angular.module("substaciesApp", ["firebase", "fxpicklist"]);
app.controller("substanciesCrtl", function($scope, $firebaseArray, $firebaseObject, $timeout) {
    var ref = new Firebase("https://allergyhelper3.firebaseio.com/substancies");
    var arr = $firebaseArray(ref);
    var obj = $firebaseObject(ref);
    $scope.loader = true;

    $scope.substList = arr;
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.limitPage = 0;
    $scope.numberOfPages=function(){
         $scope.limitPage = Math.ceil(arr.length/$scope.pageSize); ;
        return $scope.limitPage;             
    }

   

    $timeout(function() {
        $scope.$apply(function() {
            $scope.loader = false;
        });
    }, 1200);

    $scope.similarChange = function() {
        var test = $(".subst-select").is(':disabled');
        $(".subst-select").prop("disabled", test ? false : true);
    };

    $scope.editItem = function(argElement) {
        var element = argElement.target;
        element = $(element).parent().parent().closest('tr');
        $(element).find("td").each(function() {
            $(this).children().removeAttr('disabled');
            $(this).children("input[type='text']").removeClass('input-table-disable').addClass('form-control');
        });
    };

    $scope.copyOne = function() {
        var pickedIds = $scope.rSubstances;
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

    $scope.selectModal = function(argElement) {
        var currentSimilars;
        $scope.toPickMap = [];
        $scope.substMap = [].concat($scope.substList);
        $scope.modalItemId = this.substItem.$id;
        $scope.substMap = removeA($scope.substMap, this.substItem);
        if (this.substItem.similarTo !== undefined) {
            currentSimilars = this.substItem.similarTo;
            var keys = $.map(currentSimilars, function(v, i) {
                return i;
            });
            var blah = findWithAttr($scope.substMap, '$id', keys);
            for (var i = blah.length - 1; i >= 0; i--) {
                $scope.toPickMap.push($scope.substMap[blah[i]]);
                $scope.substMap.splice(blah[i], 1);
            }
        }
    };

    $scope.changeSimilar = function() {
        var newSimilarIds = $scope.toPickMap.map(
            function(a) {
                return a.$id;
            });
        var someItem = $scope.substList.$getRecord($scope.modalItemId);
        var newSimilarTo = {};
        newSimilarIds.forEach(function(entry) {

            newSimilarTo[entry] = true;


        }, this);
        if (someItem['similarTo'] === undefined) {
            someItem['similarTo'] = newSimilarTo;
        } else {
            delete someItem['similarTo'];
            someItem['similarTo'] = newSimilarTo;
        }
        $scope.substList.$save(someItem).then(function(ref) {
            console.log('$scope.items is now', $scope.items);
        });

    };

    $scope.addSubstance = function() {
        var substance = $scope.substance;
        substance.lowerCaseName = substance.commonName.toLowerCase();
        var arrSimilars = $(".subst-select").val();
        var arrSimilars2 = $(".similarSelect").select2('data');
        var arrSimilars3 = $("#similarSelect").select2('data');

        var similarTo = {};

        if (arrSimilars !== null) {
            arrSimilars.forEach(function(item) {
                similarTo[item] = true;
                
            });
            substance.similarTo = similarTo;
        } else {
            substance.isSimilar = false;
        }
        $scope.substList.$add(substance).then(function() {
            $("#messages").html("Salvo com sucesso").fadeIn(function() {
                $(this).fadeOut(3000);
                $scope.substance = "";
            });
        });

    };



});
app.filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    });

$(".btn-save").click(function() {
    var element = $(this).parent().closest('tr');
    console.log(element);
    $(element).find("td").each(function() {
        $(this).children().Attr('disabled', 'disabled');
        $(this).children("input[type='text']").removeClass('form-control').addClass('input-table-disable');
    });
});
