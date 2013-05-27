describe('KeyNavigator', function() {

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


  var arrowDownEvent = $.Event('keydown', { keyCode: 40 /* arrow down */ }),
      arrowUpEvent = $.Event('keydown', { keyCode: 38 /* arrow up */ });

  describe('Click', function() {

    it('sets active class on element click', function() {
      // Arrange
      var nodes = $('ul li', document).keynavigator({
        activeClass: 'activeClass'
      });

      // Act
      nodes.last().trigger('click');

      // Assert
      expect(nodes.first().hasClass('activeClass')).toBe(false);
      expect(nodes.last().hasClass('activeClass')).toBe(true);
    });
  });


  describe('Cache', function() {

    describe('is enabled', function() {

      it('should not reuse the selector on navigation', function(){
        var keynavigator;
        var nodes = $('ul li', document).keynavigator({
          activeClass: 'activeClass',
          click: function() {
            // Capture current instance of keynavigator.
            keynavigator = this;
          }
        });

        nodes.last().trigger('click');
        nodes.parent().append(document.createElement('li'))
                      .focus()
                      .trigger(arrowDownEvent);

        // Verify that the keynavigator.$nodes don't have been updated.
        expect(keynavigator.$nodes.length).toBe(3);
      });
    });

    describe('is not enabled', function() {

      it('should reuse the selector on navigation', function() {
        var keynavigator;
        var nodes = $('ul li', document).keynavigator({
          activeClass: 'activeClass',
          useCache: false,
          click: function() {
            // Capture current instance of keynavigator.
            keynavigator = this;
          }
        });

        nodes.last().trigger('click');
        nodes.parent().append(document.createElement('li'))
                      .focus()
                      .trigger(arrowDownEvent);

        // Verify that the keynavigator.$nodes has been updated.
        expect(keynavigator.$nodes.length).toBe(4);
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