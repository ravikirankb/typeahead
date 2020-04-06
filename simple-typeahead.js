(function ($) {
    'use strict';

    $.fn.simple_typeahead = function (options) {


        function Typeahead(el, args) {
            let ac = this;

            ac.selectors = {
                selected_item: "autocomplete-active",
                suggestionsbox: "autocomplete-items"
            };

            ac.orientation = {
                TOP: 'top',
                BOTTOM: 'bottom'
            };

            ac.searchMode = {
                BEGINS: 'begins',
                CONTAINS: 'contains'
            };

            ac.topsuggestion = null;
            ac.filteredSuggestions = [];
            ac.selectedIndex = 0;

            var settings = $.extend({
                data: null,
                showhint: false,
                tabselectionenabled: false,
                onSelected: function (e) {

                },
                displayExpr: 'Name',
                keyExpr: 'Id',
                minSuggestions: 1000,
                autoCompleteEnabled: false,
                placeHolderText: '--Select--',
                nosuggestionsText: '--No Suggestions--',
                nosuggestionsTemplate: function (obj) {
                    return '<div></div>';
                },
                minChars: 1,
                isremoteoptionenabled: false,
                orientation: 'top',
                searchmode: 'contains',
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
                        },
                        getHintInput: function (width) {
                            let __hintinput = document.createElement("input");
                            __hintinput.setAttribute("class", "autocomplete-hint");
                            __hintinput.setAttribute("readonly", "readonly");
                            __hintinput.style.width = width + 'px';
                            return __hintinput;
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
                $(parentContainer).prepend(utils.helper.getHintInput(el.width));
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
                            ac.handleArrowUp(e);
                            break;
                        case utils.keycodes.DOWN:
                            ac.handleArrowDown(e);
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

            ac.handleArrowUp = function (e) {
                let currentactive = $('.' + ac.selectors.selected_item);
                let length = $('.' + ac.selectors.suggestionsbox).find('div').length;
                if ($(currentactive).length > 0) {
                    if (ac.selectedIndex == 0) {
                        ac.selectedIndex = length - 1;
                    }
                    else {
                        ac.selectedIndex--;
                    }
                    ac.setActiveElement(ac.selectedIndex, currentactive);
                }
                else {
                    ac.selectedIndex = length - 1;
                    ac.setActiveElement(ac.selectedIndex, currentactive);
                }
                ac.scrollToCurrent(ac.selectedIndex);
            };

            ac.handleArrowDown = function (e) {
                let currentactive = $('.' + ac.selectors.selected_item);
                let length = $('.' + ac.selectors.suggestionsbox).find('div').length;
                if ($(currentactive).length > 0) {
                    if (ac.selectedIndex == length - 1) {
                        ac.selectedIndex = 0;
                    }
                    else {
                        ac.selectedIndex++;
                    }
                    ac.setActiveElement(ac.selectedIndex, currentactive);
                }
                else {
                    ac.selectedIndex = 0;
                    ac.setActiveElement(ac.selectedIndex, currentactive);
                }
                ac.scrollToCurrent(ac.selectedIndex);
            };

            ac.setActiveElement = function (index, currentActiveEle) {
                if (currentActiveEle && currentActiveEle.length > 0) {
                    $(currentActiveEle).removeClass(ac.selectors.selected_item);
                }

                let suggestioncontainer = $('.' + ac.selectors.suggestionsbox);
                let activeToSet = $(suggestioncontainer).find('div').eq(index);
                $(activeToSet).addClass(ac.selectors.selected_item);
                $(activeToSet).focus();
            };

            ac.scrollToCurrent = function (index) {
                let suggestioncontainer = $('.' + ac.selectors.suggestionsbox).get(0);
                let element = $(suggestioncontainer).find('div').eq(index).get(0);

                if (!element) {
                    return;
                }

                // const elementRect = element.getBoundingClientRect();
                // const absoluteElementTop = elementRect.top + window.pageYOffset;
                // console.log(window.pageYOffset);
                // const middle = absoluteElementTop - (window.innerHeight / 2);
                // $(suggestioncontainer).scrollTop(middle);

                // let currentElement = $(element).get(0);
                element.scrollIntoView(false);
            };

            ac.handleTabPress = function (e) {

            };

            ac.handleInputChange = function (text) {
                if (text.length >= ac.settings.minChars) {
                    // we make use of the call back function so that the ajax response callback is received
                    // from the callback function.
                    ac.getSuggestions(function (result) {
                        if (result) {
                            ac.filterSuggestions(result, text);
                            ac.buildsuggestionslist(text);
                            ac.showSuggestionsBox();
                        }
                        else {
                            ac.showNoSuggestionsBox();
                        }
                    });
                }
            };

            ac.showSuggestionsBox = function () {
                let suggestionsDiv = '.' + ac.selectors.suggestionsbox, control = ac.element, orientation = ac.settings.orientation;
                let left_right_margin = { // add same left, right margin as the input element.
                    right: control.style.marginRight,
                    left: control.style.marginLeft
                };
                $(suggestionsDiv).css(left_right_margin);
                // calculate the top and/or bottom margin.
                let window_height = window.outerHeight;
                let off_set = ac.el.offset();
                let a_height = window_height - off_set.top;
                let css = {};
                // if (ac.orientation.TOP == orientation) {
                //     css.marginBottom = '-' + (off_set.top - 60) + 'px';
                //     css.bottom = '100%'
                //     css.borderTop = '1px solid #d4d4d4';
                //     css.top = 'auto';
                // }

                // $(suggestionsDiv).css(css);
                $(suggestionsDiv).show();
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

            ac.getSuggestions = function (callBack) {
                let that = ac;
                let options = ac.settings;
                let element = ac.element;
                let dataSource = options.data;
                if (dataSource == null || dataSource == undefined)
                    ac.logError("Source not defined");


                if (Array.isArray(dataSource)) {
                    callBack(dataSource);
                }

                if (typeof dataSource == "function") {
                    debugger;
                    // use the ajax done function to set the result callback.
                    let ajax = dataSource.call(element.value,function(result){
                        callBack(result);
                    });                   
                }
            }

            ac.filterSuggestions = function (data, searchterm) {
                ac.filteredSuggestions = [];
                for (var i = 0; i < data.length; i++) {
                    let currentObj = this.getDataFromObject(data[i], searchterm);
                    if (currentObj != undefined) {
                        ac.filteredSuggestions.push(currentObj);
                    }
                }
            };

            ac.buildsuggestionslist = function (searchterm) {
                let settings = ac.settings, suggestions = ac.filteredSuggestions;
                if (!suggestions && suggestions.length <= 0) {
                    ac.showNoSuggestionsBox(el.width, settings.nosuggestionsText);
                    return;
                }
                ac.closeSuggestionsBox();
                let that = ac.element, el = ac.el;
                var div, s;
                /*create a DIV element that will contain the items (values):*/
                div = document.createElement("DIV");
                div.setAttribute("id", that.id + "autocomplete-list");
                div.style.display = "none"; // set initial display-none and set visible based on top/bottom orientation.
                div.setAttribute("class", "autocomplete-items");
                /*append the DIV element as a child of the autocomplete container:*/
                that.parentNode.appendChild(div);

                for (var i = 0; i < settings.minSuggestions; i++) {
                    let currentObj = suggestions[i];
                    if (currentObj != undefined) {
                        if (ac.topsuggestion == null) {
                            ac.topsuggestion = currentObj;
                        }
                        s = document.createElement("DIV");
                        if (settings.searchmode == ac.searchMode.CONTAINS) {
                            let innerHTML = ac.getContainsSuggestion(currentObj.displayObject, searchterm);
                            s.innerHTML = innerHTML;
                        }
                        else {
                            let innerHtml = "<strong " + (settings.highlightsearchkey ? " class='hightlight-search-key' " : "") + ">" + currentObj.displayObject.substr(0, searchterm.length) + "</strong>";
                            innerHtml += currentObj.displayObject.substr(searchterm.length);
                            innerHtml += "<input type='hidden' value='" + currentObj.displayObject + "'>";
                            s.innerHTML = innerHtml;
                        }
                        s.addEventListener("click", function (e) {
                            alert('click');
                            settings.onSelected.call(e);
                        });
                        s.addEventListener("keypress", function (e) {
                            if (e.which == utils.keycodes.ENTER) {
                                alert('enter');
                                settings.onSelected.call(e);
                            }
                            else {
                                e.stopPropagation();
                            }
                        });
                        div.appendChild(s);
                    }
                }
            }

            ac.getContainsSuggestion = function (term, searchkey) {
                term = term
                    .replace('&amp;', '&')
                    .replace('&quot;', '"');
                let innerHtml = term.replace(new RegExp(searchkey, 'gi'), function (match) {
                    return '<strong>' + match + '</strong>';
                });
                innerHtml += "<input type='hidden' value='" + term + "'>";
                return innerHtml;
            };

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
                if (searchmode == ac.searchMode.BEGINS) {
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
