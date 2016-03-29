$(function() {
    var $tags = $(".js-example-tags");
    var responsejson;
    var newIds = 0;

    function matchStart(term, text) {
        if (text.toUpperCase().indexOf(term.toUpperCase()) == 0) {
            return true;
        }

        return false;
    }

    $.fn.select2.amd.require(['select2/compat/matcher'], function(oldMatcher) {
        $tags.select2({
            matcher: oldMatcher(matchStart),
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
                var arrValue = $(".js-example-tags").select2('data');

                for (var i = 0; i < responsejson.results.length; i++) {
                    if (responsejson.results[i].lower === term.toLowerCase()) {
                        return null;
                    }
                }

                for (var j = 0; j < arrValue.length; j++) {
                    var var1 = arrValue[j].lower;
                    var var2 = term.toLowerCase();
                    if (term.toLowerCase() === arrValue[j].lower) {
                        optionsMatch = true;
                        break;
                    }
                }

                if (optionsMatch) {
                    return null;
                }
                return {
                    id: newIds--,
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
});