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

