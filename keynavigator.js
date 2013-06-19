/*!
 * Key navigator plugin for jQuery / Zepto.
 *
 * https://github.com/nekman/keynavigator
 */
(function(root, factory) {
  'use strict';
  // CommonJS.
  if (typeof exports === 'object') {
     module.exports = factory(require('jquery'));
  } else if (typeof root.define === 'function' && root.define.amd) {
    // AMD.
    // jQuery 1.7+ registers it self as a AMD module. 
    // If Zepto is used, define jquery and return Zepto eg:
    // 
    //    define('jquery', function() {
    //      return $;
    //    });
    //
    define('keynavigator', ['jquery'], factory);
  } else {
    // Assume jQuery or Zepto are loaded from <script> tags.
    factory(root.jQuery || root.Zepto);
  }
}(this, function($) {
  /*
   * KeyNavigator
   *
   * @param $nodes - jQuery nodes that should be watched.
   * @param $parent - The parent element.
   * @param settings - custom settings.
   */
  var KeyNavigator = function($nodes, $parent, settings)  {
    // Extend custom settings with default settings.
    // Could 'deep copy' ($.extend(true, ...)) the entire settings, but this could result
    // in conflicts betweeen methods provided by KeyNavigator and methods provided
    // by the user.
    var options = settings || {};
    this.options = $.extend({}, this.defaults, options);
    this.options.keys = $.extend({}, this.defaults.keys, options.keys);

    this.tagName = $nodes.prop('tagName');
    this.$nodes = $nodes;

    // If the parent node doesn't have a tabindex attribute, then add one.
    // This is needed to be able to set focus on the node.
    if (!$parent.attr('tabindex')) {
      $parent.attr({ tabindex: this.options.tabindex || -1 });
    }

    this.$parent = $parent;
  };

  // Key mappings.
  KeyNavigator.keys = {
      0: '?',
      8: 'backspace',
      9: 'tab',
      13: 'enter',
      16: 'shift',
      17: 'ctrl',
      18: 'alt',
      19: 'pause_break',
      20: 'caps_lock',
      27: 'escape',
      33: 'page_up',
      34: 'page_down',
      35: 'end',
      36: 'home',
      37: 'left_arrow',
      38: 'up_arrow',
      39: 'right_arrow',
      40: 'down_arrow',
      45: 'insert',
      46: 'delete',
      48: '0',
      49: '1',
      50: '2',
      51: '3',
      52: '4',
      53: '5',
      54: '6',
      55: '7',
      56: '8',
      57: '9',
      65: 'a',
      66: 'b',
      67: 'c',
      68: 'd',
      69: 'e',
      70: 'f',
      71: 'g',
      72: 'h',
      73: 'i',
      74: 'j',
      75: 'k',
      76: 'l',
      77: 'm',
      78: 'n',
      79: 'o',
      80: 'p',
      81: 'q',
      82: 'r',
      83: 's',
      84: 't',
      85: 'u',
      86: 'v',
      87: 'w',
      88: 'x',
      89: 'y',
      90: 'z',
      91: 'left_window_key',
      92: 'right_window_key',
      93: 'select_key',
      96: 'numpad_0',
      97: 'numpad_1',
      98: 'numpad_2',
      99: 'numpad_3',
      100: 'numpad 4',
      101: 'numpad_5',
      102: 'numpad_6',
      103: 'numpad_7',
      104: 'numpad_8',
      105: 'numpad_9',
      106: 'multiply',
      107: 'add',
      109: 'subtract',
      110: 'decimal point',
      111: 'divide',
      112: 'f1',
      113: 'f2',
      114: 'f3',
      115: 'f4',
      116: 'f5',
      117: 'f6',
      118: 'f7',
      119: 'f8',
      120: 'f9',
      121: 'f10',
      122: 'f11',
      123: 'f12',
      144: 'num_lock',
      145: 'scroll_lock',
      186: ';',
      187: '=',
      188: ',',
      189: 'dash',
      190: '.',
      191: '/',
      192: 'grave_accent',
      219: 'open_bracket',
      220: '\\',
      221: 'close_braket',
      222: 'single_quote'
  };

  // Default event handlers.
  // TODO: Refactor!
  var defaultEventHandlers = {
    down: function($el, cellPosition) {
      var currentPosition = CellFactory.createFrom($el),
          colCells = this.cellTable.columns[currentPosition.pos.left],
          colCell = colCells[cellPosition.rowIndex + 1];

      if (!colCell && this.options.cycle) {
        colCell = colCells[0];
      }

      if (!colCell) {
        return;
      }

      this.setActiveElement(colCell.$el);
    },

    up: function($el, cellPosition) {
      var currentPosition = CellFactory.createFrom($el),
          colCells = this.cellTable.columns[currentPosition.pos.left],
          colCell = colCells[cellPosition.rowIndex - 1];

      if (!colCell && this.options.cycle) {
        colCell = colCells[colCells.length - 1];
      }

      if (!colCell) {
        return;
      }

      this.setActiveElement(colCell.$el);
      $el.trigger('up', [$el]);
    },

    left: function($el, cellPosition) {
      var currentPosition = CellFactory.createFrom($el),
          rowCells = this.cellTable.rows[currentPosition.pos.top],
          rowCell = rowCells[cellPosition.colIndex - 1];

      if (!rowCell && this.options.cycle) {
        rowCell = rowCells[rowCells.length - 1];
      }

      if (!rowCell) {
        return;
      }

      this.setActiveElement(rowCell.$el);
    },

    right: function($el, cellPosition) {
      var currentPosition = CellFactory.createFrom($el),
          rowCells = this.cellTable.rows[currentPosition.pos.top],
          rowCell = rowCells[cellPosition.colIndex + 1];

      if (!rowCell && this.options.cycle) {
        rowCell = rowCells[0];
      }

      if (!rowCell) {
        return;
      }

      this.setActiveElement(rowCell.$el);
    }
  },

  /*
   * Utility for converting a jQuery position to a {cell} object.
   */
  CellFactory = {
    createFrom: function($el) {
      var position = $el.position();

      return {
        pos: {
          left: Math.round(position.left),
          top: Math.round(position.top)
        },

        $el: $el
      };
    }
  },

  /*
   * CellTable
   *  - Finds and navigates in cells.
   *
   * @param $nodes - jQuery nodes to build the cell table from. 
   *
   * TODO: Refactor!
   */
  CellTable = function($nodes) {
    this.table = this.buildTable($nodes);

    this.rows = this.buildRows();
    this.columns = this.buildColumns();
  };

  CellTable.prototype = {
    buildTable: function($nodes) {
      return $nodes.map(function() {
        return CellFactory.createFrom($(this));
      });
    },

    buildColumns: function() {
      var columns = {},
          self = this;

      $.each(this.table, function(index, cell) {
        columns[cell.pos.left] = self.getColumnElements(cell);
      });

      return columns;
    },

    buildRows: function() {
      var rows = {},
          self = this;

      $.each(this.table, function(i, cell) {
        rows[cell.pos.top] = self.getRowElements(cell);
      });

      return rows;
    },

    getRowElements: function(compareCell) {
      var self = this;

      return $.map(this.table, function(cell) {
        if (self.isSameRow(cell, compareCell)) {
          return cell;
        }

        return null;
      });
    },

    getColumnElements: function(compareCell) {
      var self = this;

      return $.map(this.table, function(cell) {
        if (self.isSameColumn(cell, compareCell)) {
          return cell;
        }

        return null;
      });
    },

    getCurrent: function($el) {
      var cell = CellFactory.createFrom($el);

      return this.findPosition(
        this.getCell(cell)
      );
    },

    isSameColumn: function(cell, compareCell) {
      return cell.pos.left === compareCell.pos.left;
    },

    isSameRow: function(cell, compareCell) {
      return cell.pos.top === compareCell.pos.top;
    },

    isSame: function(cell, compareCell) {
      return this.isSameColumn(cell, compareCell) && this.isSameRow(cell, compareCell);
    },

    getCell: function(cell) {
      var self = this;
      return $.map(this.table, function(compareCell) {
        if (self.isSame(cell, compareCell)) {
          return compareCell;
        }

        return null;
      })[0];
    },

    findIndex: function(array, callback) {
      var index = 0,
          len = array.length;

      for (index = 0; index < len; index++) {
        if (callback(array[index])) {
          return index;
        }
      }

      return index;
    },

    findPosition: function(cell) {
      var colCells = this.getColumnElements(cell),
          rowCells = this.getRowElements(cell),

          rowIndex = this.findIndex(colCells, function(colCell) {
            return colCell.pos.top == cell.pos.top;
          }),

          colIndex = this.findIndex(rowCells, function(rowCell) {
            return rowCell.pos.left == cell.pos.left;
          });

      return {
        colIndex: colIndex,
        rowIndex: rowIndex
      };
    }
  };

  KeyNavigator.prototype = {
    // Default settings
    defaults: {
      useCache: true,
      cycle: false,
      activeClass: 'active',
      // default keys.
      keys: {
        up_arrow: defaultEventHandlers.up,
        down_arrow: defaultEventHandlers.down,
        left_arrow: defaultEventHandlers.left,
        right_arrow: defaultEventHandlers.right
      }
    },

    handleKeyDown: function(e) {
      // Use event.which property to normalizes event.keyCode and event.charCode.
      var fn = this.options.keys[KeyNavigator.keys[e.which]] || this.options.keys[e.which];
      if (!fn) {
        // No handler found for current keyCode.
        return;
      }

      e.preventDefault ? e.preventDefault() : e.returnValue = false;

      // If 'useCache' isn't enabled, 
      // then query for DOM-nodes with the same selector.
      if (!this.cellTable || !this.options.useCache) {
        this.reBuild();
      }

      var $selected = this.$parent.find(this.tagName +'[class="'+ this.options.activeClass +'"]');

      // One more try...
      if (!$selected.length) {
        $selected = this.$nodes.first();
      }

      if (!$selected.length) {
        // Could not find any element.
        return;
      }

      var cell = this.cellTable.getCurrent($selected);

      fn.apply(this, [$selected, cell, e]);
    },

    setActiveElement: function($el) {
      // Remove the active class (from all nodes), 
      // add the active class to the selected node.
      this.$nodes.removeClass(this.options.activeClass);
      $el.addClass(this.options.activeClass);
    },

    reBuild: function() {
      // If 'useCache' isn't enabled, 
      // then query for DOM-nodes with the same selector.
      if (!this.options.useCache) {
        this.$nodes = $(this.$nodes.selector);
      }

      this.cellTable = new CellTable(this.$nodes);
    }
  };

  $.fn.keynavigator = function(options) {
    var $parent = this.parent(),
        navigator = new KeyNavigator(this, $parent, options);

    this.on('click', function() {
        navigator.setActiveElement($(this));
    });

    // Need to wait until resizing  is done, so that we don't
    // rebuilding the cellTable more times than we need to.
    var resizing;
    $(window).on('resize', function() {
      clearTimeout(resizing);
      resizing = setTimeout(function() {
        navigator.reBuild();
      }, 200);
    });

    $parent
      .on('keydown', $.proxy(navigator.handleKeyDown, navigator))
      .on('click', function() {
        $parent.focus();
      });

    return this;
  };

  // Just return the $-function. 
  // Needed (good practice) for AMD / UMD modules.
  return $;

}));