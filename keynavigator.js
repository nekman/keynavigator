/*
 * Arrow key navigator for jQuery / Zepto.
 *
 * Usage: $('selector').keynavigator(settings);
 *        
 * @param settings - {object}
 *    {
 *      cycle: {boolean} - if true, use cycle navigation
 *          - default: false     
 *
 *      useCache: {boolean} - if false, run the selector on each keydown. Useful if elements are added/removed from the DOM.
 *          - default: true  
 *
 *      activeClass: {string} - The name of the class that should be used for the active element.
 *          - default: 'active'
 *
 *      tabindex: {number} - the tabindex that should be used on the parent element.
 *          - default: -1   
 *
 *      enter: {function}: 
 *          arguments ($selectedElement, event) - callback function when user press enter
 *          (The context 'this' is set to KeyNavigator instance).
 *          - default: empty function
 *
 *      click: {function}: 
 *          arguments ($selectedElement, event) - callback function when user clicks on a element
 *          (The context 'this' is set to KeyNavigator instance).
 *          - default: calls KeyNavigator.prototype.setActiveElement.      
 *
 *      keyMappings: {object}:        
 *         Key mappings for enter/return, up/down arrows. Should not need to be changed.
 *          - default: 13: 'enter',
 *                     38: 'up',
 *                     40: 'down'
 *
 *    }
 *
 */
(function(root, factory) {
  'use strict';
  // CommonJS - NOTE: Only jQuery.
  if (typeof exports === 'object') {
     module.exports = factory(require('jquery'));
  }
  // Register as a AMD module if using require.js.
  else if (typeof root.define === 'function' && root.define.amd) {
    // jQuery 1.7+ registers it self as a AMD module. 
    // If Zepto is used, define jquery and return Zepto eg:
    // 
    //    define('jquery', window.Zepto);
    //
    define('keynavigator', ['jquery'], factory);
  } else {
    // Not using require.js.
    factory(root.jQuery || root.Zepto);
  }
}(this, function($) {
  // Constructor
  var KeyNavigator = function($nodes, $parent, options)  {
    // Not a very safe constructor, but it have to do
    this.options = $.extend({}, this.defaults, options || {});
    this.options.activeClassName = '.' + this.options.activeClass;
    this.index = -1;
    this.selector = $nodes.selector;
    this.$nodes = $nodes;

    // If the parent node doesn't have a tabindex attribute, then add one.
    // This is needed to be able to set focus on the node.
    if (!$parent.attr('tabindex')) {
      $parent.attr({ tabindex: this.options.tabindex || -1 });
    }

    this.$parent = $parent;
  };

  KeyNavigator.prototype = {
    // Default settings
    defaults: {
      useCache: true,
      cycle: false,
      activeClass: 'active',
      // 38-up, 40-down, 13-return
      keyMappings: {
        13: 'enter',
        38: 'up',
        40: 'down'
      },

      click: function($el) {
        this.setActiveElement($el);
      }
    },

    handleKeyDown: function(e) {
      var fn = this.events[this.options.keyMappings[e.keyCode]];
      if (!fn) {
        return;
      }

      e.preventDefault && e.preventDefault();

      // If "useCache" isn't enabled, 
      // then query for DOM-nodes with the same selector.
      if (!this.options.useCache) {
        this.$nodes = $(this.selector);
      }

      var $selected = this.$parent.find(this.options.activeClassName);
      if (this.index < 0) {
          this.index = $selected.index();
      }

      fn.apply(this, [$selected, e]);
    },

    setActive: function() {
      // Find the selected node by current index.
      var $selectedNode = this.$nodes.eq(this.index);

      // Remove the active class (from all nodes), 
      // add the active class to the selected node.
      this.$nodes.removeClass(this.options.activeClass);
      $selectedNode.addClass(this.options.activeClass);
    },

    setActiveElement: function($el) {
      var index = $el.index();
      if (index === this.index) {
        this.$nodes.removeClass(this.options.activeClass);
        this.index = -1;

        return;
      }

      this.index = index;
      this.setActive();
    },

    events: {
      click: function() {
        return (this.options.click || $.noop).apply(this, arguments);
      },

      enter: function() {
        return (this.options.enter || $.noop).apply(this, arguments);
      },

      down: function() {
        var len = this.$nodes.length - 1;

        if (this.options.cycle) {
          if (this.index >= len) {
            this.index = -1;
          }
        }

        if (this.index < len) {
          this.index++;
        }

        this.setActive();
      },

      up: function() {
        if (this.options.cycle) {
          if (this.index <= 0) {
            this.index = this.$nodes.length;
          }
        }

        if (this.index > 0) {
          this.index--;
        }

        this.setActive();
      }
    }
  };

  $.fn.keynavigator = function(options) {
    var $parent = this.parent(),
        navigator = new KeyNavigator(this, $parent, options);

    // Use bind due to backwards compatibility. 
    // jQuery 1.7+ bind() calls on().
    // See line ~3360 in http://code.jquery.com/jquery-latest.js.         
    this.bind('click', function(e) {
        navigator.events.click.apply(navigator, [$(this), e]);
    });

    $parent
      .bind('keydown', $.proxy(navigator.handleKeyDown, navigator))
      .bind('click', function() {
          $parent.focus();
      });

    return this;
  };

  // Just return the $-function. 
  // Needed (good practice) for AMD modules.
  return $;

}));