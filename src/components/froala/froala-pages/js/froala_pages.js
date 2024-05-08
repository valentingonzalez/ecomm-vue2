/*!
  * Froala Pages v1.2.0 (https://github.com/froala-labs/froala-pages#readme)
  * Copyright 2017-2020 
  * Licensed under Froala Pages Terms (https://www.froala.com/pages/terms)
  */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
  (global.FroalaPages = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};


var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};


var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

// Helpers to make changes on the DOM.
var Helpers = function () {
  function Helpers() {
    classCallCheck(this, Helpers);
  }

  Helpers.createElement = function createElement(html) {
    var el = document.createElement('DIV');
    el.innerHTML = html;
    return el.firstChild;
  };

  Helpers.prepend = function prepend(parent, el) {
    if (!parent.firstChild) {
      parent.append(el);
    } else {
      parent.insertBefore(el, parent.firstChild);
    }
  };

  Helpers.append = function append(parent, el) {
    parent.appendChild(el);
  };

  Helpers.after = function after(node, el) {
    node.parentNode.insertBefore(el, node.nextSibling);
  };

  Helpers.before = function before(node, el) {
    node.parentNode.insertBefore(el, node);
  };

  Helpers.remove = function remove(node) {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  };

  Helpers.offset = function offset(el) {
    var rect = el.getBoundingClientRect();

    return {
      top: rect.top,
      left: rect.left
    };
  };

  Helpers.outerHeight = function outerHeight(el) {
    var withMargin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var height = el.offsetHeight;

    if (withMargin) {
      var style = getComputedStyle(el);

      height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
      return height;
    }

    return height;
  };

  Helpers.outerWidth = function outerWidth(el) {
    var withMargin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var width = el.offsetWidth;

    if (withMargin) {
      var style = getComputedStyle(el);

      width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
      return width;
    }

    return 0;
  };

  Helpers.underscores = function underscores(text) {
    return text.toLowerCase().split(' ').join('_');
  };

  Helpers.scrollTo = function scrollTo(el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  };
  return Helpers;
}();

// Define our internal module class.
// The Module class is inherited by inernal classes and in the constructor of the module
// we assign the common used objects for easier access.
var Module = function Module(page) {
    classCallCheck(this, Module);

    // Set page instance.
    this.page = page;

    // Set events.
    this.events = page.events;

    // Set doc.
    this.doc = page.doc;

    // Set options.
    this.opts = page.opts;

    // Call internal init method that works like a constructor.

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    this.init.apply(this, args);
};

// A block on the page.

var Block = function (_M) {
  inherits(Block, _M);

  function Block() {
    classCallCheck(this, Block);
    return possibleConstructorReturn(this, _M.apply(this, arguments));
  }

  Block.prototype.init = function init(designBlock) {
    var _this2 = this;

    this.designBlock = designBlock;
    this.id = ++Block.ID;

    // Create element.
    this.el = Helpers.createElement(designBlock.render({
      imagesDir: this.opts.designsImagesDir
    }));
    this.el.setAttribute('data-block-type', Helpers.underscores(designBlock.blockType));
    this.el.setAttribute('data-id', this.id);

    this.events.on(this.el, 'mouseenter', function () {
      return _this2._mouseEnter();
    });
  };

  // Emit block enter event.


  Block.prototype._mouseEnter = function _mouseEnter() {
    this.events.emit('block.mouseenter', this);
  };

  return Block;
}(Module);

Block.ID = 0;

var DRAG_IMAGE_HEIGHT = 50;

// A design block is an element from the Designs Panel.

var DesignBlock = function (_M) {
  inherits(DesignBlock, _M);

  function DesignBlock() {
    classCallCheck(this, DesignBlock);
    return possibleConstructorReturn(this, _M.apply(this, arguments));
  }

  DesignBlock.prototype.init = function init(blockType, info) {
    var _this2 = this;

    // Create design block.
    this.el = document.createElement('IMG');
    this.el.setAttribute('draggable', true);
    this.blockType = blockType;
    this.template = info.template;
    this.image = info.image;
    this.el.setAttribute('src', '' + (this.opts.designsThumbsDir || '') + this.image);

    // Bind events.
    this.events.on(this.el, 'click', function () {
      return _this2.click();
    });
    this.events.on(this.el, 'dragstart', function (e) {
      return _this2.dragstart(e);
    });
  };

  // Click on a block.


  DesignBlock.prototype.click = function click() {
    this.events.emit('designBlock.click', this);
  };

  // Start dragging a block.


  DesignBlock.prototype.dragstart = function dragstart(e) {
    // Set dragging placeholder.
    if (navigator.userAgent.search('Firefox') >= 0) {
      // Set image holder to support in FF while drag & Drop
      this.dragImage = Helpers.createElement('<span><img src="' + this.el.src + '" height="' + DRAG_IMAGE_HEIGHT + '" /></span>');
    } else {
      this.dragImage = Helpers.createElement('<img src="' + this.el.src + '" height="' + DRAG_IMAGE_HEIGHT + '" />');
    }
    this.dragImage.style.position = 'absolute';
    Helpers.append(this.page.body, this.dragImage);

    e.dataTransfer.setDragImage(this.dragImage, 0, 0);

    // Set empty string to work with Edge browser
    e.dataTransfer.setData('text/html', '');

    // Emit event of drag start.
    this.events.emit('designBlock.willDrag', this);
  };

  // Render design block.


  DesignBlock.prototype.render = function render(params) {
    return this.template.replace(/{{[a-zA-Z_]*}}/g, function (match) {
      var varName = match.replace(/{|}/g, '').trim();

      return params[varName] || '{{' + varName + '}}';
    });
  };

  return DesignBlock;
}(Module);

DesignBlock.BLOCKS = {};
DesignBlock.HEADER = 'Headers';
DesignBlock.FOOTER = 'Footers';

// Global method to register a new design block.
DesignBlock.Register = function (type, template, image) {
  if (!DesignBlock.BLOCKS[type]) {
    DesignBlock.BLOCKS[type] = [];
  }

  DesignBlock.BLOCKS[type].push({
    template: template,
    image: image
  });
};

// Define constants for different views.
var VIEWS = {
  ADD: 1,
  FULL: 2,
  DESKTOP: 100,
  TABLET_LANDSCAPE: 1024,
  TABLET_PORTRAIT: 768,
  PHONE: 375
};

// There are 2 type of buttons - both of them work in the same manner only that have different callbacks:
//   1. on block toolbar
//   2. on page toolabr

var Button = function (_M) {
  inherits(Button, _M);

  function Button() {
    classCallCheck(this, Button);
    return possibleConstructorReturn(this, _M.apply(this, arguments));
  }

  Button.prototype.init = function init(name) {
    var _this2 = this;

    // Get button details.
    this.props = Button._[name];

    if (!this.props) {
      throw new Error('A button with the name ' + name + ' could not be found');
    }

    // Render button.
    this._render(name);

    // Bind button events.
    this.events.on(this.el, 'click', function () {
      return _this2._click();
    });
    this.events.listen('button.refresh', function () {
      return _this2._refresh();
    });

    // Bind event handler for file input field to re-open the saved template for editing.
    if (name === 'loadhtml') {
      this.events.on(this.el.querySelector('#load_template'), 'change', function (e) {
        if (e.target.files.length) {
          _this2.page.uploadTemplate(e.target.files[0]);
          e.target.value = '';
        }
      });
    }

    // Call button callback after build.
    if (this.props.afterBuild) {
      this.props.afterBuild.apply(this);
    }
  };

  // Refresh button state.


  Button.prototype._refresh = function _refresh() {
    if (this.props.refresh) {
      this.props.refresh.apply(this);
    }
  };

  // Render button.


  Button.prototype._render = function _render(name) {
    this.el = this.doc.createElement('BUTTON');
    this.el.innerHTML = this.props.icon.template;
    this.el.classList.add('fp-btn', 'fp-' + name + '-btn', 'fr-btn-type-' + this.props.icon.type);
    this.el.setAttribute('title', this.props.title);
  };

  // Click button callback.


  Button.prototype._click = function _click() {
    this.props.callback.apply(this);
    this.events.emit('button.refresh');
  };

  return Button;
}(Module);

// Register button.


Button.Register = function (name, props) {
  if (!Button._) {
    Button._ = {};
  }

  Button._[name] = props;
};

// Define layout button.
Button.Register('layout', {
  title: 'Layout',
  icon: {
    type: 'svg',
    template: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n                <path d="M0 0h24v24H0z" fill="none"/>\n                <path d="M2 21h19v-3H2v3zM20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zM2 3v3h19V3H2z"/>\n              </svg>'
  },
  callback: function callback() {
    this.page.setView(VIEWS.ADD);
    this.page.designsPanel.show();

    let pageTopEle = this.page.wrapperElement.getElementsByClassName('fp-pageTop-toolbar');
    pageTopEle[0].style.display = 'flex';
  },
  refresh: function refresh() {
    this.el.classList.toggle('fp-active', this.page.activeView === VIEWS.ADD);
  }
});

// Define block move up butotn.
Button.Register('moveUp', {
  title: 'Move Up',
  icon: {
    type: 'svg',
    template: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>\n            <path d="M0 0h24v24H0z" fill="none"/>\n          </svg>'
  },
  callback: function callback() {
    var block = this.page.activeBlock;

    var prevBlock = block.el.previousSibling;
    while (prevBlock && (!prevBlock.classList || !prevBlock.classList.contains('fdb-block'))) {
      prevBlock = prevBlock.previousSibling;
    }

    window.a = prevBlock;
    window.b = block.el;

    if (prevBlock) {
      Helpers.before(prevBlock, block.el);
    }

    if (this.page.activeView === VIEWS.FULL) {
      Helpers.scrollTo(block.el);
    }

    this.page.blockToolbar.hide();
    this.page.blockToolbar.refreshPosition();
  },
  refresh: function refresh() {
    if (this.page.activeBlock) {
      this.el.classList.toggle('fp-hidden', [DesignBlock.HEADER, DesignBlock.FOOTER].indexOf(this.page.activeBlock.designBlock.blockType) >= 0);

      var block = this.page.activeBlock;

      var prevBlock = block.el.previousSibling;
      while (prevBlock && (!prevBlock.classList || !prevBlock.classList.contains('fdb-block'))) {
        prevBlock = prevBlock.previousSibling;
      }

      if (!prevBlock) {
        this.el.classList.add('fp-disabled');
        this.el.setAttribute('disabled', 'disabled');
      } else {
        this.el.classList.remove('fp-disabled');
        this.el.removeAttribute('disabled');
      }
    }
  }
});

// Define block remove button.
Button.Register('remove', {
  title: 'Remove',
  icon: {
    type: 'svg',
    template: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>\n              <path d="M0 0h24v24H0z" fill="none"/>\n          </svg>'
  },
  callback: function callback() {
    if (this.page.activeBlock) {
      if (confirm('Are you sure you want to remove this design block?')) {
        var block = this.page.activeBlock;
        this.page.blockToolbar.hide();

        Helpers.remove(block.el);

        if (this.page.editor.FroalaEditor) {
          this.page.editor.FroalaEditor.INSTANCES.forEach(function (ed) {
            if (block.el.contains(ed.$oel.get(0))) {
              if (ed.popups) ed.popups.hideAll();
            }
          });
        }
        this.page.refreshBlocks();
      }
    }
  },
  afterBuild: function afterBuild() {
    this.el.classList.add('fp-remove-btn');
  }
});

// Define page edit button.
Button.Register('edit', {
  title: 'Edit',
  icon: {
    type: 'svg',
    template: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>\n          <path d="M0 0h24v24H0z" fill="none"/>\n    </svg>'
  },
  callback: function callback() {
    var pageTopEle = this.page.wrapperElement.getElementsByClassName('fp-pageTop-toolbar');
    pageTopEle[0].style.display = 'none';

    this.page.setView(VIEWS.FULL);
    this.page.designsPanel.hide();

    this.page.editor.enable();
  },
  refresh: function refresh() {
    this.el.classList.toggle('fp-active', this.page.activeView === VIEWS.FULL);
  }
});


// Define desktop mode.
Button.Register('desktop', {
  title: 'Desktop',
  icon: {
    type: 'svg',
    template: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n                <path d="M0 0h24v24H0z" fill="none"/>\n                <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/>\n              </svg>'
  },
  callback: function callback() {
    this.page.screenSize = VIEWS.DESKTOP;
    this.page.iframe.style.width = null;
    this.page.el.classList.remove('fp-view-small');
    this.page.refreshIframeSize();
  },
  refresh: function refresh() {
    this.el.classList.toggle('fp-active', this.page.screenSize === VIEWS.DESKTOP);
  },
  afterBuild: function afterBuild() {
    this.page.screenSize = VIEWS.DESKTOP;
  }
});

// Define tablet landscape mode.
Button.Register('tablet_landscape', {
  title: 'Tablet Landscape',
  icon: {
    type: 'svg',
    template: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n    <path d="M0 0h24v24H0z" fill="none"/>\n    <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 1.99-.9 1.99-2L23 6c0-1.1-.9-2-2-2zm-2 14H5V6h14v12z"/>\n              </svg>'
  },
  callback: function callback() {
    this.page.screenSize = VIEWS.TABLET_LANDSCAPE;
    this.page.iframe.style.width = VIEWS.TABLET_LANDSCAPE + 'px';
    this.page.el.classList.add('fp-view-small');
    this.page.refreshIframeSize();
  },
  refresh: function refresh() {
    this.el.classList.toggle('fp-active', this.page.screenSize === VIEWS.TABLET_LANDSCAPE);
  }
});

// Define tablet portrait mode.
Button.Register('tablet_portrait', {
  title: 'Tablet Portrait',
  icon: {
    type: 'svg',
    template: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n                  <path d="M18.5 0h-14C3.12 0 2 1.12 2 2.5v19C2 22.88 3.12 24 4.5 24h14c1.38 0 2.5-1.12 2.5-2.5v-19C21 1.12 19.88 0 18.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7.5-4H4V3h15v16z"/>\n              </svg>'
  },
  callback: function callback() {
    this.page.screenSize = VIEWS.TABLET_PORTRAIT;
    this.page.iframe.style.width = VIEWS.TABLET_PORTRAIT + 'px';
    this.page.el.classList.add('fp-view-small');
    this.page.refreshIframeSize();
  },
  refresh: function refresh() {
    this.el.classList.toggle('fp-active', this.page.screenSize === VIEWS.TABLET_PORTRAIT);
  }
});

// Define phone mode.
Button.Register('phone', {
  title: 'Phone',
  icon: {
    type: 'svg',
    template: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n                <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>\n                <path d="M0 0h24v24H0z" fill="none"/>\n              </svg>'
  },
  callback: function callback() {
    this.page.screenSize = VIEWS.PHONE;
    this.page.iframe.style.width = VIEWS.PHONE + 'px';
    this.page.el.classList.add('fp-view-small');
    this.page.refreshIframeSize();
  },
  refresh: function refresh() {
    this.el.classList.toggle('fp-active', this.page.screenSize === VIEWS.PHONE);
  }
});

// Define re-open saved template button.
Button.Register('loadhtml', {
  title: 'Load HTML',
  icon: {
    type: 'svg',
    template: '<label for="load_template"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">\n                <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.18 216.01H224v80c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-80H94.82c-14.28 0-21.41-17.29-11.27-27.36l96.42-95.7c6.65-6.61 17.39-6.61 24.04 0l96.42 95.7c10.15 10.07 3.03 27.36-11.25 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"></path>\n              </svg></label><input type="file" id="load_template" style="display: none;" />'
  },
  callback: function callback() {},
  refresh: function refresh() {
    this.el.classList.toggle('fp-active', false);
  }
});

var LEAVE_TIMEOUT = 50;
// Define constants for different views.


// Toolbar on a block.

var BlockToolbar = function (_M) {
  inherits(BlockToolbar, _M);

  function BlockToolbar() {
    classCallCheck(this, BlockToolbar);
    return possibleConstructorReturn(this, _M.apply(this, arguments));
  }

  BlockToolbar.prototype.init = function init() {
    // DOM.
    this.el = this.doc.createElement('DIV');
    this.el.classList.add('fp-block-toolbar');
    Helpers.append(this.page.body, this.el);

    // Buttons.
    this._addButtons();

    // Events.
    this._initEvents();
  };

  BlockToolbar.prototype._initEvents = function _initEvents() {
    var _this2 = this;

    this.events.listen('block.mouseenter', function (block) {
      return _this2.showForBlock(block);
    });
    this.events.on(this.page.iframeDoc, 'mouseleave', function () {
      return _this2._doLeave();
    });
    this.events.on(this.el, 'mouseenter', function () {
      return clearTimeout(_this2.leaveTimeout);
    });
    this.events.on(this.el, 'mouseleave', function () {
      return _this2._doLeave();
    });
    this.events.on(this.page.iframeDoc, 'scroll', function () {
      return _this2.refreshPosition();
    });
    this.events.on(this.page.el, 'scroll', function () {
      return _this2.refreshPosition();
    });
  };

  // Mouse goes outside of the page.


  BlockToolbar.prototype._doLeave = function _doLeave() {
    var _this3 = this;

    this.leaveTimeout = setTimeout(function () {
      return _this3.hide();
    }, LEAVE_TIMEOUT);
  };

  // Add block buttons.


  BlockToolbar.prototype._addButtons = function _addButtons() {
    var _this4 = this;

    this.opts.blockButtons.forEach(function (btnName) {
      var btn = new Button(_this4.page, btnName);

      Helpers.append(_this4.el, btn.el);
    });
  };

  // Refresh potion of the buttons on the current block.


  BlockToolbar.prototype.refreshPosition = function refreshPosition() {
    if (this.isVisible()) {
      this.showForBlock(this.page.activeBlock);
    }

    this.events.emit('button.refresh');
  };

  // Show buttons toolbar on a specific block.


  BlockToolbar.prototype.showForBlock = function showForBlock(block) {
    clearTimeout(this.leaveTimeout);
    var blockOffset = Helpers.offset(block.el);

    this.page.activeBlock = block;

    var activeEl = this.page.iframeBody.querySelector('.fp-active');
    if (activeEl) {
      activeEl.classList.remove('fp-active');
    }

    block.el.classList.add('fp-active');
    this.show(blockOffset.left, blockOffset.top);
  };

  // Show buttons toolbar at a specific position.


  BlockToolbar.prototype.show = function show(left, top) {
    this.el.classList.add('fp-visible');
    this.el.style.left = left + Helpers.offset(this.page.iframe).left + 'px';
    this.el.style.top = Math.max(0, top) / (this.page.activeView === VIEWS.ADD ? 4 : 1) + Helpers.offset(this.page.iframe).top + 'px';

    this.events.emit('button.refresh');
  };

  // Hide buttons toolbar.


  BlockToolbar.prototype.hide = function hide() {
    this.el.classList.remove('fp-visible');
  };

  // Check if toolbar is visible.


  BlockToolbar.prototype.isVisible = function isVisible() {
    return this.el.classList.contains('fp-visible');
  };

  return BlockToolbar;
}(Module);
  
var Data = function (_M) {
  inherits(Data, _M);

  function Data() {
    classCallCheck(this, Data);
    return possibleConstructorReturn(this, _M.apply(this, arguments));
  }

  Data.prototype.init = function init() {
    var me = this;
    var ls = me.page.opts.key || [''];
    var pageToolbar = me.page.pageToolbar;
    if (typeof ls === 'string') {
      ls = [ls];
    }
    pageToolbar.ul = false;
  };
  
  // Add unlicensed message.
  Data.prototype._add = function _add() {
  };

  Data.prototype._decrypt = function _decrypt() {
  };

  Data.prototype._parse = function _parse(key) {
    var info = (this._decrypt(key) || '').split('|');

    if (info.length === 4 && info[0] === 'V3') {
      return [info[1], info[3], info[2]];
    }

    return [null, null, ''];
  };

  Data.prototype._sumDigits = function _sumDigits(number) {
    var str = number.toString();
    var sum = 0;

    for (var i = 0; i < str.length; i++) {
      sum += parseInt(str.charAt(i), 10);
    }

    if (sum > 10) {
      return sum % 9 + 1;
    }

    return sum;
  };

  Data.prototype._fromRange = function _fromRange(charCode, ks, i) {

    // Get how many times we should substract.
    var p = Math.abs(i);

    while (p-- > 0) {
      charCode -= ks;
    }

    // Add 123 if the index is negative.
    if (i < 0) {
      charCode += 123;
    }

    return charCode;
  };

  Data.prototype._foo = function _foo(x) {
    return x;
  };

  Data._getData = function _getData(me, resolve, reject, jsonFormat) {
    var p = me.page;
    var htmlHeader = p._getHeadHTML();
    var htmlBody = p._getBodyHTML();
    if (!me.domain) {
      p.editor.disable();

      var data = '';

      if (jsonFormat) {
        // Create a JSON structure.
        data = {
          style: p._getLinks(),
          inlineStyle: p._getInlineStyle(),
          scripts: p._getScripts(),
          blocks: p._getBlockHTML()
        };

        data = JSON.stringify(data);
      } else {
        // Create a HTML structure.
        data = '<!DOCTYPE html>\n            <html>\n            <head>\n            ' + htmlHeader + '\n            </head>\n            <body>\n            ' + htmlBody + '\n            </body>\n            </html>\n            ';
      }

      // Init editor back.
      p.editor.enable();
      resolve(data);
    } else {
      // Destroy editor instances so that we remove editor UX.
      p.editor.disable();

      // Create a HTML structure.
      var _data = html`
        <!DOCTYPE html>
        <html>
          <head>${htmlHeader}</head>
          <body>${htmlBody}</body>
        </html>`;

      // Init editor back.
      p.editor.enable();

      resolve(_data);
    }
  };
  return Data;
}(Module);

// CSS to be injected in the iframe.
var STYLESHEET = /*css*/`
body, html {
    margin: 0;
    height: 100%;
}
body.no-block {
    flex-flow: column;
    overflow-x: hidden;
    display: flex;
}
body {
    background: #fff;
}
.container {
  max-width: 100% !important;
}
.fp-no-block {
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-direction: column;
    cursor: pointer;
    color: #444;
    display: none;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    text-align: center;
    background: #FFF;
    transition: margin 0.25s linear 0.25s;
    min-height: 300px;
}
.fp-no-block:hover {
    background: #EFEFEF;
}
.fp-no-block.fp-visible {
    display: flex;
}
.fp-no-sections {
    flex: 2;
}
.fr-wrapper{
    width: 100%;
}
.navbar .fr-view{
    display: flex;
    align-items: center;
}
.fr-popup.fr-desktop.fr-inline.fr-active{
  
}


.fr-popup.fr-desktop.fr-inline.fr-imageProButton.fr-active{
    display:flex;
    padding-right: 12px; 
}

.fr-float-left{
    align-items: flex-end;
    display: flex;
    border-top: 1px solid #ebebeb;
    margin-top: 53px;
    padding-bottom: 12px;
    margin-left: -10px;
    padding-left: 10px;
}
#myModal2 .try_fro_content_footer{
    justify-content: center;
    padding-bottom: 20px;
}
#myModal2  .modal-dialog{
    max-width: 450px;
}
#myModal2  .try_fro {
    padding: 45px 22px;
    border-bottom-right-radius: 75%;
    border-bottom-left-radius: 75%;
}
#myModal2  .try_fro_content {
    padding: 40px 22px 0px 22px;
}
#myModal2  .try_fro p {
    color: #fff;
    font-size: 25px;
    margin: 0px;
    text-align: center;
}
.fr-wrapper p{
    margin: 0px;
}
.fr-box.fr-inline .fr-wrapper  .fr-element.fr-view ul{
    display: inline-block !important;
    list-style: none; 
}

[role="application"] .fr-view ul{
    display: flex !important;
    list-style: none;
}


.fp-no-block p {
    margin: 0;
}
.fp-no-sections p + p {
    font-size: 16px;
    margin-top: 5px;
}
.fdb-block {
    box-shadow: 0;
    margin-bottom: 0;
    transition: margin 0.25s linear 0.25s;
    margin-top: -5px;
    padding: 2rem 0;
}
.tui-image-editor-container .tui-image-editor-checkbox-wrap.fixed-width{
    width: 187px !important;
}

.tui-image-editor-container.left .tui-image-editor-submenu .tui-image-editor-submenu-item li{
    margin-top: 8px;
}
.tui-image-editor-container.left .tui-image-editor-submenu .tui-image-editor-submenu-item li:nth-child(1){
    margin-top: -20px;
}

.paddremov{
    padding:0px;
}
.try_fro{
    background-color: #0092FA;
    color: #7DFEFF;
    padding: 35px 22px;
    border-bottom-right-radius: 75%;
}
.try_fro_content{
    padding: 25px 22px 4px 22px;
}
.try_fro_content p{
    color: #000;
}
.try_fro_content_bottom{
    padding: 0px 22px;
}
.try_fro_content_bottom p{
    color: #000;
    font-size: 14px;
}
.try_fro_content_footer ul{
    font-size: 14px;
    padding:0px;
    color: #000;
}
.fr-toolbar .fr-btn-grp:nth-child(1){
    display: block;
    float: none;
}
.fr-toolbar .fr-btn-grp{
    margin: 0px 8px 0 -12px;
      padding-bottom: 0px;
}


.fr-toolbar.fr-inline{
    z-index: 999;
}
.pro-btn button{
    background-color: #0789DC;
    border: none;
    color: #fff;
    padding: 7px 12px;
    border-radius: 2px;
    cursor: pointer;
    margin-top: 7px;
    outline: none !important;
}
.popupp{
    z-index: 9999999999;
}
.try_fro_content_footer{
    display: flex;
    justify-content: space-around;
    padding: 0px 10px;
}
.try_fro h1{
    font-weight: 300;
    color: #7DFEFF;
    margin: 0px;
    line-height: 47px;
}
.fr-custom{
    display: block !important;
}
.try_fro p{
    color: #fff;
    font-size: 35px;
    margin: 0px;
}
.fp-add-view [data-block-type],
.fp-add-view .fp-no-block {
    margin-bottom: 20px;
}
.fp-add-view [data-block-type] {
    user-select: none;
    position: relative;
}
.fp-add-view section[data-block-type] {
    cursor: move;
}
.fp-add-view [data-block-type]:after {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: block;
    z-index: 10000;
    content: "";
}
.fp-drop-placeholder {
    height: 200px;
    width: 100%;
    border: solid 10px  #0098f7;
    background: #FFF;
    margin-bottom: 20px;
}
.fp-dragging {
    display: none;
}
.fr-popup {
    z-index: 999 !important;
}

.tui-image-editor-container.left .tui-image-editor-submenu{
    position: relative;
}
img.fr-dib {
    margin: 5px auto;
    display: block;
    float: none;
    vertical-align: top;
}
span.fr-emoticon.fr-emoticon-img {
    background-repeat: no-repeat !important;
    font-size: inherit;
    height: 1em;
    width: 1em;
    min-height: 20px;
    min-width: 20px;
    display: inline-block;
    margin: -.1em .1em .1em;
    line-height: 1;
    vertical-align: middle;
}
@media only screen and (max-width: 767px) {
    .navbar .fr-view {
      display: block;
      align-items: unset;
}
}
`;

// DEFAULTS.
var options = {
  // Path to load design blocks thumbs.
  designsThumbsDir: 'https://cdn.jsdelivr.net/gh/froala/design-blocks@master/screenshots/',

  // Path to load images for a design block.
  designsImagesDir: 'https://cdn.jsdelivr.net/gh/froala/design-blocks@master/dist/imgs/',

  // Default block type to be selected.
  designsDefaultBlocks: 'Contents',

  // CSS to be injected.
  designStylesheets: [],

  // JS to be injected.
  designJavascripts: [],

  // Application default CSS.
  appStyle: STYLESHEET,

  // Buttons for a block.
  blockButtons: ['moveUp', 'remove'],

  // licensing key for pages
  key: 'MZC1rD2E4D4D3B15A9iAd1Te1YZNYAc1CUKUEQOHFVANUqB2C1E7A6E1F5G4A1B3C10==',

  // Page toolbar top buttons.
  pageTopButtons: [['edit']],

  // Page toolbar left buttons.
  pageLeftButtons: [['edit', 'layout', 'loadhtml'], ['desktop', 'tablet_landscape', 'tablet_portrait', 'phone']],

  // Page toolbar center buttons.
  pageCenterButtons: [''],

  // Page toolbar right buttons.
  pageRightButtons: [],

  // Custom options for the editor.
  editorOptions: {
    iconsTemplate: 'font_awesome_5',
    linkList: [{
      text: 'Froala',
      href: 'https://froala.com',
      target: '_blank'
    }, {
      text: 'Google',
      href: 'https://google.com',
      target: '_blank'
    }, {
      text: 'Facebook',
      href: 'https://facebook.com'
    }]
  }
};

// Designs panel.

var Panel = function (_M) {
  inherits(Panel, _M);

  function Panel() {
    classCallCheck(this, Panel);
    return possibleConstructorReturn(this, _M.apply(this, arguments));
  }

  Panel.prototype.init = function init(title, content) {
    this.el = this.doc.createElement('DIV');
    this.el.setAttribute('class', 'fp-panel');

    this._addTitle(title);
    this._addContent(content);

    Helpers.append(this.page.container, this.el);

    this.render();
  };

  Panel.prototype._addContent = function _addContent(content) {
    var body = this.doc.createElement('DIV');
    body.setAttribute('class', 'fp-panel-body');

    if (content) {
      body.innerHTML = content;
    }

    Helpers.append(this.el, body);

    this.body = body;
  };

  Panel.prototype._addTitle = function _addTitle(title) {
    var head = this.doc.createElement('DIV');
    head.setAttribute('class', 'fp-panel-head');

    if (title) {
      var headTitle = this.doc.createElement('H2');
      headTitle.innerHTML = title;

      Helpers.append(head, headTitle);
    }

    Helpers.append(this.el, head);

    this.head = head;
  };

  Panel.prototype.show = function show() {
    this.el.classList.add('fp-visible');
  };

  Panel.prototype.hide = function hide() {
    this.el.classList.remove('fp-visible');
  };

  Panel.prototype.isVisible = function isVisible() {
    return this.el.classList.contains('fp-visible');
  };

  return Panel;
}(Module);

// Designs Panel is the zone where we can choose a design block to use.

var DesignsPanel = function (_Panel) {
  inherits(DesignsPanel, _Panel);

  function DesignsPanel() {
    classCallCheck(this, DesignsPanel);
    return possibleConstructorReturn(this, _Panel.apply(this, arguments));
  }

  DesignsPanel.prototype.render = function render() {
    this._initFilters();
    this._initPanel();

    this.loadedDesigns = {};
  };

  // Filter the current shown design blocks.


  DesignsPanel.prototype._initFilters = function _initFilters() {
    var _this2 = this;

    // Add filter.
    var filter = document.createElement('DIV');
    filter.classList.add('fp-panel-filter');

    Helpers.append(this.head, filter);

    // Render the curent selected design blocks.

    var _loop = function _loop(blockType) {
      if (Object.prototype.hasOwnProperty.call(DesignBlock.BLOCKS, blockType)) {
        var btn = _this2.doc.createElement('A');
        btn.setAttribute('data-block-type', Helpers.underscores(blockType));
        btn.innerHTML = blockType;

        Helpers.append(filter, btn);

        _this2.events.on(btn, 'click', function () {
          setTimeout(() => {
            _this2.page.refreshIframeSize();
          }, 50);
          return _this2.setActiveBlock(blockType);
        });
      }
    };

    for (var blockType in DesignBlock.BLOCKS) {
      _loop(blockType);
    }

    // Store filter.
    this.filter = filter;
  };

  DesignsPanel.prototype._initPanel = function _initPanel() {
    // Create panel for displaying contents.
    var panel = document.createElement('DIV');
    panel.classList.add('fp-panel-panel');

    this.panel = panel;
    Helpers.append(this.body, panel);
  };

  // Refresh the filters based on the current active block type.


  DesignsPanel.prototype._refreshFilters = function _refreshFilters(blockType) {
    // Hide all panels.
    var activeBlock = this.panel.querySelector('.fp-panel-blocks-wrapper.fp-visible');
    if (activeBlock) {
      activeBlock.classList.remove('fp-visible');
      this.filter.querySelector('a.fp-active').classList.remove('fp-active');
    }

    this.filter.querySelector('a[data-block-type="' + Helpers.underscores(blockType) + '"]').classList.add('fp-active');
  };

  // Refresh designs based on the current active block type.


  DesignsPanel.prototype._refreshDesigns = function _refreshDesigns(blockType) {
    var wp = void 0;

    // Designs for the current filter weren't added yet.
    if (!this.loadedDesigns[Helpers.underscores(blockType)]) {
      wp = document.createElement('DIV');
      wp.setAttribute('data-block-type', Helpers.underscores(blockType));
      wp.classList.add('fp-panel-blocks-wrapper');

      Helpers.append(this.panel, wp);

      for (var i = 1; i <= DesignBlock.BLOCKS[blockType].length; i++) {
        var designBlock = new DesignBlock(this, blockType, DesignBlock.BLOCKS[blockType][i - 1]);
        Helpers.append(wp, designBlock.el);
      }

      this.loadedDesigns[Helpers.underscores(blockType)] = true;
    } else {
      wp = this.panel.querySelector('div.fp-panel-blocks-wrapper[data-block-type="' + Helpers.underscores(blockType) + '"]');
    }

    // Toggle classes to show the right designs.
    wp.classList.add('fp-visible');
  };

  // Set the current active block type.


  DesignsPanel.prototype.setActiveBlock = function setActiveBlock() {
    var blockType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Sections';

    // Set default block type.
    if (blockType === 'Sections') {
      blockType = this.opts.designsDefaultBlocks;
    }

    // Refresh filters.
    this._refreshFilters(blockType);

    // Refresh shown designs.
    this._refreshDesigns(blockType);
  };

  return DesignsPanel;
}(Panel);

// Init editor on the current blocks.

var Editor = function (_M) {
  inherits(Editor, _M);

  function Editor() {
    classCallCheck(this, Editor);
    return possibleConstructorReturn(this, _M.apply(this, arguments));
  }

  Editor.prototype.init = function init() {}
  // Init placeholder.


  // Merge the editor configurations
  ;

  Editor.prototype._mergeEditorOpts = function _mergeEditorOpts(userOpts, pagesOpts) {
    var _loop = function _loop(config) {
      // Combine 'initialized' event handler if user has configured same.
      if (config === 'events' && userOpts[config] && userOpts[config].hasOwnProperty('initialized')) {
        var sourceMethod = pagesOpts[config].initialized,
            targetMethod = userOpts[config].initialized,
            eventsMerged = Object.assign({}, pagesOpts[config], {
          initialized: function initialized() {
            new Function(sourceMethod.apply(this)).call();
            new Function(targetMethod.apply(this)).call();
          }
        });
        // Merge the combined initialized event handler with other event handlers
        Object.assign(userOpts[config], eventsMerged);
      } else if (_typeof(userOpts[config]) === 'object') {
        if (Array.isArray(userOpts[config])) {
          userOpts[config] = [].concat(userOpts[config], pagesOpts[config]);
          // Filter the duplicated items
          userOpts[config] = userOpts[config].filter(function (item, index) {
            return userOpts[config].indexOf(item) === index;
          });
        } else {
          Object.assign(userOpts[config], pagesOpts[config]);
        }
      } else if (!userOpts.hasOwnProperty(config)) {
        userOpts[config] = pagesOpts[config];
      }
    };

    for (var config in pagesOpts) {
      _loop(config);
    }
    return userOpts;
  };

  Editor.prototype._preventTypingInLinks = function _preventTypingInLinks(editor) {
    editor.events.on('keydown', function (kde) {
      if (editor.link.get()) {
        kde.preventDefault();

        return false;
      }

      return true;
    }, true);
  };

  Editor.prototype._isTrialExpire = function _isTrialExpire() {
    return 'not-in-trial';
  };

  Editor.prototype._createButton = function _createButton(className) {
    var modalId = this._isTrialExpire() === 'expire' ? '#myModal2' : '#myModal';
    var btn = document.createElement('BUTTON');
    btn.innerHTML = 'Upgrade to Pro!';
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-toggle', 'modal');
    btn.setAttribute('data-target', modalId);
    btn.addEventListener('touchstart', function () {
      var iframe = document.getElementById('froala-pages');
      var mobileEle = iframe.contentWindow.document.getElementsByClassName('fr-mobile');
      mobileEle[0].classList.add('fr-custom');
    });
    var proToolBars = document.createElement('DIV');
    proToolBars.setAttribute('class', 'fr-btn-grp fr-float-left pro-btn ' + className);
    proToolBars.appendChild(btn);

    return proToolBars;
  };

  Editor.prototype._addProButtonForText = function _addProButtonForText() {
    var iframe = document.getElementById('froala-pages');
    if (!iframe.contentWindow.document.getElementsByClassName('pro-btn-text').length > 0) {
      var proToolBars = this._createButton('pro-btn-text');
      var newlineElement = iframe.contentWindow.document.getElementsByClassName('fr-newline');
      var toolbarsElement = iframe.contentWindow.document.getElementsByClassName('fr-toolbar');
      toolbarsElement[0].insertBefore(proToolBars, newlineElement[0]);
      var childNodes = toolbarsElement[0].childNodes[1].getElementsByTagName('button');
      for (var i = 0; i < childNodes.length; i++) {
        childNodes[i].classList.add('fr-disabled', 'pro-toolbar');
      }
    }
  };

  Editor.prototype._addProButtonForImage = function _addProButtonForImage() {
    var iframe = document.getElementById('froala-pages');
    if (!iframe.contentWindow.document.getElementsByClassName('pro-btn-image').length > 0) {
      var proToolBars = this._createButton('pro-btn-image');
      var toolbarsElement = iframe.contentWindow.document.getElementsByClassName('fr-popup');
      var newlineElement = iframe.contentWindow.document.getElementsByClassName('fr-tooltip');
      toolbarsElement[0].insertBefore(proToolBars, newlineElement[0]);
      var childNodes = toolbarsElement[0].childNodes[0].getElementsByTagName('button');
      for (var i = 1; i < childNodes.length; i++) {
        childNodes[i].classList.add('fr-disabled', 'pro-toolbar');
      }
      toolbarsElement[0].classList.add('fr-imageProButton');
    }
  };


  Editor.prototype.enable = function enable() {
    this.FroalaEditor = this.page.iframeDoc.defaultView.FroalaEditor;
    this._defineLinkButtons();

    // scope reference used in initialized method
    var me = this;
    me._mergeEditorOpts(me.opts.editorOptions, {
      toolbarInline: true,
      pluginsEnabled: ['image', 'link', 'align', 'colors', 'emoticons', 'video', 'paragraphFormat', 'fontSize', 'fontFamily', 'table', 'lists', 'lineHeight', 'fontAwesome', 'imageTUI'],
      toolbarButtons: ['bold', 'italic', 'textColor', 'backgroundColor', 'paragraphFormat', 'align', 'emoticons', 'insertLink', 'insertImage', 'undo', 'redo', '-', 'underline', 'subscript', 'superscript', 'fontSize', 'fontFamily', 'insertTable', 'formatOL', 'formatUL', 'lineHeight', 'insertVideo', 'fontAwesome'],
      initOnClick: true,
      colorsHEXInput: false,
      keepFormatOnDelete: true,
      toolbarVisibleWithoutSelection: true,
      listAdvancedTypes: true,
      imageEditButtons: ['imageReplace', '-', 'imageAlign', 'imageRemove', 'imageLink', 'linkEdit', 'linkRemove', 'imageAlt', 'imageDisplay', 'imageStyle', 'imageSize', 'imageTUI'],
      linkEditButtons: ['linkEdit', 'linkButton', 'linkRemove'],
      htmlAllowedTags: ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'queue', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'style', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'svg', 'path'],
      htmlAllowedAttrs: ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'allowfullscreen', 'allowtransparency', 'alt', 'aria-.*', 'async', 'autocomplete', 'autofocus', 'autoplay', 'autosave', 'background', 'bgcolor', 'border', 'charset', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'contextmenu', 'controls', 'coords', 'data', 'data-.*', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'dropzone', 'enctype', 'for', 'form', 'formaction', 'frameborder', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'icon', 'id', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'mozallowfullscreen', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'scrolling', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'summary', 'spellcheck', 'style', 'tabindex', 'target', 'title', 'type', 'translate', 'usemap', 'value', 'valign', 'webkitallowfullscreen', 'width', 'wrap', 'fill', 'viewBox', 'xmlns', 'd'],
      events: {
        initialized: function initialized() {
          // this is the editor instance.
          me._preventTypingInLinks(this);
          me._replaceImageSourceWithBase64(this);
        }
      }
    });

    // Enable editor on all blocks.
    this.page.iframeBody.querySelectorAll('[data-block-type]').forEach(function (block) {
      // Enable editor on cols.
      block.querySelectorAll('[class*="col"]').forEach(function (col) {
        // No link inside it.
        if (!col.querySelector('.nav-link')) {
          new me.FroalaEditor('[class*="col"]', me.opts.editorOptions);
        }
      });

      // Init editor on header links.
      new me.FroalaEditor('header .nav-link, header nav a.btn', Object.assign({}, me.opts.editorOptions, {
        linkEditButtons: ['linkEdit', 'linkButton', 'linkAdd', 'linkDestroy'],
        linkInsertButtons: []
      }));

      // Init editor on footer links.
      new me.FroalaEditor('footer .nav-link, footer nav a.btn', Object.assign({}, me.opts.editorOptions, {
        linkEditButtons: ['linkEdit', 'linkAdd', 'linkDestroy'],
        linkInsertButtons: []
      }));
    });
  };

  // Disable editor.


  Editor.prototype.disable = function disable() {
    this.page.iframeBody.querySelectorAll('[data-block-type]').forEach(function (block) {
      block.querySelectorAll('[class*="col"]').forEach(function (col) {
        col['data-froala.editor'] && col['data-froala.editor'].destroy();
      });

      // disable editor on header/footer links
      block.querySelectorAll('footer .nav-link, footer nav a.btn, header .nav-link, header nav a.btn').forEach(function (col) {
        col.contentEditable = false;
      });
    });
  };

  // Create custom buttons for links.


  Editor.prototype._defineLinkButtons = function _defineLinkButtons() {
    var that = this;

    // Remove link.
    this.FroalaEditor.DefineIcon('linkDestroy', {
      NAME: 'trash'
    });
    this.FroalaEditor.RegisterCommand('linkDestroy', {
      type: 'button',
      title: 'Remove Link',
      callback: function callback() {
        var $oel = this.$oel;

        this.destroy();

        // Footer case.
        if ($oel.parents('.nav-item').length === 0) {
          $oel.remove();
        } else {
          $oel.parent().remove();
        }
      },
      refresh: function refresh($btn) {
        // Footer case.
        if (this.$oel.parent('.nav-item').length === 0) {
          $btn.get(0).classList.toggle('fr-disabled', this.$oel.siblings('.nav-link').length === 0);
        } else {
          $btn.get(0).classList.toggle('fr-disabled', this.$oel.parents('.nav-item').siblings('.nav-item').length === 0);
        }

        that.enable();
      }
    });

    // Add link.
    this.FroalaEditor.DefineIcon('linkAdd', {
      NAME: 'plus'
    });

    // Image TUI
    this.FroalaEditor.RegisterCommand('imageTUI', {
      title: 'Advanced Edit',
      undo: false,
      focus: false,
      callback: function callback() {

        var ele = document.getElementsByClassName('fp-block-toolbar');
        if (ele.length > 0) {
          ele[0].classList.remove('fp-visible');
        }
        this.imageTUI.launch(this, true);
      },
      plugin: 'imageTUI'
    });

    this.FroalaEditor.RegisterCommand('linkAdd', {
      type: 'button',
      title: 'Add Link',
      callback: function callback() {
        var $oel = this.$oel;

        // Footer case.
        if ($oel.parents('.nav-item').length === 0) {
          $oel.after('<a class="nav-link" href="https://www.froala.com">Link</a>');
        } else {
          $oel.parent().after('<li class="nav-item"><a class="nav-link" href="https://www.froala.com">Link</a></li>');
        }
      }
    });

    // Link button type.
    this.FroalaEditor.DefineIcon('linkButton', {
      NAME: 'star'
    });

    this.FroalaEditor.DefineIcon('insertVideo', {
      NAME: 'video-camera',
      FA5NAME: 'video',
      SVG_KEY: 'insertVideo'
    });

    this.FroalaEditor.RegisterCommand('linkButton', {
      type: 'dropdown',
      title: 'Choose Style',
      options: {
        link: 'Link',
        button: 'Button',
        outline: 'Outline'
      },
      callback: function callback(cmd, val) {
        var link = this.link.get();

        if (val === 'link') {
          link.classList.add('nav-link');
          link.classList.remove('btn', 'btn-primary', 'btn-outline-primary');
        } else if (val === 'button') {
          link.classList.remove('nav-link', 'btn-outline-primary');
          link.classList.add('btn', 'btn-primary');
        } else if (val === 'outline') {
          link.classList.remove('nav-link', 'btn-primary');
          link.classList.add('btn', 'btn-outline-primary');
        }
      }
    });
  };

  Editor.prototype._replaceImageSourceWithBase64 = function _replaceImageSourceWithBase64(editor) {
    editor.events.on('image.inserted', function (imageEl) {
      imageEl = imageEl[0];

      var request = new XMLHttpRequest();

      request.responseType = 'blob';
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          if (request.status === 200) {
            var reader = new FileReader();

            reader.readAsDataURL(request.response);
            reader.onloadend = function () {
              imageEl.src = reader.result;
            };
          }
        }
      };
      request.open('GET', imageEl.src, true);
      request.send();
    });
  };

  return Editor;
}(Module);

// Block placeholders.

var EmptyBlock = function (_M) {
  inherits(EmptyBlock, _M);

  function EmptyBlock() {
    classCallCheck(this, EmptyBlock);
    return possibleConstructorReturn(this, _M.apply(this, arguments));
  }

  EmptyBlock.prototype.init = function init(info) {
    var _this2 = this;

    // Set info about the block.
    this.name = info.name;
    this.template = info.template;

    var el = this.doc.createElement('DIV');
    el.classList.add('fp-no-block', 'fp-no-' + this.name.toLowerCase());
    el.setAttribute('data-fp', 'true');
    el.innerHTML = this.template;
    this.el = el;

    this.events.on(el, 'click', function () {
      return _this2.click();
    });
    this.events.on(el, 'mouseenter', function () {
      return _this2._mouseEnter();
    });
  };

  // Block on empty block.


  EmptyBlock.prototype.click = function click() {
    this.events.emit('emptyBlock.click', this);
  };

  // Mouse enter on empty block.


  EmptyBlock.prototype._mouseEnter = function _mouseEnter() {
    this.page.blockToolbar.hide();
  };

  return EmptyBlock;
}(Module);

EmptyBlock.HEADER = {
  name: 'Headers',
  template: '<p>Header</p>'
};

EmptyBlock.FOOTER = {
  name: 'Footers',
  template: '<p>Footer</p>'
};

EmptyBlock.SECTION = {
  name: 'Sections',
  template: 'Click here to add a design block'
};

// Events.
var Events = function () {
  function Events() {
    classCallCheck(this, Events);

    // DOM events.
    this.domEvents = {};

    // Internal events.
    this.internalEvents = {};
  }

  // Set an ID for events.


  Events.prototype._id = function _id(el) {
    if (!this._ids) {
      this._ids = {};
    }

    if (this._ids[el]) {
      return this._ids[el];
    }

    this._ids[el] = Object.keys(this._ids).length + 1;

    return this._ids[el];
  };

  // Bind DOM event.


  Events.prototype.on = function on(el, events, callback) {
    var _this = this;

    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    events.split(' ').forEach(function (event) {
      var id = _this._id(el);

      if (!_this.domEvents[id]) {
        _this.domEvents[id] = {};
      }

      if (!_this.domEvents[id][event]) {
        _this.domEvents[id][event] = [];
      }

      _this.domEvents[id][event].push({
        callback: callback,
        options: options
      });

      el.addEventListener(event, callback, options);
    });
  };

  // Turn off DOM event.


  Events.prototype.off = function off(el, events) {
    var _this2 = this;

    events.split(' ').forEach(function (event) {
      var id = _this2._id(el);

      if (_this2.domEvents[id] && _this2.domEvents[id][event]) {
        _this2.domEvents[id][event].forEach(function (info) {
          el.removeEventListener(event, info.callback, info.options);
        });
      }
    });
  };

  // Bind DOM event for a single time.


  Events.prototype.once = function once(el, events, callback) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    options.once = true;

    this.on(el, events, callback, options);
  };

  // Listen to internal event.


  Events.prototype.listen = function listen(events, callback) {
    var _this3 = this;

    events.split(' ').forEach(function (event) {
      if (!_this3.internalEvents[event]) {
        _this3.internalEvents[event] = [];
      }

      _this3.internalEvents[event].push(callback);
    });
  };

  // Emit internal event.


  Events.prototype.emit = function emit(event) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (this.internalEvents[event]) {
      this.internalEvents[event].forEach(function (callback) {
        callback.apply(undefined, args);
      });
    }
  };

  return Events;
}();

// Popup with share options.

// Toolbar that is shown at the buttom of the page.

var PageToolbar = function (_M) {
  inherits(PageToolbar, _M);

  function PageToolbar() {
    classCallCheck(this, PageToolbar);
    return possibleConstructorReturn(this, _M.apply(this, arguments));
  }

  PageToolbar.prototype.init = function init() {
    // DOM.
    this.el = this.doc.createElement('DIV');
    this.el.classList.add('fp-page-toolbar');
    Helpers.prepend(this.page.selector, this.el);

    // Buttons.
    this._addButtons(this.opts.pageLeftButtons, 'fp-lp-zone');
    this._addButtons(this.opts.pageCenterButtons, 'fp-cp-zone');
    this._addButtons(this.opts.pageRightButtons, 'fp-rp-zone');
    this.events.emit('button.refresh');
  };

  // Build buttons.


  PageToolbar.prototype._addButtons = function _addButtons(buttonsList, id) {
    var _this2 = this;

    var zone = this.doc.createElement('DIV');
    zone.classList.add('fp-btn-zone');
    if (id) {
      zone.setAttribute('id', id);
    }

    buttonsList.forEach(function (groupEl) {

      if (Array.isArray(groupEl)) {
        var group = _this2.doc.createElement('DIV');
        group.classList.add('fp-btn-group');

        groupEl.forEach(function (btnName) {
          var btn = new Button(_this2.page, btnName);

          Helpers.append(group, btn.el);
        });

        Helpers.append(zone, group);
      } else {
        zone.innerHTML += groupEl;
      }
    });

    Helpers.append(this.el, zone);
  };

  return PageToolbar;
}(Module);

var Page = function () {
  function Page(selectorId, options$$1) {
    classCallCheck(this, Page);


    // Set options.
    this.opts = Object.assign({}, options, options$$1);

    // Get current DOM.
    this.doc = document;
    this.body = document.body;

    // Container.
    this.container = this.doc.createElement('DIV');
    this.container.classList.add('fp-container');

    // render to selector element / body
    this.selector = this.doc.getElementById(selectorId) || this.body;
    Helpers.append(this.selector, this.container);

    // Actual editable zone.
    this.el = this.doc.createElement('DIV');
    this.el.classList.add('fp-element');
    Helpers.append(this.container, this.el);

    // Actual editable element.
    this.editEl = this.doc.createElement('DIV');
    this.editEl.classList.add('fp-pageTop-toolbar');
    Helpers.append(this.el, this.editEl);

    // Init events.
    this.events = new Events();

    // Init designs panel.
    this.designsPanel = new DesignsPanel(this);

    // Render UI.
    this.render();
  }

  // Here we start rendering.


  Page.prototype.render = function render() {
    this._initIframe();
    this._initEmptyBlocks();
    this._initPageToolbar();
    this._initDropZone();

    this._initBlockToolbar();

    this._initEvents();

    this._initEditor();

    // Refresh current blocks.
    this.refreshBlocks();

    // Set default view as being the FULL one.
    this.setView(VIEWS.FULL);
  };

  // Initialize Froala Editor.


  Page.prototype._initEditor = function _initEditor() {
    this.editor = new Editor(this);
  };

  // Initialize the block toolbar.


  Page.prototype._initBlockToolbar = function _initBlockToolbar() {
    this.blockToolbar = new BlockToolbar(this);
  };

  // Initialize the page toolbar.


  Page.prototype._initPageToolbar = function _initPageToolbar() {
    this.activeView = VIEWS.FULL;
    this.pageToolbar = new PageToolbar(this);

    if (this.selector !== this.body && !this.selector.style.height) {
      // set view height to 100% if there is no default value
      this.selector.style.height = '100%';
    }

    this.container.style.height = 'calc(100% - ' + this.pageToolbar.el.getBoundingClientRect().height + 'px)';
    this.data = new Data(this);

  };

  // Build stylesheets for iframe.


  Page.prototype._buildStylesheets = function _buildStylesheets() {
    var defaultStylesheets = [
      'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/froala-design-blocks/2.0.1/css/froala_blocks.css',
      'https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i',
      'https://cdn.jsdelivr.net/npm/froala-editor/css/froala_editor.pkgd.min.css',
      'https://cdn.jsdelivr.net/npm/froala-editor/css/froala_style.min.css',
      'https://cdn.jsdelivr.net/npm/tui-image-editor@3.2.2/dist/tui-image-editor.css',
      'https://uicdn.toast.com/tui-color-picker/latest/tui-color-picker.css',
      'https://cdn.jsdelivr.net/npm/froala-editor@3.1.1/css/third_party/image_tui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/fontawesome.min.css'
    ];
    var targetStylesheets = [].concat(defaultStylesheets, this.opts.designStylesheets);
    return targetStylesheets.map(function (x) {
      return '<link rel="stylesheet" href="' + x + '" />';
    }).join('');
  };

  // Build stylesheets for iframe.


  //Are you sure you want to remove this design block?
  Page.prototype._buildJavascripts = function _buildJavascripts() {
    var defaultJavascripts = [
      'https://code.jquery.com/jquery-3.3.1.slim.min.js',
      'https://cdn.jsdelivr.net/npm/sweetalert2@10',
      'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
      'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js',
      'https://cdn.jsdelivr.net/npm/froala-editor/js/froala_editor.pkgd.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.6.7/fabric.min.js',
      'https://cdn.jsdelivr.net/npm/tui-code-snippet@1.4.0/dist/tui-code-snippet.min.js',
      'https://cdn.jsdelivr.net/npm/tui-image-editor@3.2.2/dist/tui-image-editor.min.js',
      'https://cdn.jsdelivr.net/npm/froala-editor@3.1.1/js/third_party/image_tui.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/3.2.2/js/third_party/font_awesome.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/fontawesome.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/brands.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/solid.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/v4-shims.min.js'
    ];
    var targetJavascripts = [].concat(defaultJavascripts, this.opts.designJavascripts);
    return targetJavascripts.map(function (x) {
      return '<script src="' + x + '"></script>';
    }).join('');
  };

  // Init the iframe.


  Page.prototype._initIframe = function _initIframe(content) {
    var iframe = document.createElement('IFRAME');

    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
      this.iframeDoc = null;
      this.iframeBody = null;
      this.iframeHead = null;
    }

    this.iframe = iframe;
    iframe.setAttribute('src', 'about:blank');

    // id is required for pages to whitelist license conditions for Editor
    iframe.setAttribute('id', 'froala-pages');

    Helpers.append(this.el, iframe);

    // Write iframe content.
    this.iframeDoc = iframe.contentWindow.document;
    this.iframeDoc.open();
    this.iframeDoc.write('<!DOCTYPE html>');
    this.writeIframeContent(content);
    this.iframeDoc.close();

    // Add body and head.
    this.iframeBody = this.iframeDoc.body;
    this.iframeHead = this.iframeDoc.head;
    this.wrapperElement = this.iframe ? this.iframe.parentElement.parentElement.parentElement : this.doc;
  };

  Page.prototype.writeIframeContent = function writeIframeContent(data) {
    var headContent = `<meta name="viewport" content="width=device-width, initial-scale=1"></meta>${this._buildStylesheets()}<style data-fp>${this.opts.appStyle}</style>`;

    var defaultScripts = '' + this._buildJavascripts();

    if (data) {
      /*
      headContent = Array.from(data.querySelectorAll('head > meta')).map(function (el) {
        return el.outerHTML;
      }).join('\n  ') + '\n                     ' + Array.from(data.querySelectorAll('head > link')).map(function (el) {
        return el.outerHTML;
      }).join('\n  ') + '\n                     ' + Array.from(data.querySelectorAll('head > [data-fp]')).map(function (el) {
        return el.outerHTML;
      }).join('\n  ');

      var scripts = Array.from(data.querySelectorAll('body > *:not([data-fp]):not([data-block-type])')).map(function (el) {
        return el.outerHTML;
      });

      // check to verify if any new scripts are added
      for (var i = 0; i < scripts.length; i++) {
        if (defaultScripts.indexOf(scripts[i]) < 0) {
          defaultScripts += scripts[i];
        }
      }
      */
    }
    this.iframeDoc.write(`<html><head>${headContent}</head><body>${defaultScripts}</body></html>`);
  };

  // Add empty block.


  Page.prototype._initEmptyBlocks = function _initEmptyBlocks() {
    if (this.emptySection) {
      Helpers.remove(this.emptySection);
      this.emptySection = null;
    }

    this.emptySection = new EmptyBlock(this, EmptyBlock.SECTION);

    Helpers.append(this.iframeBody, this.emptySection.el);
  };

  // Refresh the size of the iframe.


  Page.prototype.refreshIframeSize = function refreshIframeSize() {
    let panel = this.doc.querySelector('.fp-panel.fp-visible .fp-panel-panel');
    let sections = [...this.iframeBody.querySelectorAll('.fdb-block')];
    let height = this.iframeBody.scrollHeight;
    if(panel) {
      height = panel.scrollHeight + this.doc.querySelector('.fp-panel-head').scrollHeight + 60;
    } else if(sections.length) {
      height = 0;
      sections.forEach(e => height += e.scrollHeight);
    }
    setTimeout(() => {
      this.iframe.style.minHeight = `${height}px`;
      this.wrapperElement.style.height = `${height + 58}px`;
    }, 50);
  };

  // Refresh page blocks.


  Page.prototype.refreshBlocks = function refreshBlocks() {
    // Check if there are blocks.
    var noBlocks = !this.iframeBody.querySelector('[data-block-type]');

    // Update CSS classes to reflect new block state.
    this.emptySection.el.classList.toggle('fp-visible', noBlocks);
    this.iframeBody.classList.toggle('no-block', noBlocks);
    this.container.classList.toggle('fp-no-block', noBlocks);

    // Change iframe size.
    this.refreshIframeSize();

    if (!noBlocks) {
      this._addEditButtons(this.opts.pageTopButtons, 'fp-tp-zone');
    }
  };

  // Build buttons.


  Page.prototype._addEditButtons = function _addEditButtons(buttonsList, id) {
    var _this = this;

    var topEle = this.doc.getElementById('fp-tp-zone');

    var pageTopEle = this.wrapperElement.getElementsByClassName('fp-pageTop-toolbar');
    pageTopEle[0].style.display = this.activeView === VIEWS.FULL ? 'none' : 'flex';

    if (topEle) {
      return;
    }
    var zone = this.doc.createElement('DIV');
    zone.classList.add('fp-btn-zone');
    if (id) {
      zone.setAttribute('id', id);
    }
    buttonsList.forEach(function (groupEl) {

      if (Array.isArray(groupEl)) {
        var group = _this.doc.createElement('DIV');
        group.classList.add('fp-btn-group');

        groupEl.forEach(function (btnName) {

          var btn = new Button(_this, btnName);

          Helpers.append(group, btn.el);
        });

        Helpers.append(zone, group);
      } else {
        zone.innerHTML += groupEl;
      }
    });

    Helpers.append(this.editEl, zone);
  };

  // Refresh current view.


  Page.prototype.setView = function setView(view) {
    var _this2 = this;

    this.activeView = view;
    // Toggle CSS classes between views.

    this.iframeBody.classList.toggle('fp-add-view', this.activeView === VIEWS.ADD);
    this.iframeBody.classList.toggle('fp-full-view', this.activeView === VIEWS.FULL);

    // Toggle design blocks zone.
    this.designsPanel.setActiveBlock();
    if (this.activeView === VIEWS.ADD) {
      this.designsPanel.show();
    } else {
      this.designsPanel.hide();
    }

    
    
    // Make header and footer not draggable.
    Array.from(this.iframeBody.querySelectorAll('[data-block-type]:not(header):not(footer)')).forEach(function (el) {
      if (_this2.activeView === VIEWS.ADD) {
        el.setAttribute('draggable', 'true');
      } else {
        el.removeAttribute('draggable');
      }
    });

    this.selector.classList.toggle('fp-add-view', this.activeView === VIEWS.ADD);
    this.selector.classList.toggle('fp-full-view', this.activeView === VIEWS.FULL);
    //this.body.classList.toggle('fp-add-view', this.activeView === VIEWS.ADD);
    //this.body.classList.toggle('fp-full-view', this.activeView === VIEWS.FULL);
    // Refresh buttons.
    this.events.emit('button.refresh');

    _this2.refreshIframeSize();
  };

  // Initialize events.


  Page.prototype._initEvents = function _initEvents() {
    var _this3 = this;

    // Click on an empty block.
    this.events.listen('emptyBlock.click', function () {
      _this3.setView(VIEWS.ADD);
    });

    // A design block was clicked.
    this.events.listen('designBlock.click', function (block) {
      return _this3.insertBlock(block);
    });
    this.events.listen('designBlock.willDrag', function (block) {
      _this3.draggingDesignBlock = block;
      _this3.dragImage = block.dragImage;

      if (_this3.dropPlaceholder) {
        _this3.dropPlaceholder.style.height = '';
      }
    });
  };

  // Drag of a block ends.


  Page.prototype._dragend = function _dragend() {
    if (this.dropPlaceholder) {
      Helpers.remove(this.dropPlaceholder);
      this.dropPlaceholder.isVisible = false;
    }

    this.body.classList.remove('fp-dragging');
  };

  // A block is dropped.


  Page.prototype._drop = function _drop(e) {
    if (navigator.userAgent.search('Firefox') >= 0) {
      e.preventDefault();
    }

    if (this.activeView === VIEWS.ADD) {
      // Sorting blocks.
      if (this.draggingBlock && this.dropPlaceholder && this.dropPlaceholder.isVisible) {
        this.draggingBlock.classList.remove('fp-dragging');
        Helpers.after(this.dropPlaceholder, this.draggingBlock);

        Helpers.remove(this.dropPlaceholder);
        Helpers.remove(this.dragImage);
      }

      // Adding block.
      if (this.draggingDesignBlock && (this.dropPlaceholder && this.dropPlaceholder.isVisible || this.container.classList.contains('fp-no-block'))) {
        this.insertBlock(this.draggingDesignBlock, this.dropPlaceholder);

        Helpers.remove(this.dropPlaceholder);
        Helpers.remove(this.dragImage);
      }

      this.dropPlaceholder.isVisible = false;
      this.draggingDesignBlock = null;
      this.draggingBlock = null;
    }

    this.body.classList.remove('fp-dragging');
  };


  // Drop placeholder.


  Page.prototype._initDropZone = function _initDropZone() {
    var _this4 = this;

    if (this.dropZone) {
      this.dropZone.remove();
      this.dropZone = null;
    }

    // create drop placeholder
    this.dropZone = this.doc.createElement('DIV');
    this.dropZone.classList.add('fp-drop-zone');
    this.dropZone.innerHTML = '<p>Drag & Drop a Design Block</p>\n                                <p>(or click one)</p>\n                                <div id="fp-drop-visual">\n                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200.26 68.42">\n                                    <path d="M6.19,9.4Q4.9,7.87,3.62,6.3L5.18,5Q6.44,6.6,7.72,8.11Z"/>\n                                    <path d="M139.15,68.42q-2,0-4,0l0-2q4.09.08,8.16,0l0,2Q141.29,68.42,139.15,68.42ZM128,68.13c-2.75-.15-5.52-.35-8.22-.61l.19-2c2.68.25,5.42.45,8.14.6Zm22.65,0-.11-2c2.7-.14,5.44-.33,8.15-.58l.18,2C156.12,67.78,153.36,68,150.63,68.12ZM166,66.79l-.24-2c2.69-.32,5.41-.7,8.09-1.11l.31,2C171.48,66.09,168.73,66.47,166,66.79Zm-53.43-.08c-2.73-.36-5.47-.78-8.15-1.25l.35-2c2.64.47,5.36.88,8.06,1.24Zm68.69-2.25-.37-2c2.66-.49,5.35-1,8-1.62l.43,2C186.68,63.41,184,64,181.28,64.46Zm-83.92-.4c-2.68-.58-5.38-1.24-8-1.94l.52-1.93c2.6.69,5.27,1.34,7.93,1.92Zm-15-3.94c-2.63-.82-5.26-1.71-7.81-2.65l.69-1.88c2.53.93,5.12,1.81,7.72,2.62ZM67.87,54.84c-2.54-1.06-5.07-2.19-7.53-3.37l.86-1.8C63.63,50.83,66.13,52,68.64,53Zm-14-6.62c-2.41-1.29-4.82-2.66-7.17-4.07l1-1.71c2.32,1.4,4.71,2.75,7.08,4ZM40.62,40.27c-2.28-1.52-4.55-3.12-6.74-4.75l1.19-1.6c2.17,1.62,4.41,3.19,6.66,4.69ZM28.19,31.08c-2.11-1.73-4.22-3.54-6.25-5.38l1.34-1.48c2,1.82,4.09,3.61,6.18,5.31ZM16.69,20.75c-1.94-1.91-3.86-3.91-5.73-5.93l1.47-1.35c1.84,2,3.74,4,5.66,5.86Z"/>\n                                    <path d="M196.38,61.16l-.49-1.94q1.94-.49,3.85-1l.52,1.93Q198.33,60.67,196.38,61.16Z"/>\n                                    <polygon points="1.39 9.88 0 0 9.24 3.73 1.39 9.88"/>\n                                  </svg>\n                                </div>\n                                ';
    Helpers.append(this.container, this.dropZone);

    // Block is dragged over.
    this.events.on(this.dropZone, 'dragover dragenter', function (e) {
      e.preventDefault();

      _this4.dropZone.classList.add('fp-hover');
    });

    // Drag ends.
    this.events.on(this.dropZone, 'dragleave dragend', function () {
      _this4.dropZone.classList.remove('fp-hover');
    });

    // Block is dropped.
    this.events.on(this.dropZone, 'drop', function (e) {
      return _this4._drop(e);
    });
  };

  // Make a design block draggable.


  Page.prototype._makeBlockDraggable = function _makeBlockDraggable(block) {
    var _this5 = this;

    var el = block.el;
    var isHeader = block.designBlock.blockType === DesignBlock.HEADER;
    var isFooter = block.designBlock.blockType === DesignBlock.FOOTER;

    // make it draggable
    if (!this.dropPlaceholder) {
      this.dropPlaceholder = this.doc.createElement('DIV');
      this.dropPlaceholder.classList.add('fp-drop-placeholder');

      this.events.on(this.iframeDoc, 'drop', function (e) {
        return _this5._drop(e);
      });
      this.events.on(this.doc, 'drop', function (e) {
        return _this5._drop(e);
      });

      this.events.on(this.iframeDoc, 'dragend', function (e) {
        return _this5._drop(e);
      });
      this.events.on(this.doc, 'dragend', function (e) {
        return _this5._drop(e);
      });

      this.events.on(this.iframeDoc, 'dragenter dragover', function (e) {
        return e.preventDefault();
      });
      this.events.on(this.doc, 'dragenter dragover', function (e) {
        return e.preventDefault();
      });
    }

    if (!isHeader && !isFooter) {
      el.setAttribute('draggable', 'true');
    }

    // Drag ends.
    this.events.on(el, 'dragover dragenter', function (e) {
      e.preventDefault();

      // Drag can be used only in ADD mode.
      if (_this5.activeView === VIEWS.ADD) {
        var cy = e.clientY;
        var ey = Helpers.offset(el).top;
        var eh = Helpers.outerHeight(el);

        // Decide where to place drop placeholder based on the current mouse position.
        if (isHeader && cy > ey) {
          Helpers.after(el, _this5.dropPlaceholder);
        } else if (isFooter && cy > ey) {
          Helpers.before(el, _this5.dropPlaceholder);
        } else if (cy > ey + eh / 2) {
          Helpers.after(el, _this5.dropPlaceholder);
        } else {
          Helpers.before(el, _this5.dropPlaceholder);
        }

        _this5.dropPlaceholder.isVisible = true;

        _this5.refreshIframeSize();
      }
    });

    // Drag starts.
    this.events.on(el, 'dragstart', function (e) {
      // Drag can be used only in ADD mode.
      if (_this5.activeView === VIEWS.ADD) {

        // Don't do it for footers and headers.
        if (isHeader || isFooter) {
          e.preventDefault();
          e.stopPropagation();

          return false;
        }

        // Let BODY element know we're dragging.
        _this5.body.classList.add('fp-dragging');

        // Create a draggable placeholder.
        _this5.dragImage = _this5.doc.createElement('IMG');
        _this5.dragImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        _this5.dragImage.style.position = 'aboslute';
        Helpers.append(_this5.body, _this5.dragImage);
        e.dataTransfer.setDragImage(_this5.dragImage, 0, 0);

        e.dataTransfer.setData('text/html', null);

        // Use a timeout so image is loaded.
        setTimeout(function () {
          Helpers.after(el, _this5.dropPlaceholder);
          _this5.dropPlaceholder.style.height = Helpers.outerHeight(el, true) + 'px';
          _this5.dropPlaceholder.isVisible = true;
          el.classList.add('fp-dragging');
        });
        _this5.draggingBlock = el;
      }

      return true;
    });
  };

  // Add a new block.


  Page.prototype.insertBlock = function insertBlock(designBlock, placeholder) {
    var _this6 = this;

    var block = new Block(this, designBlock);

    // Trigger scroll when images are loaded.
    Array.from(block.el.querySelectorAll('img')).forEach(function (img) {
      _this6.events.once(img, 'load', function () {
        return _this6.refreshIframeSize();
      });

      Helpers.scrollTo(block.el);
    });

    // Add block to the body.
    if (designBlock.blockType === DesignBlock.HEADER) {
      // Replace existing header if there is one.
      var headerEl = this.iframeBody.querySelector('header');
      if (headerEl) {
        Helpers.remove(headerEl);
      }

      Helpers.prepend(this.iframeBody, block.el);
    } else if (designBlock.blockType === DesignBlock.FOOTER) {
      // Replace existing footer if there is one.
      var footerEl = this.iframeBody.querySelector('footer');
      if (footerEl) {
        Helpers.remove(footerEl);
      }

      Helpers.append(this.iframeBody, block.el);
    } else if (placeholder && placeholder.isVisible) {
      // Place new block after placeholder.
      Helpers.after(placeholder, block.el);
    } else {
      var _footerEl = this.iframeBody.querySelector('footer');

      // Place new block at the end.
      if (_footerEl) {
        Helpers.before(_footerEl, block.el);
      } else {
        Helpers.append(this.iframeBody, block.el);
      }
    }

    // Refresh existing blocks.
    this.refreshBlocks();

    // Make new block draggable.
    this._makeBlockDraggable(block);

    // Bind click event on the new block.
    this.events.on(block.el, 'click', function (e) {
      _this6._disableEnhancedText();
      if (e.target && e.target.tagName === 'A') {
        e.preventDefault();
        return false;
      }

      if (e.target && e.target.tagName === 'A') {
        e.preventDefault();
        return false;
      }

      return true;
    });

    // Emit block inserted event.
    this.events.emit('block.inserted', block);
  };

  //Disable Enhanced text editor if pro button available


  Page.prototype._disableEnhancedText = function _disableEnhancedText() {
    var iframe = document.getElementById('froala-pages');
    if (iframe.contentWindow.document.getElementsByClassName('pro-btn-text').length > 0) {
      var toolbarsElement = iframe.contentWindow.document.getElementsByClassName('fr-toolbar');
      var childNodes = toolbarsElement[0].childNodes[1].getElementsByTagName('button');
      for (var i = 0; i < childNodes.length; i++) {
        childNodes[i].classList.add('fr-disabled', 'pro-toolbar');
      }
    }
  };

  Page.prototype.setBlockPlaceholder = function setBlockPlaceholder(block) {
    this._blockPlaceholder = block;
  };

  // Get HTML for the HEAD.


  Page.prototype._getHeadHTML = function _getHeadHTML() {
    return Array.from(this.iframeDoc.querySelectorAll('head > *')).map(function (el) {
      return el.outerHTML;
    }).join('\n  ');
  };

  // Get HTML for the BODY.


  Page.prototype._getBodyHTML = function _getBodyHTML() {
    return Array.from(this.iframeDoc.querySelectorAll('body > [data-block-type]')).map(function (el) {
      return el.outerHTML;
    }).join('\n') + '\n      ' + Array.from(this.iframeDoc.querySelectorAll('body > *:not([data-fp]):not([data-block-type])')).map(function (el) {
      return el.outerHTML;
    }).join('\n');
  };

  // Return promise which resolves get HTML for the page.


  Page.prototype.getHTML = function getHTML() {
    var _this7 = this;

    return new Promise(function (resolve, reject) {
      Data._getData(_this7.data, resolve, reject);
    });
  };

  // Get scripts from BODY.


  Page.prototype._getScripts = function _getScripts() {
    return Array.from(this.iframeDoc.querySelectorAll('body > *:not([data-fp]):not([data-block-type])')).map(function (el) {
      return el.outerHTML;
    });
  };

  // Get links from HEAD.


  Page.prototype._getLinks = function _getLinks() {
    return Array.from(this.iframeDoc.querySelectorAll('head > link')).map(function (el) {
      return el.outerHTML;
    });
  };

  // Get HTML BLOCKS from BODY.


  Page.prototype._getBlockHTML = function _getBlockHTML() {
    return Array.from(this.iframeDoc.querySelectorAll('body > [data-block-type]')).map(function (el) {
      return el.outerHTML;
    });
  };

  // Get Inline style from HEAD.


  Page.prototype._getInlineStyle = function _getInlineStyle() {
    return Array.from(this.iframeDoc.querySelectorAll('head > [data-fp]')).map(function (el) {
      return el.outerHTML;
    });
  };

  // Get the blocks as a JSON structure instead of HTML.


  Page.prototype.getJSON = function getJSON() {
    var _this8 = this;

    return new Promise(function (resolve, reject) {
      Data._getData(_this8.data, resolve, reject, true);
    });
  };

  // Load saved HTML.


  Page.prototype.setHTML = function setHTML(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');

    var sections = doc.querySelectorAll('body > [data-block-type]');

    if (!sections || !sections.length) {
      alert('Selected file has no valid design blocks. Please upload a valid template.');
      return;
    }

    // Initialize iframe.
    this._initIframe(doc);

    // set view to layout mode for further edit
    //this.setView(VIEWS.ADD);

    this._initEmptyBlocks();
    // remove old instances of dropPlaceholder
    if (this.dropPlaceholder) {
      this.dropPlaceholder.remove();
      this.dropPlaceholder = null;
    }

    // Render each blocks into view
    for (var i = 0; i < sections.length; i++) {
      var designBlock = {
        blockType: sections[i].getAttribute('data-block-type'),
        template: sections[i].outerHTML,
        render: DesignBlock.prototype.render
      };
      this.insertBlock(designBlock);
    }

    // hide blocktool bar button.
    this.blockToolbar.hide();

    // initialize blocktool bar.
    this.blockToolbar.init();

    // initialize dropzone.
    this._initDropZone();

    // Refresh current blocks.
    this.refreshBlocks();

    //
    setTimeout(() => {
      var pageTopEle = this.doc.getElementsByClassName('fp-pageTop-toolbar');
      pageTopEle[0].style.display = 'none';
  
      this.setView(VIEWS.FULL);
      this.designsPanel.hide();
  
      this.editor.enable();
    }, 600);
  };

  // Load saved JSON.


  Page.prototype.setJSON = function setJSON(jsonData) {
    var templateContent = JSON.parse(jsonData);
    var htmlHeadContent = '';
    var htmlBodyContent = '';

    for (var key in templateContent) {
      if (key === 'blocks') {
        htmlBodyContent += templateContent[key].join('');
      } else {
        htmlHeadContent += templateContent[key].join('');
      }
    }

    if (htmlHeadContent && htmlBodyContent) {
      var data = '<!DOCTYPE html>\n              <html>\n              <head>\n              ' + htmlHeadContent + '\n              </head>\n              <body>\n              ' + htmlBodyContent + '\n              </body>\n              </html>';

      this.setHTML(data);
    } else {
      alert('Please load a valid template.');
    }
  };

  Page.prototype.uploadTemplate = function uploadTemplate(templateFile) {
    var _this9 = this;

    if (templateFile.type === "text/html") {
      var reader = new FileReader();
      reader.onloadend = function () {
        _this9.setHTML(reader.result);
      };
      reader.readAsText(templateFile);
    } else {
      alert('Only HTML files are supported. Please upload a valid HTML template.');
    }
  };

  return Page;
}();

// Expose global classes.


Page.Events = Events;
Page.Helpers = Helpers;
Page.RegisterDesignBlock = DesignBlock.Register;
Page.Button = Button;

return Page;

})));
//# sourceMappingURL=froala_pages.js.map
