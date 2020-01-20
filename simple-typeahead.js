(function ($) {
    $.fn.simple_typeahead = function (options) {


        function Typeahead(el, args) {
            let autocomplete = this;

            var settings = $.extend({
                data: null,
                onSelected: function (e) {

                },
                displayExpr: 'Name',
                keyExpr: 'Id',
                minSuggestions: 5,
                autoCompleteEnabled: false,
                placeHolderText: '--Select--',
                nosuggestionsText: '--No Suggestions--',
                minChars: 1,
                isremoteoptionenabled: false,
                orientation: 'bottom',
                searchmode: 'begins',
                highlightsearchkey: false
            }, args);

            let utils = {
                helper: (function () {
                    return {
                        getParentContainer: function (width) {
                            let div = document.createElement('div');
                            div.setAttribute('class', 'autocomplete');
                            div.style.width = width + 'px';
                            return div;
                        },
                        getNoSuggestionsDiv: function (width, nosuggestionstext) {
                            let divP = document.createElement('div');
                            divP.setAttribute('class', 'autocomplete-items no-suggestions');
                            divP.style.width = width + 'px';
                            let div = document.createElement('div');
                            div.style.fontStyle = "italic";
                            if (nosuggestionstext.substr(0) == '-') {
                                div.innerHTML = nosuggestionstext;
                            }
                            else {
                                div.innerHTML = "--" + nosuggestionstext + "--";
                            }
                            divP.appendChild(div);
                            return divP;
                        }
                    }
                })(),
                keycodes: {
                    DOWN: 40,
                    UP: 38,
                    ESC: 27,
                    ENTER: 13,
                    SPACE: 32,
                    RIGHT: 39,
                    LEFT: 37,
                    TAB: 9
                }
            };

            autocomplete.initialize = function () {
                autocomplete.element = el;
                autocomplete.el = $(el);
                autocomplete.settings = settings;

                autocomplete.el.val('');
                autocomplete.el.attr("placeholder", autocomplete.settings.placeHolderText); // Set placeholder if any.
                autocomplete.el.attr("autocomplete", "off");
                autocomplete.initContainer();
                autocomplete.initEvents();
            };

            autocomplete.logError = function (message) {
                console.error(message);
            }

            // init wrapper container on the input element.
            autocomplete.initContainer = function () {
                let el = autocomplete.el, parentContainer = utils.helper.getParentContainer(el.width);
                el.wrap(parentContainer);
            };

            autocomplete.initEvents = function () {
                let control = autocomplete.el;

                control.on("focus.autocomplete", function (e) {
                    let text = this.value;
                    autocomplete.handleInputChange(text);
                });

                control.on("input propertychange paste", function (e) {
                    let text = this.value;
                    autocomplete.handleInputChange(text);
                });

                control.on("blur.autocomplete", function (e) {

                });

                control.on("keypress", function (e) {

                });

                control.on("keydown.autocomplete", function (e) {
                    let __autocomplete_list, __active_element = $('.autocomplete-items div.autcomplete-active');
                    if (e.keyCode == utils.keycodes.DOWN) {
                        __autocomplete_list = $('.autocomplete-items div')[0];
                    }
                    if (e.keyCode == utils.keycodes.UP) {
                        __autocomplete_list = $('.autocomplete-items div')[$('.autocomplete-items div').length - 1];
                    }
                    if (__autocomplete_list != undefined) {
                        __autocomplete_list.setAttribute('class', 'autocomplete-active');
                        __autocomplete_list.focus();
                        $(__active_element).removeClass('autocomplete-active');
                    }
                });
            };

            autocomplete.handleInputChange = function (text) {
                if (text.length >= autocomplete.settings.minChars) {
                    let data = autocomplete.getSuggestions();
                    if (data)
                        autocomplete.buildsuggestionslist(data, text);
                    else
                        autocomplete.showNoSuggestionsBox();
                }
            };

            autocomplete.showNoSuggestionsBox = function () {
                let nosuggestionsdiv = utils.helper.getNoSuggestionsDiv(autocomplete.el.width, autocomplete.settings.nosuggestionsText);
                let that = autocomplete.element;
                that.parentNode.appendChild(nosuggestionsdiv);
            };

            autocomplete.closeSuggestionsBox = function (elmnt) {
                var x = document.getElementsByClassName("autocomplete-items");
                for (var i = 0; i < x.length; i++) {
                    if (elmnt != x[i]) {
                        x[i].parentNode.removeChild(x[i]);
                    }
                }

                if ($(".no-suggestions").length >= 1) {
                    $(".no-suggestions").remove();
                }
            }

            autocomplete.getSuggestions = function () {
                let options = autocomplete.settings;
                let element = options.element;
                let dataSource = options.data;
                if (dataSource == null || dataSource == undefined)
                    autocomplete.logError("Source not defined");


                if (Array.isArray(dataSource)) {
                    return dataSource;
                }

                if (typeof dataSource == "function") {
                    dataSource(element.value, function (result) {
                        return result;
                    });
                }
            }

            autocomplete.buildsuggestionslist = function (data, searchterm) {
                if (!data)
                    return;

                autocomplete.closeSuggestionsBox();
                let that = autocomplete.element, el = autocomplete.el;
                var div, s;
                /*create a DIV element that will contain the items (values):*/
                div = document.createElement("DIV");
                div.setAttribute("id", that.id + "autocomplete-list");
                div.setAttribute("class", "autocomplete-items");
                /*append the DIV element as a child of the autocomplete container:*/
                that.parentNode.appendChild(div);

                let isSuggestionFound = false;
                for (var i = 0; i < data.length; i++) {
                    let currentObj = this.getDataFromObject(data[i], searchterm);
                    if (currentObj != undefined) {
                        isSuggestionFound = true;
                        s = document.createElement("DIV");
                        let innerHtml = "<strong " + (this.settings.highlightsearchkey ? " class='hightlight-search-key' " : "") + ">" + currentObj.displayObject.substr(0, searchterm.length) + "</strong>";
                        innerHtml += currentObj.displayObject.substr(searchterm.length);
                        innerHtml += "<input type='hidden' value='" + currentObj.displayObject + "'>";
                        s.innerHTML = innerHtml;
                        s.addEventListener("click", function (e) {
                            alert('click');
                            autocomplete.settings.onSelected.call(e);
                        });
                        s.addEventListener("onenter", function (e) {
                            alert('enter');
                        });
                        s.addEventListener("keypress", function (e) {
                            alert('keypress');
                        });
                        s.addEventListener("keydown", function (e) {
                            alert('onkeydown');
                        });
                        s.addEventListener("blur", function (e) {
                            alert('onblur');
                        });
                        s.addEventListener("onkeyup", function (e) {
                            alert('keyup');
                        });
                        div.appendChild(s);
                    }
                }
                if (!isSuggestionFound) {
                    autocomplete.showNoSuggestionsBox(el.width, autocomplete.settings.nosuggestionsText);
                }
            }

            autocomplete.handleItemKeyPress = function (e) {
                if (e) {

                }
            };

            autocomplete.handleItemBlur = function (e) {
                if (e) { }
            };

            autocomplete.handleItemCllick = function (e) {
                if (e) { }
            };
            autocomplete.getDataFromObject = function (currentObject, searchterm) {
                const searchmode = this.settings.searchmode;
                const isplainobject = typeof (currentObject) === 'string';
                let objecttoreturn = undefined;
                if (searchmode == 'begins') {
                    if (isplainobject) {
                        if (currentObject.substr(0, searchterm.length).toUpperCase() == searchterm.toUpperCase()) {
                            objecttoreturn = {
                                displayObject: currentObject,
                                keyObject: currentObject
                            }
                        }
                    }
                    else {
                        let dataValue = currentObject[this.settings.displayExpr];
                        let keyValue = currentObject[this.settings.keyExpr];
                        if (dataValue == undefined)
                            autocomplete.logError("The display expression was not found. Make sure the displayExpr key is correct");

                        if (dataValue.substr(0, searchterm.length).toUpperCase() == searchterm.toUpperCase()) {
                            objecttoreturn = {
                                displayObject: dataValue,
                                keyObject: keyValue
                            }
                        }
                    }
                }
                else {
                    if (isplainobject) {
                        if (currentObject.toUpperCase().indexOf(searchterm.toUpperCase()) > -1) {
                            objecttoreturn = {
                                displayObject: currentObject,
                                keyObject: currentObject
                            }
                        }
                    }
                    else {
                        let dataValue = currentObject[this.settings.displayExpr];
                        let keyValue = currentObject[this.settings.keyExpr];
                        if (dataValue == undefined)
                            autocomplete.logError("The display expression was not found. Make sure the displayExpr key is correct");

                        if (dataValue.toUpperCase().indexOf(searchterm.toUpperCase()) > -1) {
                            objecttoreturn = {
                                displayObject: dataValue,
                                keyObject: keyValue
                            }
                        }
                    }
                }

                return objecttoreturn;
            }

            autocomplete.initialize();

        }

        return this.each(function () {
            var element = this;

            var instance = new Typeahead(element, options);
        })
    }
})(jQuery)
