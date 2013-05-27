Keynavigator
======

[![Build Status](https://travis-ci.org/nekman/keynavigator.png?branch=master)](https://travis-ci.org/nekman/keynavigator)

A keynavigator plugin for <a href="http://jquery.com">jQuery</a>/<a href="http://zeptojs.com">Zepto</a>.
<br/>
Make it possible to use arrow keys for navigation in eg. `ul` or `table` element.

###Usage
```javascript
$('selector').keynavigator({settings} /* optional */);
```

<strong>Settings</strong>

```
 cycle: {boolean} - if true, use cycle navigation
 	- default: false     
 
 useCache: {boolean} - if false, run the selector on each keydown. 
 					   Useful if elements are added/removed from the DOM.
 	- default: true  
 
 activeClass: {string} - The name of the class that should be used for the active element.
 	- default: 'active'
 
 tabindex: {number} - the tabindex that should be used on the parent element.
 	- default: -1   
 
 enter: {function}: 
 	arguments ($selectedElement, event) - callback function when user press enter
 	(The context 'this' is set to KeyNavigator instance).

 	- default: empty function

 click: {function}: 
 	arguments ($selectedElement, event) - callback function when user clicks on a element
 	(The context 'this' is set to the KeyNavigator instance).
 	
 	- default: calls KeyNavigator.prototype.setActiveElement.      
 
 keyMappings: {object}:        
 	Key mappings for enter/return, up/down arrows. Should not need to be changed.
 	
 	- default: { 13: 'enter',
 				 38: 'up',
 				 40: 'down' }
```

###Example:

```html
<ul>
  <li>
      <a href="#">Option 1</a>
  </li>
  <li>
      <a href="#">Option 2</a>
  </li>
  <li>
      <a href="#">Option 3</a>
  </li>
</ul>
```

```javascript
$('ul li').keynavigator();
```

###Example with settings:
```javascript
$('ul li').keynavigator({
	click: function($el) {
        console.log('clicked on', $el);
        this.setActiveElement($el);
    },
    
    enter: function($el) {
        //$el.find('a').trigger('click');
        console.log('pressed return on', $el.find('a').text());
    }
});
```
