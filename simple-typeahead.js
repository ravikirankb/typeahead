(function ($) {
    $.fn.simple_typeahead = function (options) {


        function Typeahead(el, args) {
            let autocomplete = this;
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

            autocomplete.element = el;
            autocomplete.settings = settings;
			
			let control = autocomplete.el;
			
			let keycodes ={
				DOWN:37,
				UP:38,
				ESC:27,
				ENTER:13,
				SPACE:32,
				RIGHT:39,
				LEFT:40
			}
			
				
            autocomplete.initialize = function(){
				
				
			};
			
			autocomplete.filter = function(searchterm){
				
				
			};
			
			control.addEventListener("keydown",function(){
				
				
			});
			
		    control.addEventListener("keyup",function(){
				
				
			});
			
			control.addEventListener("escape",function(){
				
				
			});
			
			
			
			
			autocomplete.initialize();

        }

        return this.each(function () {
            var element = $(this);

            var instance = this.Typeahead(element, options);
        })
    }
})(jQuery)
