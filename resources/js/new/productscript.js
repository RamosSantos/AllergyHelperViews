$(function() {
    var $substances = $(".subst-select");
    var responsejson;
    var newIds = 0;

    $substances.select2({
        id: function(data) {
            return data.Value;
        },
        placeholder: 'Use o enter para separar as substancias.',
        minimumInputLength: 2,
        language: {
            inputTooShort: function() {
                return 'Começe a digitar para pesquisar substâncias ou cria-las';
            }
        },
        tags: true,
        createTag: function(params) {
            if (responsejson !== undefined) {
                console.log("Oppa");
            }
            var term = $.trim(params.term);
            if (term === "") {
                return null;
            }

            var optionsMatch = false;
            var arrValue = $(".subst-select").select2('data');


            for (var i = 0; i < responsejson.results.length; i++) {
                if (responsejson.results[i].lower === term.toLowerCase()) {
                    return null;
                }
            }

            for (var j = 0; j < arrValue.length; j++) {
                var var1 = arrValue[j].lower;
                var var2 = term.toLowerCase();
                if (term.toLowerCase() === arrValue[j].text.toLowerCase()) {
                    optionsMatch = true;
                    break;
                }
            }

            if (optionsMatch) {
                return null;
            }
            return {
                id: newIds--,
                lower: term.toLowerCase(),
                text: term
            };
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
        } // novas chaves vão aqui
    });
});

var app = angular.module("productsApp", ["firebase"]);
app.controller("productsCtrl", function($scope, $firebaseObject, $firebaseArray, $timeout) {
    var ref = new Firebase("https://allergyhelper3.firebaseio.com/products");
    var arr = $firebaseArray(ref);
    var arrProduct = $firebaseArray(ref);
    var refSubs = new Firebase("https://allergyhelper3.firebaseio.com/substancies");
    var arrSubs = $firebaseArray(refSubs);
    $scope.loader = true;
    $scope.productsList = arr;
    $scope.productsListArr = arrProduct;
    $scope.substanciesList = arrSubs;
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.limitPage = 0;
    $scope.numberOfPages = function() {
        $scope.limitPage = Math.ceil(arrProduct.length / $scope.pageSize);
        return $scope.limitPage;
    };

    $timeout(function() {
        $scope.$apply(function() {
            $scope.loader = false;
        });
    }, 1200);

    $scope.editItem = function(argElement) {
        var element = argElement.target;
        element = $(element).parent().parent().closest('tr');
        $(element).find("td").each(function() {
            $(this).children().removeAttr('disabled');
            $(this).children("input[type='text']").removeClass('input-table-disable').addClass('form-control');
        });
    };

    // $scope.copyOne = function() {
    //     var pickedIds = $scope.rSubstances;
    //     var pickedPositions = findWithAttr($scope.substMap, '$id', pickedIds);
    //     for (var i = pickedPositions.length - 1; i >= 0; i--) {
    //         $scope.toPickMap.push($scope.substMap[pickedPositions[i]]);
    //         $scope.substMap.splice([pickedPositions[i]], 1);
    //     }
    // };

    // $scope.removeOne = function() {
    //     var pickedIds = $scope.lPicked;
    //     var pickedPositions = findWithAttr($scope.toPickMap, '$id', pickedIds);
    //     for (var i = pickedPositions.length - 1; i >= 0; i--) {
    //         $scope.substMap.push($scope.toPickMap[pickedPositions[i]]);
    //         $scope.toPickMap.splice([pickedPositions[i]], 1);
    //     }
    // };

    $scope.copyOneModal = function() {
        var pickedIds = $scope.rSubstancesModal;
        var pickedPositions = findWithAttr($scope.substMapModal, '$id', pickedIds);
        for (var i = pickedPositions.length - 1; i >= 0; i--) {
            $scope.toPickMapModal.push($scope.substMapModal[pickedPositions[i]]);
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
        $scope.modalItemId = this.productItem.$id;
        $scope.substMapModal = removeA($scope.substMapModal, this.allergyItem);
        if (this.productItem.ingredients !== undefined) {
            currentSimilars = this.productItem.ingredients;
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

    // from an specific array (array) , return also as an array, the indexes of 
    // objects who contains the specific (attr) atribute values (value)
    // Search among all objects by specific atribute (attr) by their values (value)
    // and retur each index as array
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


    $scope.changeSimilar = function() {
        var newSimilarIds = $scope.toPickMapModal.map(
            function(a) {
                return a.$id;
            });
        var someItem = $scope.productsListArr.$getRecord($scope.modalItemId);
        var newSimilarTo = {};
        newSimilarIds.forEach(function(entry) {
            newSimilarTo[entry] = true;
        }, this);
        if (someItem.ingredients === undefined) {
            someItem.ingredients = newSimilarTo;
        } else {
            delete someItem.ingredients;
            someItem.ingredients = newSimilarTo;
        }
        $scope.productsListArr.$save(someItem).then(function(ref) {
            console.log('$scope.items is now', $scope.items);
        });
    };

    $scope.addProduct = function() {
        var product = $scope.product;
        product.lowerCaseName = product.name.toLowerCase();
        var arrIngredients = $(".subst-select").select2('data');

        var ingredients = {};

        var ref = new Firebase("https://allergyhelper3.firebaseio.com/substancies");
        var list = $firebaseArray(ref);
        var arrayOfPromises = [];
        if (arrIngredients !== null) {
            arrIngredients.forEach(function(item) {
                var isItAFireBaseKey = isNaN(+(item.id));

                if (!isItAFireBaseKey) {
                    arrayOfPromises.push(list.$add({
                        commonName: item.text,
                        lowerCaseName: item.text.toLowerCase(),
                        isSimilar: false
                    }).then(function(ref) {
                        return ref.key();
                        // ingredients[id] = true;
                        // console.log("added record with id " + id);
                        // list.$indexFor(id); // returns location in the array
                    }));
                } else {
                    ingredients[item.id] = true;
                }
            });
            Promise.all(arrayOfPromises).then(function(values) {
                for (var i = 0; i < values.length; i++) {
                    ingredients[values[i]] = true;
                }
                product.ingredients = ingredients;
                console.log(product);
                // $scope.productsList.$add(product).then(function() {
                // TODO : Verificar se existe já um cadastrado e informar 
                // ao usuário
                $scope.productsList[product.barCode] = product;
                $scope.productsList.$save().then(function(ref) {
                    ref.key() === $scope.productsList.$id; // true
                    $("#messages").html("Salvo com sucesso").fadeIn(function() {
                        $(this).fadeOut(3000);
                        $scope.product = null;
                    }); // [3, 1337, "foo"] 
                }, function(error) {
                    console.log("Error:", error);
                });
            });
            ////
            // Desta maneira nao há como ter um 'callback' no set() 
            // mas funcionaria usando uma instancia 
            // de $firebaseArray
            //
            // Promise.all(arrayOfPromises).then(function(values) {
            //     for (var i = 0; i < values.length; i++) {
            //         ingredients[values[i]] = true;
            //     }
            //     product.ingredients = ingredients;
            //     console.log(product);
            //     // $scope.productsList.$add(product).then(function() {
            //     $scope.productsList.$ref().child(product.barCode).set(product);
            //     $("#messages").html("Salvo com sucesso").fadeIn(function() {
            //         $(this).fadeOut(3000);
            //         $scope.product = null;
            //     }); // [3, 1337, "foo"] 
            // });
            //product.ingredients = ingredients;
        }


    };

});
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
});
