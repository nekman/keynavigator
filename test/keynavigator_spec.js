/*
 * Testcase for the Keynavigator plugin.
 * Needs refactoring.
 */
describe('Keynavigator', function() {

  var domino = require('domino'),
      $ = require('jquery'),
      html = '<ul>' +
                '<li><a href="#">Option 1</a></li>' +
                '<li><a href="#">Option 2</a></li>' +
                '<li><a href="#">Option 3</a></li>' +
             '</ul>';

  beforeEach(function() {
    window = domino.createWindow(html);
    document = window.document;
    window.$ = require("../keynavigator.js");

    // Hack: override jQuerys default context:
    // Needed for this test to work.
    // http://stackoverflow.com/questions/3690447/override-default-jquery-selector-context
    var jQueryInit = $.fn.init;
    $.fn.init = function(arg1, arg2, rootjQuery){
        arg2 = arg2 || window.document;
        return new jQueryInit(arg1, arg2, rootjQuery);
    };

    $.fn.position = function() {
      return {
        left: 10,
        top: 10
      };
    };
  });

  var createKeyEvent = function(keyCode) {
    return $.Event('keydown', { which: keyCode });
  },

  arrowDownEvent = createKeyEvent(40 /* arrow down */),
  arrowUpEvent = createKeyEvent(38 /* arrow up */);

  describe('Custom settings', function() {

    it('handles bad settings', function() {
      $('ul li').keynavigator('');
      $('ul li').keynavigator('a');
      $('ul li').keynavigator(null);
    });

    it('has a keynavigator property', function() {
      var $nodes = $('ul li').keynavigator();

      expect($nodes.keynavigator).toBeDefined();
    });
  });

  describe('Tabindex', function() {

    it('should set tabindex from submited settings on parent element', function() {
      var $parent = $('ul li', document).keynavigator({
        tabindex: 10
      }).parent();

      expect($parent.attr('tabindex')).toBe('10');
    });

    it('should set default tabindex on parent element', function() {
      var $parent = $('ul li', document).keynavigator().parent();

      expect($parent.attr('tabindex')).toBe('-1');
    });

  });

  describe('Navigation', function() {

    it('should handle arrow down', function() {
      // Arrange
      var nodes = $('ul li', document).keynavigator({
        activeClass: 'activeClass'
      });

      nodes.first().trigger('click');
      // Act    
      nodes.parent().focus().trigger(arrowDownEvent);

      // Assert    
      expect(nodes[1].className).toBe('activeClass');
    });
  });

});