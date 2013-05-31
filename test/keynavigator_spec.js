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
  });

  var createKeyEvent = function(keyCode) {
    return $.Event('keydown', { which: keyCode });
  },

  arrowDownEvent = createKeyEvent(40 /* arrow down */),
  arrowUpEvent = createKeyEvent(38 /* arrow up */);

  describe('Custom settings', function() {

    it('handles bad settings', function() {
      $('ul li').keynavigator(null)
                .keynavigator('')
                .keynavigator('a');
    });

    it('handles any key', function() {
      // Arrange      
      var settings = {
          keyMappings: {
            65: function($el) {
            }
          }
      };

      spyOn(settings.keyMappings, '65');
      var nodes = $('ul li', document).keynavigator(settings);

      // Act
      nodes.parent().focus().trigger(createKeyEvent(65));

      // Assert
      expect(nodes.first().hasClass('activeClass')).toBe(false);
      expect(settings.keyMappings['65']).toHaveBeenCalled();
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

  describe('Cache', function() {

    describe('is enabled', function() {

      it('should not reuse the selector on navigation', function(){
        var keynavigator,
            expectedElementLength = 3,
        nodes = $('ul li', document).keynavigator({
          activeClass: 'activeClass',
          keyMappings: {
            37: function() {
              // Capture current instance of keynavigator.
              keynavigator = this;
            }
          }
        });

        nodes.last().trigger(createKeyEvent('37'));
        nodes.parent().append(document.createElement('li'))
                      .focus()
                      .trigger(arrowDownEvent);

        // Verify that the keynavigator.$nodes don't have been updated.
        expect(keynavigator.$nodes.length).toBe(expectedElementLength);
      });
    });

    describe('is not enabled', function() {

      it('should reuse the selector on navigation', function() {
        var keynavigator,
            expectedElementLength = 4,
        nodes = $('ul li', document).keynavigator({
          activeClass: 'activeClass',
          useCache: false,
          keyMappings: {
            37: function() {
              // Capture current instance of keynavigator.
              keynavigator = this;
            }
          }
        });

        nodes.last().trigger(createKeyEvent('37'));
        nodes.parent().append(document.createElement('li'))
                      .focus()
                      .trigger(arrowDownEvent);

        // Verify that the keynavigator.$nodes has been updated.
        expect(keynavigator.$nodes.length).toBe(expectedElementLength);
      });
    });

  });

  describe('Navigation', function() {

    it('should handle arrow down', function() {
      // Arrange
      var nodes = $('ul li').keynavigator({
        activeClass: 'activeClass'
      });

      nodes.first().trigger('click');
      // Act    
      nodes.parent().focus().trigger(arrowDownEvent);

      // Assert    
      expect(nodes[1].className).toBe('activeClass');
    });

    it('should handle arrow up', function() {
      // Arrange
      var nodes = $('ul li').keynavigator({
        activeClass: 'activeClass'
      });

      nodes.last().trigger('click');

      // Act    
      nodes.parent().focus().trigger(arrowUpEvent);

      // Assert    
      expect(nodes[1].className).toBe('activeClass');
    });

    it('should handle cycle if enabled', function() {
      // Arrange
      var nodes = $('ul li').keynavigator({
        activeClass: 'activeClass',
        cycle: true
      });

      nodes.last().trigger('click');

      // Act    
      nodes.parent().focus().trigger(arrowDownEvent);

      // Assert    
      expect(nodes[0].className).toBe('activeClass');
    });
  });

});