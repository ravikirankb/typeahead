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
			    searchmode:'begins',
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
			
			autocomplete.buildsuggestionslist = function(data,searchterm){
				if(!data)
					return;
					
				var div,s;
				/*create a DIV element that will contain the items (values):*/
			    div = document.createElement("DIV");
			    div.setAttribute("id", this.id + "autocomplete-list");
	            div.setAttribute("class", "autocomplete-items");
   		       /*append the DIV element as a child of the autocomplete container:*/
			    this.parentNode.appendChild(a);
				
				for(var i=0;i<data.length;i++){					
					let currentObj = this.getDataFromObject(data[i],searchterm);
					if(currentObj != undefined){
						s = document.createElement("DIV");
						let innerHtml = "<strong "+ this.settings.highlightsearchkey? "class='hightlight-search-key'" :""+">" + currentObj.displayObject.substr(0,searchterm.length) + "</strong>";
						innerHtml += currentObj.displayObject.substr(searchterm.length);	
						innerHtml += "<input type='hidden' value='"+currentObj.displayObject+"'>";
						s.innerHTML = innerHtml;
						s.addEventListener("click",function(e){
							
						});
						div.appendChild(s);
					}						
				}
			}
			
			autocomplete.getDataFromObject = function(currentObject,searchterm){
				const searchmode = this.settings.searchmode;
				const isplainobject = currentObject.constructor == 'String';
				let objecttoreturn = undefined;
				if(searchmode == 'begins'){
					if(isplainobject){
						if(currentObject.substr(0, searchterm.length).toUpperCase() == searchterm.toUpperCase()){
							objecttoreturn ={
								displayObject: currentObject,
								keyObject:currentObject
							}
						}
					}
					else{
						let dataValue = currentObject[this.settings.displayExpr];
						let keyValue = currentObject[this.settings.keyExpr];
						if(dataValue == undefined)
							throw "The display expression was not found. Make sure the displayExpr key is correct";
						
						if(dataValue.substr(0, searchterm.length).toUpperCase() == searchterm.toUpperCase()){
							objecttoreturn ={
								displayObject: dataValue,
								keyObject:keyValue
							}
						}
					}
				}
				else{
					if(isplainobject){
						if(currentObject.toUpperCase().indexOf(searchterm.toUpperCase()) > -1){
							objecttoreturn ={
								displayObject: currentObject,
								keyObject:currentObject
							}
						}
					}
					else{
						let dataValue = currentObject[this.settings.displayExpr];
						let keyValue = currentObject[this.settings.keyExpr];
						if(dataValue == undefined)
							throw "The display expression was not found. Make sure the displayExpr key is correct";
						
						if(dataValue.toUpperCase().indexOf(searchterm.toUpperCase()) > -1){
							objecttoreturn ={
								displayObject: dataValue,
								keyObject:keyValue
							}
						}
					}
				}
				
				return objecttoreturn;
			}
			
			
			
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
