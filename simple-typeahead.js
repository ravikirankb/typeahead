
(function ($) {
    $.fn.simple_typeahead = function (options) {


        function Typeahead(el, args) {
            let plugin = this;
            let element = el;

            var settings = $.extend({
                data: null,
                onSelected: function () {

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
                highlightsearchkey: false
            }, args);

            plugin.element = el;
            plugin.settings = settings;
            

        }

        return this.each(function () {
            var element = $(this);

            var instance = this.Typeahead(element, options);
        })
    }
})(jQuery)
