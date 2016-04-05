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
app.controller("substanciesCrtl", function($scope, $firebaseArray, $timeout) {
    var ref = new Firebase("https://allergyhelper3.firebaseio.com/substancies");
    var arr = $firebaseArray(ref);
    $scope.loader = true;

    $scope.dataList = arr;

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
        $scope.dataList.$add(substance).then(function(){
			$("#messages").html("Salvo com sucesso").fadeIn(function(){
				$(this).fadeOut(3000);
				$scope.substance = "";
			});
		});
		
    };
	
	$scope.selectModal = function(argElement){
		var element = argElement.target
		var value = $(element).parent().closest("tr").find("td:first").children().val();
		var URL = "https://allergyhelper3.firebaseio.com/substancies/"+value+".json?";
		xhr = new XMLHttpRequest();
        xhr.open("GET", URL, false);
        xhr.send();
        var resp = xhr.responseText;
        resp = JSON.stringify(eval('(' + resp + ')'));
        resp = JSON.parse(resp);
        $scope.selectSubs = resp;
        
	}

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
