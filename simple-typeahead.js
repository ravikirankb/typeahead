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
                        getParentContainer: function () {
                            let div = document.createElement('div');
                            div.setAttribute('class', 'autocomplete');
                            div.style.width = '300px';
                            return div;
                        }
                    }
                })(),
                keycodes: {
                    DOWN: 37,
                    UP: 38,
                    ESC: 27,
                    ENTER: 13,
                    SPACE: 32,
                    RIGHT: 39,
                    LEFT: 40
                }
            };

            autocomplete.initialize = function () {
                autocomplete.element = el;
                autocomplete.el = $(el);
                autocomplete.settings = settings;

                autocomplete.el.val('');
                autocomplete.el.attr("placeholder", autocomplete.settings.placeHolderText); // Set placeholder if any.
                autocomplete.initContainer();
                autocomplete.initEvents();
            };

            autocomplete.logError = function (message) {
                console.error(message);
            }

            autocomplete.initContainer = function(){
               let parentContainer = utils.helper.getParentContainer(),el = autocomplete.el;
               el.wrap(parentContainer);
            };

            autocomplete.initEvents = function () {
                let control = autocomplete.el;

                control.on("focus.autocomplete", function (e) {
                    let text = this.value;
                    if (text.length >= autocomplete.settings.minChars) {
                        let data = autocomplete.getSuggestions();
                        if (data)
                            autocomplete.buildsuggestionslist(data, text);
                        else
                            autocomplete.showNoSuggestionsBox();
                    }
                });

                control.on("blur.autocomplete", function (e) {

                });

                control.on("keypress", function (e) {

                });
            };

            autocomplete.showNoSuggestionsBox = function () {

            };

            autocomplete.closeSuggestionsBox = function (elmnt) {
                var x = document.getElementsByClassName("autocomplete-items");
                for (var i = 0; i < x.length; i++) {
                    if (elmnt != x[i]) {
                        x[i].parentNode.removeChild(x[i]);
                    }
                }
                // $('.autocomplete').remove();
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

                for (var i = 0; i < data.length; i++) {
                    let currentObj = this.getDataFromObject(data[i], searchterm);
                    if (currentObj != undefined) {
                        s = document.createElement("DIV");
                        let innerHtml = "<strong " + (this.settings.highlightsearchkey ? " class='hightlight-search-key' " : "") + ">" + currentObj.displayObject.substr(0, searchterm.length) + "</strong>";
                        innerHtml += currentObj.displayObject.substr(searchterm.length);
                        innerHtml += "<input type='hidden' value='" + currentObj.displayObject + "'>";
                        s.innerHTML = innerHtml;
                        s.addEventListener("click", function (e) {
                            autocomplete.settings.onSelected.call(e);
                        });
                        div.appendChild(s);
                    }
                }
            }

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
