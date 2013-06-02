/*!
 * Key navigator plugin for jQuery / Zepto.
 *
 * https://github.com/nekman/keynavigator
 */
(function(root, factory) {
  'use strict';
  // CommonJS
  if (typeof exports === 'object') {
     module.exports = factory(require('jquery'));
  } else if (typeof root.define === 'function' && root.define.amd) {
    // AMD. Register as an anonymous module.
    // jQuery 1.7+ registers it self as a AMD module. 
    // If Zepto is used, define jquery and return Zepto eg:
    // 
    //    define('jquery', window.Zepto);
    //
    define('keynavigator', ['jquery'], factory);
  } else {
    // AMD isn't being used. Assume jQuery or Zepto are loaded from <script> tags.
    factory(root.jQuery || root.Zepto);
  }
}(this, function($) {

  var defaultEventHandlers = {
    down: function($el) {
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
      $el.trigger('down');

    },

    up: function($el) {
      if (this.options.cycle) {
        if (this.index <= 0) {
          this.index = this.$nodes.length;
        }
      }

      if (this.index > 0) {
        this.index--;
      }

      this.setActive();
      $el.trigger('up');
    }
  };

  // Constructor  
  var KeyNavigator = function($nodes, $parent, settings)  {
    // Extend custom settings with default settings.
    // Could "deep copy" ($.extend(true, ...)) the entire settings, but this could result
    // in conflicts betweeen methods provided by KeyNavigator and methods provided
    // by the user.
    var options = settings || {};
    this.options = $.extend({}, this.defaults, options);
    this.options.keys = $.extend({}, this.defaults.keys, options.keys);
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
      // 38: arrow up, 40: arrow down
      keys: {
        38: defaultEventHandlers.up,
        40: defaultEventHandlers.down
      }
    },

    handleKeyDown: function(e) {
      // Use event.which property to normalizes event.keyCode and event.charCode
      var fn = this.options.keys[e.which];
      if (!fn) {
        // No handler found for current keyCode.
        return;
      }

      e.preventDefault ? e.preventDefault() : e.returnValue = false;

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
    }

  };

  $.fn.keynavigator = function(options) {
    var $parent = this.parent(),
        navigator = new KeyNavigator(this, $parent, options);

    // Use bind due to backwards compatibility. 
    // jQuery 1.7+ bind() calls on().
    // See line ~3360 in http://code.jquery.com/jquery-latest.js.         
    this.bind('click', function(e) {
        navigator.setActiveElement($(this));
    });

    $parent
      .bind('keydown', $.proxy(navigator.handleKeyDown, navigator))
      .bind('click', function() {
          $parent.focus();
      });

    return this;
  };

  // Just return the $-function. 
  // Needed (good practice) for AMD / UMD modules.
  return $;

}));