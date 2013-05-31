Keynavigator
======

[![Build Status](https://travis-ci.org/nekman/keynavigator.png?branch=master)](https://travis-ci.org/nekman/keynavigator)

Key navigator plugin for <a href="http://jquery.com">jQuery</a>/<a href="http://zeptojs.com">Zepto</a>.
<br/>
Makes it possible to use arrow keys (or any key) for navigation in eg. `ul` or `table` elements.

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
 
 keyMappings: {object}: Callback functions when a certain key is pressed. See example below.
 	- example: { 
      65: function($el) { console.log('pressed', $el); }
    }
```

<strong>Example</strong>

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

<strong>Example with settings</strong>
```javascript
$('ul li').keynavigator({
  keyMappings: {
    '65': function($el) {
      console.log('character "a" was pressed return on', $el.find('a').text());
    }
  }
});
```

<a href="http://requirejs.org">RequireJS</a> usage:<br/>

```javascript
require(['keynavigator'], function($) {
  $('table > tbody tr').keynavigator({
    cycle: true
  });
});
```

