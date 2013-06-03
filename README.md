Keynavigator
======

[![Build Status](https://travis-ci.org/nekman/keynavigator.png?branch=master)](https://travis-ci.org/nekman/keynavigator)

Key navigaton plugin for <a href="http://jquery.com">jQuery</a>/<a href="http://zeptojs.com">Zepto</a>.
<br/>
Makes it possible to use arrow keys (or any key) for navigation in eg. `ul` or `table` elements.

###Usage
Include keynavigator.js after having included jQuery or Zepto:
```html
<script src="jquery.js"></script>
<script src="keynavigator.js"></script>
```
Start the keynavigator plugin.
```javascript
$(document).ready(function() {
  $('ul#example li').keynavigator(/* optional settings */);
});  
```

####RequireJS
Include <a href="http://requirejs.org">RequireJS</a>.
```html
<script src="require.js"></script>
```
Start the keynavigator plugin.
```javascript
require(['keynavigator'], function($) {
  $('ul#example li').keynavigator(/* optional settings */);
});  

```
####Settings
```
 cycle: {boolean} - If true, use cycle navigation
  - default: false     

 activeClass: {string} - The name of the class that should be used for the active element.
  - default: 'active'
 
 keys: {object} (keyCode: callback): Callback functions that executes when a key is pressed.

 tabindex: {number} - The tabindex that should be used on the parent element.
  - default: -1

 useCache: {boolean} - If false, run the selector on each keydown. 
                       Useful if elements are added/removed from the DOM.
  - default: true
```
<strong>Custom events</strong><br/>
Subscribe to ```up``` and ```down``` events using:
```javascript
$('ul#example li').keynavigator()
                  .on('up', function(e, $el) {
                    console.log('Pressed up on', $el);
                  })
                  .on('down', function(e, $el) {
                    console.log('Pressed down on', $el);
                  });
```
#### Demos and examples
Is available on the project web page - http://nekman.github.io/keynavigator


