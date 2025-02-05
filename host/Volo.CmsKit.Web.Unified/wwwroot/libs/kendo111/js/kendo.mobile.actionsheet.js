module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1348);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 1330:
/***/ (function(module, exports) {

	module.exports = require("./kendo.mobile.shim");

/***/ }),

/***/ 1331:
/***/ (function(module, exports) {

	module.exports = require("./kendo.mobile.popover");

/***/ }),

/***/ 1348:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(1331), __webpack_require__(1330) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	var __meta__ = { // jshint ignore:line
	    id: "mobile.actionsheet",
	    name: "ActionSheet",
	    category: "mobile",
	    description: "The mobile ActionSheet widget displays a set of choices related to a task the user initiates.",
	    depends: [ "mobile.popover", "mobile.shim" ]
	};

	(function($, undefined) {
	    var kendo = window.kendo,
	        support = kendo.support,
	        ui = kendo.mobile.ui,
	        Shim = ui.Shim,
	        Popup = ui.Popup,
	        Widget = ui.Widget,
	        OPEN = "open",
	        CLOSE = "close",
	        COMMAND = "command",
	        BUTTONS = "li>a",
	        CONTEXT_DATA = "actionsheetContext",
	        WRAP = '<div class="km-actionsheet-wrapper"></div>',
	        cancelTemplate = kendo.template('<li class="km-actionsheet-cancel"><a href="\\#">#:cancel#</a></li>');

	    var ActionSheet = Widget.extend({
	        init: function(element, options) {
	            var that = this,
	                ShimClass,
	                tablet,
	                type,
	                os = support.mobileOS;

	            Widget.fn.init.call(that, element, options);

	            options = that.options;
	            type = options.type;
	            element = that.element;

	            if (type === "auto") {
	                tablet = os && os.tablet;
	            } else {
	                tablet = type === "tablet";
	            }

	            ShimClass = tablet ? Popup : Shim;

	            if (options.cancelTemplate) {
	                cancelTemplate = kendo.template(options.cancelTemplate);
	            }

	            element
	                .addClass("km-actionsheet")
	                .append(cancelTemplate({cancel: that.options.cancel}))
	                .wrap(WRAP)
	                .on("up", BUTTONS, "_click")
	                .on("click", BUTTONS, kendo.preventDefault);

	            that.view().bind("destroy", function() {
	                that.destroy();
	            });

	            that.wrapper = element.parent().addClass(type ? " km-actionsheet-" + type : "");

	            that.shim = new ShimClass(that.wrapper, $.extend({modal: os.ios && os.majorVersion < 7, className: "km-actionsheet-root"}, that.options.popup) );

	            that._closeProxy = $.proxy(that, "_close");
	            that._shimHideProxy = $.proxy(that, "_shimHide");
	            that.shim.bind("hide", that._shimHideProxy);

	            if (tablet) {
	                kendo.onResize(that._closeProxy);
	            }

	            kendo.notify(that, ui);
	        },

	        events: [
	            OPEN,
	            CLOSE,
	            COMMAND
	        ],

	        options: {
	            name: "ActionSheet",
	            cancel: "Cancel",
	            type: "auto",
	            popup: { height: "auto" }
	        },

	        open: function(target, context) {
	            var that = this;
	            that.target = $(target);
	            that.context = context;
	            that.shim.show(target);
	        },

	        close: function() {
	            this.context = this.target = null;
	            this.shim.hide();
	        },

	        openFor: function(target) {
	            var that = this,
	                context = target.data(CONTEXT_DATA);

	            that.open(target, context);
	            that.trigger(OPEN, { target: target, context: context });
	        },

	        destroy: function() {
	            Widget.fn.destroy.call(this);
	            kendo.unbindResize(this._closeProxy);
	            this.shim.destroy();
	        },

	        _click: function(e) {
	            if (e.isDefaultPrevented()) {
	                return;
	            }

	            var currentTarget = $(e.currentTarget);
	            var action = currentTarget.data("action");

	            if (action) {
	                var actionData = {
	                    target: this.target,
	                    context: this.context
	                },
	                $angular = this.options.$angular;

	                if ($angular) {
	                    this.element.injector().get("$parse")(action)($angular[0])(actionData);
	                } else {
	                    kendo.getter(action)(window)(actionData);
	                }
	            }

	            this.trigger(COMMAND, { target: this.target, context: this.context, currentTarget: currentTarget });

	            e.preventDefault();
	            this._close();
	        },

	        _shimHide: function(e) {
	            if (!this.trigger(CLOSE)) {
	                this.context = this.target = null;
	            } else {
	                e.preventDefault();
	            }
	        },

	        _close: function(e) {
	            if (!this.trigger(CLOSE)) {
	                this.close();
	            } else {
	                e.preventDefault();
	            }
	        }
	    });

	    ui.plugin(ActionSheet);
	})(window.kendo.jQuery);

	return window.kendo;

	}, __webpack_require__(3));


/***/ })

/******/ });