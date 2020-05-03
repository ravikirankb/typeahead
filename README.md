# Simple Typeahead

Simple typeahead jQuery plugin built using jQuery version v3.4.1 is a simple yet powerful autocomplete typeahead control which can convert an input element into a type ahead control.

The control is capable of working with static array data source and also with remote data source through ajax call.
It provides auto hint, tab selection, item template and auto height align capability along with other useful features.
This is designed similar to twitter typeahead with limited and useful features.

## API
```
$(selector).simple_typeahead(options);
```

Find below the list of input settings available for the plugin.


| Setting | Default value | Description |
| ------------- | ------------- | ------------- |
| data  | null  |  This is the input data for the dropdown, this can be either an array of plain text or a json array, in case of a json array the displayExpr and keyExpr needs to be specified for the control to display the text in control and set the key of the selected item. In case of a remote data source the 'data' needs to be a function with a callback function which makes an ajax call as intended by the user and returns the resulting data from the callback function.
| showHint | false  | This property when set to true will show the immediate matching suggestion to the entered text as a hint in the control which can be auto selected by pressing the TAB key, if set to false TAB selectiong will not work  |
| tabselectionenabled | false | Enable this property to select item with TAB key press|
| onSelected | default function | This function is fired when a valid selection is made from the dropdown list, returns an event object along with the selected data object |
| displayExpr | '' | Property name of the object array to be displayed as a label in the control |
| keyExpr | '' | Property name of the object array to be set as a key in the control |
| minSuggestions | 10 | Minimum number of suggestions to be displayed in the dropdown overlay |
| placeHolderText | --Select-- | Placeholder text for the input control |
| nosuggestionsText | --No Suggestions-- | Text to be displayed when there are no matching suggestions found for the entered key |
| nosuggestionsTemplate | null | No suggestions template function can be defined when a custom template needs to be displayed for no suggestions found error |
| itemTemplate | null | Item template function when a custom template needs to be displayed for the suggestions list |
| minChars | 1 | Minimum number of characters to be entered for the search suggestions to display the matching suggestion. |
| orientation | 'bottom' | Orientation of the suggestions dropdown. Available options is top or bottom. It needs to be understood that alignment is auto adjusted based on the placement of the control, whether or not actual space is available to be aligned accordingly.|
| searchmode | 'contains' | Defines the mode of search, either contains or begins. If remote enabled then contains search has to be handled in the backend code, suggestions list will highlight the contained text |
| autoalignheight | true | If set to true then the height of the suggestions box is automatically aligned to fit the space available in the viewport |
| cacheEnabled | false | Enabled this property for the caching of the filtered result set |



## Basic Usage

```
<input type='text' id='mytextbox'></input>

var countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central Arfrican Republic", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauro", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

$("#mytextbox").simple_typeahead({
                data: countries, orientation: 'bottom', onSelected: function (e, data) {
                    var data = e.data;
                    // or
                    data = data; // the selected item object, either a plain object or a JSON object in case of a JSON array.
                });
```

Above example illustrates the bare minimum settings required to initialize the typeahead control. The countries array provides the data for the plugin which is an array of plain objects.


## Usage with JSON Array of data

```

 var covid_countries = [{ name: 'India', count: 122, id: 1 }, { name: 'Pakistan', count: 322, id: 2 },
            { name: 'Sri Lanka', count: 12, id: 3 },
            { name: 'Nepal', count: 2, id: 4 }, { name: 'Bangladesh', count: 1, id: 5 },
            { name: 'China', count: 1122, id: 6 }, { name: 'South Korea', count: 322, id: 7 },
            { name: 'North Korea', count: 8, id: 8 }, { name: 'Japan', count: 23, id: 9 },
            { name: 'Iran', count: 12, id: 10 }, { name: 'Iraq', count: 19, id: 11 },
            { name: 'Singapore', count: 442, id: 12 }, { name: 'Malaysia', count: 56, id: 13 },
            { name: 'Kuwait', count: 72, id: 13 }, { name: 'South Africa', count: 52, id: 14 },
            { name: 'England', count: 172, id: 15 }, { name: 'Australia', count: 512, id: 16 },
            { name: 'New Zealand', count: 62, id: 17 }, { name: 'Mexico', count: 2, id: 18 },
            { name: 'Germany', count: 72, id: 19 }, { name: 'Switzerland', count: 5, id: 20 }];
            
            
            $("#mytextbox").simple_typeahead({
                data: covid_countries, orientation: 'bottom', onSelected: function (e, data) {
                    var data = e.data;
                },
                keyExpr: 'id',
                displayExpr: 'name'
                });
               
 ```
               The above example demostrates the usage with JSON array, this requires the displayExpr and the keyExpr to be set, based on which the display text of the control will be set and the key will provided key object.
               
## Remote data source

The control gives the flexibility to create your own ajax  request without having to depend on the control to do it. It requires the data property to be set as a function which makes an ajax call and then use the callBack function to return the results of the ajax call to the control. The data function accepts two parameter, param1 is the entered text, param2 is the callback function.

Please check the demo below

```

$("input").simple_typeahead({
                data: function(value,callBack){
                                   $.ajax({
                  url: "http://localhost:1800/api/getdata/" + value  // add additional query params at your convinience.
                  context: document.body
                }).done(function(result) {
                  callBack(result); 
                });
                    
                }, orientation: 'bottom', onSelected: function (e, data) {
                    
                },
                keyExpr: 'id',
                displayExpr: 'name'
                });
                
```                


## Item template creation

The control displays the suggestions as plain text div element, but it is also possible to create custom display template for making a template of the display element.

Just use the itemTemplate property function to set the template for the suggestions item.

```
itemTemplate: function (obj) {
                    if (obj) { // obj is the selected item object, plain text in case of plain array or the JSON object
                        return '<div> <label>' + obj.name + '  --  ' + obj.count + '</label></div>';
                    }
                    return '';
                }

```

Similary if there is a no suggestions template to be displayed use the nosuggestionsTemplate property to set the same.

```

nosuggestionsTemplate: function (value) { // function accepts the value being typed in the control.
                    return "<div><label>Oops no suggestion found for the key " + "'" + value + "'" + "</label></div>";
                }
                
```               
