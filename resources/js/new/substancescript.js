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


var app = angular.module("substaciesApp", ["firebase"]);
app.controller("substanciesCrtl", function($scope, $firebaseArray, $firebaseObject, $timeout) {
    var ref = new Firebase("https://allergyhelper3.firebaseio.com/substancies");
    var arr = $firebaseArray(ref);
    $scope.loader = true;

    $scope.substList = arr;

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

    $scope.addSubstance = function() {
        var substance = $scope.substance;
        substance.lowerCaseName = substance.commonName.toLowerCase();
        var arrSimilars = $(".subst-select").val();
        var similarTo = {};

        if (arrSimilars !== null) {
            arrSimilars.forEach(function(item) {
                similarTo[item] = true;
                substance.hasSimilarTo = true;
            });
            substance.similarTo = similarTo;
        } else {
            substance.isSimilar = false;
        }
        $scope.dataList.$add(substance).then(function() {
            $("#messages").html("Salvo com sucesso").fadeIn(function() {
                $(this).fadeOut(3000);
                $scope.substance = "";
            });
        });

    };

    function getModelsByIds(keys) {
        var models = [];
        // var blah = [];
        // blah.push(keys.forEach(function(v, i) {
        //     var ref = new Firebase('https://allergyhelper3.firebaseio.com/substancies/' + keys[i]);
        //     var obj = $firebaseObject(ref);
        //     console.log(ref);
        //     return obj;
        // }));

        // var p3 = new Promise(function(resolve, reject) {
        //     setTimeout(resolve, 100, "foo");
        // });


        // res.end();
        var promisses = [];
        for (var i in keys) {
            var ref = new Firebase('https://allergyhelper3.firebaseio.com/substancies/' + keys[i]);
            var obj = $firebaseObject(ref);
            promisses.push(obj.$loaded());
        }
        Promise.all(promisses).then(function(values) {
            return
            console.log(values); // [3, 1337, "foo"] 
        });
    }

    $scope.selectModal = function(argElement) {
        var item = this.substItem.similarTo;

        var keys = $.map(item, function(v, i) {
            return i;
        });
        // var onekey = keys[0];

        // var blah = getModelsByIds(keys);

        // var ref = new Firebase('https://allergyhelper3.firebaseio.com/substancies/');

        // var obj = $firebaseObject(ref);
        // obj.child('users').child(id).

        // obj.$loaded().then(function(res) {

        //     console.log(res); // res will be the room object

        //     // To iterate the key/value pairs of the object, use angular.forEach()
        //     angular.forEach(obj, function(value, key) {
        //         console.log(key, value);
        //     });
        // });

        // var element = argElement.target;
        // var value = $(element).parent().closest("tr").find("td:first").children().val();
        // var URL = "https://allergyhelper3.firebaseio.com/substancies/" + value + ".json?";
        // xhr = new XMLHttpRequest();
        // xhr.open("GET", URL, false);
        // xhr.send();
        // var resp = xhr.responseText;
        // resp = JSON.stringify(eval('(' + resp + ')'));
        // resp = JSON.parse(resp);
        // data = [];
        var promisses = [];
        for (var i in keys) {
            var ref = new Firebase('https://allergyhelper3.firebaseio.com/substancies/' + keys[i]);
            var obj = $firebaseObject(ref);
            promisses.push(obj.$loaded());
        }
        Promise.all(promisses).then(function(values) {
            console.log(values); // [3, 1337, "foo"] 
            var $element = $('#selectedSubs');
            // for (var item in values) {
            //     data.push(item);
            //     var select = document.getElementById('selectedSubs');
            //     var option = new Option(item, item, true, true);
            //     $element.append(option);
            // }
                  $element.select2("val", values);
        });

        // var $element = $('#selectedSubs');
        // for (var item in resp.similarTo) {
        //     data.push(item);
        //     var select = document.getElementById('selectedSubs');
        //     var option = new Option(item, item, true, true);
        //     $element.append(option);
        // }

        // $element.select2({
        //     data: data,
        //     tags: true
        // });
    };

    $scope.saveSimilar = function() {
        console.log("Saved");
    };

});

// app.controller("substanciesCrtl", function($scope, $firebaseArray) {
//     var ref = new Firebase("https://allergyhelper3.firebaseio.com/substancies");
//     var obj = $firebaseArray(ref);
//     $scope.dataList = obj;

//     $scope.addSubstance = function() {
//         var substance = $scope.substance;
//         substance.lowerCaseName = substance.commonName.toLowerCase();
//         var arrSimilars = $(".subst-select").val();
//         var similarTo = {};
//         if (arrSimilars !== null) {
//             arrSimilars.forEach(function(item) {
//                 similarTo[item] = true;
//             });
//             substance.similarTo = similarTo;
//         } else {
//             substance.isSimilar = false;
//         }
//         $scope.dataList.$add(substance);
//     };
// });

$(".btn-save").click(function() {
    var element = $(this).parent().closest('tr');
    console.log(element);
    $(element).find("td").each(function() {
        $(this).children().Attr('disabled', 'disabled');
        $(this).children("input[type='text']").removeClass('form-control').addClass('input-table-disable');
    });
});
