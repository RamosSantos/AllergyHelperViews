$(function() {

    $(".similar-enabler").on("click", function() {
        $(".subst-select").prop("disabled", false);
    });

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

<<<<<<< HEAD
    $('.form-control.casnum').on('keyup', function() {
=======
    $('#casnum').on('keyup', 'input', function() {
>>>>>>> origin/master
        var limit = parseInt($(this).attr('maxlength'));
        if (this.value.length === limit) {
            $(this).next().focus();
        }
    });

    $("#checkboxSimilar").change(function() {
        var test = $(".subst-select").is(':disabled');
        $(".subst-select").prop("disabled", test ? false : true);
    });
});

<<<<<<< HEAD
=======
$('#submit').click(function(){
    alert("Clicou");
});
>>>>>>> origin/master

var app = angular.module("substaciesApp", ["firebase"]);
app.controller("substanciesCrtl", function($scope, $firebaseArray) {
    var ref = new Firebase("https://allergyhelper3.firebaseio.com/substancies");
    $scope.dataList = $firebaseArray(ref);

<<<<<<< HEAD
    $scope.submitForm = function(){
        var casnum = $scope.casnum1+$scope.casnum2+$scope.casnum3;       
    };

    
    $scope.editItem = function(argElement) {
        var element = argElement.target;
        $(element).closest('td').next('td').find('button').removeAttr('disabled');
        var name = $(element).closest('td').prev('td').prev('td').children();
        var desc = $(element).closest('td').prev('td').prev('td').prev('td').children();
        name.removeAttr('disabled');
        name.addClass('form-control').removeClass('input-table-disable');
        desc.removeAttr('disabled');
        desc.addClass('form-control').removeClass('input-table-disable');      
=======
    $scope.someMethod = function(){
        alert("Did something");
    };

    var isInputRendered = true;
    $scope.editItem = function(argElement) {
        var element = argElement.target;
        $(element).closest('td').next('td').find('button').removeAttr('disabled');
>>>>>>> origin/master
    };
});
