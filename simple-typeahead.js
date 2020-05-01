(function ($) {
    'use strict';

    $.fn.simple_typeahead = function (options) {


        function Typeahead(el, args) {
            let ac = this;

            ac.selectors = {
                selected_item: "autocomplete-active",
                suggestionsbox: "autocomplete-items",
                autcomplete_container: "autocomplete",
                autocomplete_hint: "autocomplete-hint"
            };

            ac.orientation = {
                TOP: 'top',
                BOTTOM: 'bottom'
            };

            ac.searchMode = {
                BEGINS: 'begins',
                CONTAINS: 'contains'
            };

            ac.minspacecriteria = 125;

            ac.topsuggestion = null;
            ac.filteredSuggestions = [];
            ac.selectedIndex = 0;

            var settings = $.extend({
                data: null,
                showHint: true,
                tabselectionenabled: true,
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
                highlightsearchkey: true,
                autoalignheight: true
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
                ac.handleHintBox();
            };

            ac.handleHintBox = function () {
                let settings = ac.settings, el = ac.el, parentContainer = "." + ac.selectors.autcomplete_container;
                if (settings.showHint) {
                    let hint = utils.helper.getHintInput(parseInt(el.css('width')));
                    hint.style.marginTop = el.css('margin-top');
                    $(parentContainer).prepend(hint);
                }
            };

            ac.initEvents = function () {
                let control = ac.el;

                control.on("focus.autocomplete", function (e) {
                    let text = this.value;
                    ac.handleInputChange(text);
                });

                control.on("input propertychange paste", function (e) {
                    let text = this.value;
                    if (text.length == 0) {
                        ac.clearHint();
                    }
                    ac.handleInputChange(text);
                });

                control.on("blur.autocomplete", function (e) {

                });

                control.on("keypress.autocomplete", ac.handleKeyPress);

                control.on("keyup.autocomplete", ac.handleKeyPress);

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
                            ac.handleTabPress(e);
                            break;
                        case utils.keycodes.ENTER:
                            ac.handleEnterKeyPress(e);
                            break;
                        case utils.keycodes.ESC:
                            break;
                    }
                }
            };

            ac.handleEnterKeyPress = function (e) {
                if (e) {
                    let activeElement = $("." + ac.selectors.selected_item), settings = ac.settings;
                    if (activeElement.length > 0) {
                        let data = JSON.parse(activeElement.attr("data-obj"));
                        e.data = data;
                        settings.onSelected.call(this, e, data.obj);
                    }
                    ac.closeSuggestionsBox();
                }
            };

            ac.handleArrowUp = function (e) {
                e.target.selectionEnd = ac.el.val().length;
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
                // set value of the input box to the current active element text
                currentactive = $('.' + ac.selectors.selected_item);
                ac.el.val($(currentactive).find("input:hidden").val());
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
                // set value of the input box to the current active element text
                currentactive = $('.' + ac.selectors.selected_item);
                ac.el.val($(currentactive).find("input:hidden").val());
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

                const absoluteElementTop = element.offsetTop + (element.clientHeight / 2);
                const middle = absoluteElementTop - (suggestioncontainer.clientHeight / 2);
                suggestioncontainer.scrollTo(0, middle);

                // // let currentElement = $(element).get(0);
                // element.scrollIntoView({ block: "center" });
            };

            ac.handleTabPress = function (e) {
                let settings = ac.settings, topsuggestion = ac.filteredSuggestions[0], el = ac.el;
                ac.clearHint();
                if (settings.tabselectionenabled === true) {
                    if (topsuggestion) {
                        el.val(topsuggestion.key.displayObject);
                        e.data = topsuggestion.obj;
                        settings.onSelected.call(this, e, topsuggestion.obj);
                    }
                    ac.closeSuggestionsBox();
                }
            };

            ac.handleInputChange = function (text) {
                if (text.length >= ac.settings.minChars) {
                    // we make use of the call back function so that the ajax response callback is received
                    // from the callback function.
                    ac.getSuggestions(function (result) {
                        if (result && result.length > 0) {
                            ac.filterSuggestions(result, text);

                            if (ac.filteredSuggestions.length <= 0) {
                                ac.closeSuggestionsBox();
                                ac.showNoSuggestionsBox();
                                return;
                            }

                            ac.buildsuggestionslist(text);
                            ac.showSuggestionsBox();
                            ac.showHint();
                        }
                        else {
                            ac.showNoSuggestionsBox();
                        }
                    });
                }
            };

            ac.showHint = function () {
                let settings = ac.settings, el = ac.el;
                if (settings.showHint) {
                    ac.setTopSuggestion();

                    if (ac.topsuggestion) {
                        let value = ac.topsuggestion.key.displayObject;
                        let hint = value.replace(new RegExp(el.val(), 'gi'), el.val());
                        ac.setHint(hint);
                    }
                    else {
                        ac.clearHint();
                    }
                }
            }

            ac.setHint = function (value) {
                $("." + ac.selectors.autocomplete_hint).val(value);
            }

            ac.clearHint = function () {
                $("." + ac.selectors.autocomplete_hint).val("");
            }

            ac.setTopSuggestion = function () {
                let filteredSuggestions = ac.filteredSuggestions;
                if (filteredSuggestions && filteredSuggestions.length > 0) {
                    let topsuggestion = filteredSuggestions[0], val = ac.el.val(), currentVal = topsuggestion.key.displayObject;

                    if (currentVal.toLowerCase().indexOf(val.toLowerCase()) == 0) {
                        ac.topsuggestion = topsuggestion;
                        return;
                    }
                }
                ac.topsuggestion = null;
            }

            ac.showSuggestionsBox = function () {
                let suggestionsDiv = '.' + ac.selectors.suggestionsbox, control = ac.element, orientation = ac.settings.orientation;
                let autoalignheight = ac.settings.autoalignheight;
                let left_right_margin = { // add same left, right margin as the input element.
                    right: control.style.marginRight,
                    left: control.style.marginLeft
                };
                $(suggestionsDiv).css(left_right_margin);

                // calculate the top and/or bottom margin.                
                let off_set = ac.el.offset();
                var bottom = off_set.top;//+ (ac.el.height() * 2);
                var bottomDistance = $(document).height() - bottom;
                let el_dim = {
                    topDistance: off_set.top,
                    bottomDistance: bottomDistance
                };

                let css = {};

                let containerHeight = $(suggestionsDiv).outerHeight();
                const control_margin = parseInt(ac.el.css('margin-top'));

                let isBottomDistanceAvailable = Math.max(el_dim.bottomDistance, ac.minspacecriteria) == el_dim.bottomDistance ? true : false;
                let isTopDistanceAvailable = Math.max(el_dim.topDistance, ac.minspacecriteria) == el_dim.topDistance ? true : false;

                if (autoalignheight) {
                    if ((ac.orientation.TOP == orientation && isTopDistanceAvailable) || !isBottomDistanceAvailable) {
                        css.borderTop = '1px solid #d4d4d4';
                        const containerOverflow = containerHeight > el_dim.topDistance;
                        if (containerOverflow) {
                            css.maxHeight = Math.ceil(el_dim.topDistance - 10) + "px";
                            $(suggestionsDiv).css(css);
                            $(suggestionsDiv).show();
                            containerHeight = $(suggestionsDiv).outerHeight();
                            $(suggestionsDiv).hide();
                            css.top = control_margin - containerHeight + "px";
                        }
                        else {
                            css.top = control_margin - containerHeight + "px";
                        }
                    }                    
                }
                else {
                    if ((ac.orientation.TOP == orientation && isTopDistanceAvailable) || !isBottomDistanceAvailable) {
                        css.borderTop = "1px solid #d4d4d4";
                        css.top = control_margin - containerHeight + "px";
                    }
                }

                $(suggestionsDiv).css(css);
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
                    let ajax = dataSource.call(element.value, function (result) {
                        callBack(result);
                    });
                }
            }

            ac.filterSuggestions = function (data, searchterm) {
                ac.filteredSuggestions = [];
                for (var i = 0; i < data.length; i++) {
                    let currentObj = this.getDataFromObject(data[i], searchterm);
                    if (currentObj != undefined && !jQuery.isEmptyObject(currentObj)) {
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
                        s = document.createElement("DIV");
                        s.setAttribute("data-obj", JSON.stringify(currentObj));
                        if (settings.searchmode == ac.searchMode.CONTAINS) {
                            let innerHTML = ac.getContainsSuggestion(currentObj.key.displayObject, searchterm);
                            s.innerHTML = innerHTML;
                        }
                        else {
                            let innerHtml = "<strong " + (settings.highlightsearchkey ? " class='hightlight-search-key' " : "") + ">" + currentObj.handleEnterKeyPress.displayObject.substr(0, searchterm.length) + "</strong>";
                            innerHtml += currentObj.key.displayObject.substr(searchterm.length);
                            innerHtml += "<input type='hidden' value='" + currentObj.key.displayObject + "'>";
                            s.innerHTML = innerHtml;
                        }
                        s.addEventListener("click", function (e) {
                            const data = JSON.parse(this.getAttribute("data-obj"));
                            e.data = data.obj;
                            ac.el.val(data.key.displayObject);
                            settings.onSelected.call(this, e);
                            ac.closeSuggestionsBox();
                        });
                        s.addEventListener("keypress", function (e) {
                            if (e.which == utils.keycodes.ENTER) {
                                const data = JSON.parse(this.getAttribute("data-obj"));
                                e.data = data.obj;
                                ac.el.val(data.key.displayObject);
                                settings.onSelected.call(this, e);
                                ac.closeSuggestionsBox();
                            }
                            else {
                                e.stopPropagation();
                            }
                        });
                        s.addEventListener("mouseover", function (e) {
                            $(this).addClass(ac.selectors.selected_item);
                        });
                        s.addEventListener("mouseout", function (e) {
                            $(this).removeClass(ac.selectors.selected_item);
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
                let objecttoreturn = {};
                if (searchmode == ac.searchMode.BEGINS) {
                    if (isplainobject) {
                        if (currentObject.substr(0, searchterm.length).toUpperCase() == searchterm.toUpperCase()) {
                            objecttoreturn.obj = currentObject;
                            objecttoreturn.key = {
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
                            objecttoreturn.data = currentObject;
                            objecttoreturn.key = {
                                displayObject: dataValue,
                                keyObject: keyValue
                            }
                        }
                    }
                }
                else {
                    if (isplainobject) {
                        if (currentObject.toUpperCase().indexOf(searchterm.toUpperCase()) > -1) {
                            objecttoreturn.obj = currentObject;
                            objecttoreturn.key = {
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
                            objecttoreturn.data = currentObject;
                            objecttoreturn.key = {
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
