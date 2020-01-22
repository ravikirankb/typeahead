(function ($) {
    $.fn.simple_typeahead = function (options) {


        function Typeahead(el, args) {
            let ac = this;

            ac.classes = {
                selected_item: ".autocomplete-active",
                suggestionsbox: ".autocomplete-items"
            };

            ac.topsuggestion = "";
            ac.selectedIndex = 0;

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
                highlightsearchkey: true
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

            ac.initialize = function () {
                ac.element = el;
                ac.el = $(el);
                ac.settings = settings;

                ac.el.val('');
                ac.el.attr("placeholder", ac.settings.placeHolderText); // Set placeholder if any.
                ac.el.attr("autocomplete", "off");
                ac.initContainer();
                ac.initEvents();
            };

            ac.logError = function (message) {
                console.error(message);
            }

            // init wrapper container on the input element.
            ac.initContainer = function () {
                let el = ac.el, parentContainer = utils.helper.getParentContainer(el.width);
                el.wrap(parentContainer);
            };

            ac.initEvents = function () {
                let control = ac.el;

                control.on("focus.autocomplete", function (e) {
                    let text = this.value;
                    ac.handleInputChange(text);
                });

                control.on("input propertychange paste", function (e) {
                    let text = this.value;
                    ac.handleInputChange(text);
                });

                control.on("blur.autocomplete", function (e) {

                });

                control.on("keypress", ac.handleKeyPress);

                control.on("keydown.autocomplete", ac.handleKeyPress);
            };

            ac.handleKeyPress = function (e) {
                if (e) {
                    switch (e.which) {
                        case utils.keycodes.UP:
                            ac.handleKeyUp(e);
                            break;
                        case utils.keycodes.DOWN:
                            ac.handleKeyDown(e);
                            break;
                        case utils.keycodes.TAB:
                            break;
                        case utils.keycodes.ENTER:
                            break;
                        case utils.keycodes.ESC:
                            break;
                    }
                }
            };

            ac.handleKeyUp = function (e) {

            };

            ac.handleKeyDown = function (e) {
                let currentactive = $(ac.classes.selected_item);
                let suggestioncontainer = $(ac.classes.suggestioncontainer);
                if (currentactive.length > 0) {
                    $(currentactive).remove(ac.classes.selected_item);
                    ac.selectedIndex++;
                    let setActive = $(suggestioncontainer).find('div').eq(ac.selectedIndex);
                    $(setActive).addClass(ac.classes.selected_item);
                }
                else { // first item to be set - active 
                    ac.selected_item = 1;
                    $(suggestioncontainer).find('div').eq(ac.selectedIndex).addClass(ac.classes.selected_item);                    
                }
                // let __autocomplete_list, __active_element = $('.autocomplete-items div.autocomplete-active');
                // if (e.keyCode == utils.keycodes.DOWN) {
                //     __autocomplete_list = $('.autocomplete-items div')[0];
                // }
                // if (e.keyCode == utils.keycodes.UP) {
                //     __autocomplete_list = $('.autocomplete-items div')[$('.autocomplete-items div').length - 1];
                // }
                // if (__autocomplete_list != undefined) {
                //     __autocomplete_list.setAttribute('class', 'autocomplete-active');
                //     __autocomplete_list.focus();
                //     $(__active_element).removeClass('autocomplete-active');
                // }
            };

            ac.handleTabPress = function (e) {

            };

            ac.handleInputChange = function (text) {
                if (text.length >= ac.settings.minChars) {
                    let data = ac.getSuggestions();
                    if (data)
                        ac.buildsuggestionslist(data, text);
                    else
                        ac.showNoSuggestionsBox();
                }
            };

            ac.showNoSuggestionsBox = function () {
                let nosuggestionsdiv = utils.helper.getNoSuggestionsDiv(ac.el.width, ac.settings.nosuggestionsText);
                let that = ac.element;
                that.parentNode.appendChild(nosuggestionsdiv);
            };

            ac.closeSuggestionsBox = function (elmnt) {
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

            ac.getSuggestions = function () {
                let options = ac.settings;
                let element = options.element;
                let dataSource = options.data;
                if (dataSource == null || dataSource == undefined)
                    ac.logError("Source not defined");


                if (Array.isArray(dataSource)) {
                    return dataSource;
                }

                if (typeof dataSource == "function") {
                    dataSource(element.value, function (result) {
                        return result;
                    });
                }
            }

            ac.buildsuggestionslist = function (data, searchterm) {
                if (!data)
                    return;

                ac.closeSuggestionsBox();
                let that = ac.element, el = ac.el;
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
                            ac.settings.onSelected.call(e);
                        });
                        div.appendChild(s);
                    }
                }
                if (!isSuggestionFound) {
                    ac.showNoSuggestionsBox(el.width, ac.settings.nosuggestionsText);
                }
            }

            ac.handleItemKeyPress = function (e) {
                if (e) {

                }
            };

            ac.handleItemBlur = function (e) {
                if (e) { }
            };

            ac.handleItemCllick = function (e) {
                if (e) { }
            };

            ac.getDataFromObject = function (currentObject, searchterm) {
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
                            ac.logError("The display expression was not found. Make sure the displayExpr key is correct");

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
                            ac.logError("The display expression was not found. Make sure the displayExpr key is correct");

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

            ac.initialize();

        }

        return this.each(function () {
            var element = this;

            var instance = new Typeahead(element, options);
        })
    }
})(jQuery)
