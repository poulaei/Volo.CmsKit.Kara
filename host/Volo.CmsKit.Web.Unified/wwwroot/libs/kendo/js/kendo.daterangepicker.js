require('./kendo.core.js');
require('./kendo.multiviewcalendar.js');
require('./kendo.datepicker.js');
require('./kendo.html.button.js');

let __meta__ = {
    id: "daterangepicker",
    name: "DateRangePicker",
    category: "web",
    description: "Date range picker.",
    depends: [ "core", "multiviewcalendar", "datepicker", "html.button",]
};

(function($, undefined$1) {
    let kendo = window.kendo,
        ui = kendo.ui,
        html = kendo.html,
        keys = kendo.keys,
        mediaQuery = kendo.mediaQuery,
        Widget = ui.Widget,
        MONTH = "month",
        OPEN = "open",
        CLOSE = "close",
        CHANGE = "change",
        DIV = "<div />",
        MIN = "min",
        MAX = "max",
        template = kendo.template,
        extend = $.extend,
        ID = "id",
        support = kendo.support,
        mobileOS = support.mobileOS,
        SELECTED = "k-selected",
        ARIA_EXPANDED = "aria-expanded",
        ARIA_DISABLED = "aria-disabled",
        ARIA_ACTIVEDESCENDANT = "aria-activedescendant",
        STATEDISABLED = "k-disabled",
        HIDDEN = "k-hidden",
        DISABLED = "disabled",
        READONLY = "readonly",
        ARIA_HIDDEN = "aria-hidden",
        START = "start",
        END = "end",
        ns = ".kendoDateRangePicker",
        CLICK = "click" + ns,
        MOUSEDOWN = "mousedown" + ns,
        UP = support.mouseAndTouchPresent ? kendo.applyEventMap("up", ns.slice(1)) : CLICK,
        parse = kendo.parseDate;

    var DateRangeView = function(options) {
        kendo.DateView.call(this, options);
    };

    DateRangeView.prototype = Object.create(kendo.DateView.prototype);

    function preventDefault(e) {
        e.preventDefault();
    }

    DateRangeView.prototype._calendar = function() {
        var that = this;
        var calendar = that.calendar;
        var options = that.options;
        var div;

        if (!calendar) {
            var contentElement = that.popup._content || that.popup.element;
            if (options.adaptiveMode == "auto" && !that.bigScreenMQL.mediaQueryList.matches) {
                contentElement = contentElement.append($('<div class="k-scrollable-wrap"></div>')).find(".k-scrollable-wrap");
            }

            div = $(DIV).attr(ID, kendo.guid())
                        .appendTo(contentElement);

            that.calendar = calendar = new ui.MultiViewCalendar(div, {
                size: options.adaptiveMode == "auto" && !that.bigScreenMQL.mediaQueryList.matches ? "large" : options.size || "medium",
                orientation: options.adaptiveMode == "auto" && !that.bigScreenMQL.mediaQueryList.matches ? "vertical" : "horizontal",
                views: options.adaptiveMode == "auto" && !that.bigScreenMQL.mediaQueryList.matches ? 1 : 2,
            });

            that._setOptions(options);

            calendar.navigate(that._value || that._current, options.start);

            that._range = that._range || options.range || {};

            div.on(MOUSEDOWN, preventDefault)
               .on(CLICK, "td:has(.k-link)", that._click.bind(that));

            that.calendar.selectRange(that._range);
        }
    };

    DateRangeView.prototype._setOptions = function(options) {
        var that = this;
        this.calendar.setOptions({
            allowReverse: options.allowReverse,
            focusOnNav: false,
            change: options.change,
            culture: options.culture,
            dates: options.dates,
            depth: options.depth,
            footer: options.footer,
            format: options.format,
            selectable: options.selectable,
            max: options.max,
            min: options.min,
            month: options.month,
            weekNumber: options.weekNumber,
            start: options.start,
            disableDates: options.disableDates,
            range: options.range,
            size: options.adaptiveMode == "auto" && !that.bigScreenMQL.mediaQueryList.matches ? "large" : options.size || "medium"
        });
    };

    DateRangeView.prototype.range = function(range) {
        this._range = range;

        if (this.calendar) {
            if (!range.start && !range.end) {
                this.calendar.selectRange(range);
                this.calendar.rangeSelectable.clear();
            } else {
                this.calendar.selectRange(range);
            }
        }
    };

    DateRangeView.prototype.move = function(e) {
        var that = this;
        var key = e.keyCode;
        var calendar = that.calendar;
        var selectIsClicked = e.ctrlKey && key == keys.DOWN || key == keys.ENTER;
        var handled = false;

        if (e.altKey) {
            if (key == keys.DOWN) {
                that.open();
                e.preventDefault();
                handled = true;
            } else if (key == keys.UP) {
                that.close();
                e.preventDefault();
                handled = true;
            }

        } else if (that.popup.visible()) {

            if (key == keys.ESC || (selectIsClicked && calendar._cell.hasClass(SELECTED))) {
                that.close();
                e.preventDefault();
                return true;
            }

            that._current = calendar._move(e);

            handled = true;
        }

        return handled;
    };

    DateRangeView.prototype._click = function(e) {

        if (!this.options.autoClose) {
            return;
        }

        if (mobileOS.ios || (mobileOS.android && (mobileOS.browser == "firefox" || mobileOS.browser == "chrome"))) {
            if (this._range && this._range.end) {
                this.close();
            }
        }
        else if (this._range && this._range.start && this._range.end && $(e.currentTarget).closest(".k-calendar-view").is(".k-calendar-monthview")) {
            this.close();
        }
    };

    kendo.DateRangeView = DateRangeView;

    var DateRangePicker = Widget.extend({
        init: function(element, options) {
            var that = this;
            var disabled;

            Widget.fn.init.call(that, element, options);
            element = that.element;
            options = that.options;
            options.disableDates = kendo.calendar.disabled(options.disableDates);

            options.min = parse(element.attr("min")) || parse(options.min);
            options.max = parse(element.attr("max")) || parse(options.max);

            that._initialOptions = extend({}, options);

            that._buildHTML();

            that._range = that.options.range;
            that._changeTriggered = false;

            that._initializeDateView();
            that._initializeDateViewProxy = that._initializeDateView.bind(that);

            that.bigScreenMQL = mediaQuery("large");
            that.bigScreenMQL.onChange(()=> {
                that._initializeDateViewProxy();
            });

            that._ariaTemplate = template(this.options.ARIATemplate).bind(that);
            that._reset();
            that._aria();

            that._inputs
                .on(UP + ns, that._click.bind(that))
                .on("keydown" + ns, that._keydown.bind(that));

            that._initializeDateInputs();

            that._expandButton();
            that._clearButton();

            disabled = element.is("[disabled]");
            if (disabled) {
                that.enable(false);
            } else {
                that.readonly(element.is("[readonly]"));
            }
        },

        options: {
            name: "DateRangePicker",
            labels: true,
            allowReverse: false,
            autoClose: true,
            calendarButton: false,
            clearButton: false,
            footer: "",
            format: "",
            culture: "",
            min: new Date(1900, 0, 1),
            max: new Date(2099, 11, 31),
            start: MONTH,
            depth: MONTH,
            adaptiveMode: "none",
            animation: {},
            month: {},
            startField: "",
            endField: "",
            dates: [],
            disableDates: null,
            range: null,
            ARIATemplate: ({ valueType, text }) => `Current focused ${valueType} is ${text}`,
            weekNumber: false,
            messages: {
                startLabel: "Start",
                endLabel: "End"
            },
            size: "medium",
            fillMode: "solid",
            rounded: "medium"
        },

        events: [
            OPEN,
            CLOSE,
            CHANGE
        ],

        setOptions: function(options) {
            var that = this;

            Widget.fn.setOptions.call(that, options);

            options = that.options;

            options.min = parse(options.min);
            options.max = parse(options.max);
            that._inputs.off(ns);

            that._initializeDateInputs();
            that.dateView.setOptions(options);
            that._expandButton();
            that._clearButton();
            that._range = options.range;
        },

        _aria: function() {
            this._inputs
                .attr({
                    role: "combobox",
                    "aria-haspopup": "grid",
                    "aria-expanded": false,
                    "aria-controls": this.dateView._dateViewID,
                    "autocomplete": "off"
                });
        },

        _clearButton: function() {
            let that = this,
                options = that.options,
                startInput = that._startInput,
                endInput = that._endInput,
                range = that.range();

            if (!options.clearButton) {
                return;
            }

            if (!that._startClearButton) {
                that._startClearButton = $(`<span unselectable="on" class="k-clear-value ${range && range.start ? '' : 'k-hidden'}" title="Clear the start date value">${kendo.ui.icon("x")}</span>`).attr({
                    "role": "button",
                    "tabIndex": -1
                }).insertAfter(startInput).on("click", that._clearValue.bind(that));
            }

            if (!that._endClearButton) {
                that._endClearButton = $(`<span unselectable="on" class="k-clear-value ${range && range.start ? '' : 'k-hidden'}" title="Clear the end date value">${kendo.ui.icon("x")}</span>`).attr({
                    "role": "button",
                    "tabIndex": -1
                }).insertAfter(endInput).on("click", that._clearValue.bind(that));
            }
        },

        _expandButton: function() {
            let that = this,
                startInput = that._startInput,
                endInput = that._endInput,
                options = that.options,
                startInputButton,
                endInputButton;

            if (!options.calendarButton) {
                return;
            }

            startInputButton = startInput.next("button.k-input-button");
            endInputButton = endInput.next("button.k-input-button");

            if (!startInputButton[0]) {
                startInputButton = $(html.renderButton('<button aria-label="select" tabindex="-1" class="k-input-button k-button k-icon-button"></button>', {
                    icon: "calendar",
                    size: options.size,
                    fillMode: options.fillMode,
                    shape: "none",
                    rounded: "none"
                })).insertAfter(startInput);
            }

            if (!endInputButton[0]) {
                endInputButton = $(html.renderButton('<button aria-label="select" tabindex="-1" class="k-input-button k-button k-icon-button"></button>', {
                    icon: "calendar",
                    size: options.size,
                    fillMode: options.fillMode,
                    shape: "none",
                    rounded: "none"
                })).insertAfter(endInput);
            }

            that._startDateButton = startInputButton.attr({
                "role": "button"
            }).on(CLICK, that._expandButtonClick.bind(that));

            that._endDateButton = endInputButton.attr({
                "role": "button"
            }).on(CLICK, that._expandButtonClick.bind(that));
        },

        _click: function() {
            let that = this,
                options = that.options;

            if (options.calendarButton) {
                return;
            }

            if (!that._preventInputAction && !that.dateView.popup.visible()) {
                that.dateView.open();
            }
        },

        _toggleClearButton: function(target, state) {
            let that = this;

            if (!target || !that.options.clearButton) {
                return;
            }

            if (target === START) {
                that._startClearButton.toggleClass(HIDDEN, !state);
            }

            if (target === END) {
                that._endClearButton.toggleClass(HIDDEN, !state);
            }
        },

        _clearValue: function(e) {
            let that = this,
                target = $(e.target),
                type = target.closest(".k-input").find(".k-input-inner").data("input"),
                startDateInput = that._startDateInput,
                endDateInput = that._endDateInput,
                range = that.range();

            if (type === START) {
                startDateInput.value(null);
                that.range({ start: null, end: range.end });
            }

            if (type === END) {
                endDateInput.value(null);
                that.range({ start: range.start, end: null });
            }

            that._toggleClearButton(type, false);
        },

        _expandButtonClick: function(e) {
            let that = this;

            if (!that._preventInputAction && !that.dateView.popup.visible()) {
                that.dateView.open();
                $(e.target).closest(".k-input").find(".k-input-inner").focus();
            }
        },

        _keydown: function(e) {
            var that = this,
                dateView = that.dateView,
                handled = false;

            if (that._preventInputAction) {
                e.stopImmediatePropagation();
                return;
            }

            handled = dateView.move(e);
            that._updateARIA(dateView._current);

            if (handled && e.stopImmediatePropagation) {
                e.stopImmediatePropagation();
            }
        },

        _updateARIA: function(date) {
            var that = this;
            var calendar = that.dateView.calendar;

            if (that._inputs && that._inputs.length) {
                that._inputs.removeAttr(ARIA_ACTIVEDESCENDANT);
            }

            if (calendar) {
                if (date && !calendar._dateInViews(date)) {
                    calendar.navigate(date);
                }

                if ($.contains(that.element[0], document.activeElement)) {
                    that._inputs.attr(ARIA_ACTIVEDESCENDANT, calendar._updateAria(that._ariaTemplate, date));
                }
            }
        },

        _inputFocus: function(e) {
            let that = this, range = that.range();

            if (that._currentTarget !== $(e.target).data("input")) {
                that._currentTarget = $(e.target).data("input");

                if (range) {
                    range.start = that._startDateInput.value();
                    range.end = that._endDateInput.value();
                    that.range(range);
                } else {
                    that.range({ start: null, end: null });
                }
            }
        },

        _startChange: function(e) {
            var that = this;
            var input = e.sender;
            var startValue = input.value();
            var endValue = that._endDateInput.value();

            if (that.options.disableDates(startValue)) {
                e.sender.value(null);
                startValue = null;
            }

            that.range({ start: startValue, end: endValue });

            if (!that._changeTriggered) {
                that.trigger(CHANGE);
            }

            that._toggleClearButton(START, startValue !== null);
        },

        _endChange: function(e) {
            var that = this;
            var input = e.sender;
            var endValue = input.value();
            var startValue = that._startDateInput.value();

            if (that.options.disableDates(endValue)) {
                e.sender.value(null);
                endValue = null;
            }

            that.range({ start: startValue, end: endValue });

            if (!that._changeTriggered) {
                that.trigger(CHANGE);
            }

            if (!e.blur) {
                if (that._currentTarget === END) {
                    if (!startValue || !that.options.autoClose) {
                        that._startDateInput.dateInputInstance.focus();
                    } else {
                        that._endDateInput.dateInputInstance.focus();
                    }
                } else {
                    if (!endValue || !that.options.autoClose) {
                        that._endDateInput.dateInputInstance.focus();
                    } else {
                        that._startDateInput.dateInputInstance.focus();
                    }
                }
            }

            that._toggleClearButton(END, endValue !== null);
        },
        _initializeDateView: function() {
            var that = this;
            var div;

            if (that.dateView) {
                that.dateView.destroy();
                that.dateView = null;
            }

            that.dateView = new DateRangeView(extend({}, that.options, {
                id: that.element.attr(ID),
                anchor: that.wrapper,
                views: 2,
                selectable: {
                    mode: "range",
                    reverse: that.options.allowReverse,
                    resetOnStart: false
                },
                range: that._range,
                change: function() {
                    var range = this.selectRange();
                    that.range(range);
                    that.trigger(CHANGE);
                    that._changeTriggered = true;
                    that._startDateInput.trigger(CHANGE);
                    that._endDateInput.trigger(CHANGE);
                    that._changeTriggered = false;
                },
                close: function(e) {
                    let range = that.range();
                    if (that.trigger(CLOSE)) {
                        e.preventDefault();
                    } else {
                        that._inputs.attr(ARIA_EXPANDED, false);
                        div.attr(ARIA_HIDDEN, true);

                        setTimeout(function() {
                            if (that._inputs) {
                                that._inputs.removeAttr(ARIA_ACTIVEDESCENDANT);
                            }

                            if (range) {
                                that.range(range);
                            }
                        });
                    }
                },
                open: function(e) {
                    if (that.trigger(OPEN)) {
                        e.preventDefault();
                    } else {
                        that._inputs.attr(ARIA_EXPANDED, true);
                        div.attr(ARIA_HIDDEN, false);
                        that._updateARIA();
                    }
                }
            }));

            div = that.dateView.div;
        },
        _initializeDateInputs: function() {
            var that = this;
            var options = that.options;
            var range = options.range || {};
            var inputOptions = {
                footer: options.footer,
                format: options.format,
                culture: options.culture,
                min: options.min,
                max: options.max,
                start: options.start,
                startField: options.startField,
                endField: options.endField,
                depth: options.depth,
                animation: options.animation,
                month: options.month,
                dates: options.dates,
                disableDates: options.disableDates,
                ARIATemplate: options.ARIATemplate,
                weekNumber: options.weekNumber,
                size: options.size,
                fillMode: options.fillMode,
                rounded: options.rounded
            };

            if (that._startDateInput) {
                that._startDateInput.destroy();
                that._endDateInput.destroy();
                that.wrapper.empty();
                that._buildHTML();
                that._inputs
                    .on(UP + ns, that._click.bind(that))
                    .on("keydown" + ns, that._keydown.bind(that));
            }
            that._startDateInput = that._startInput.kendoDateInput(extend(true, inputOptions, { value: range.start })).getKendoDateInput();
            that._endDateInput = that._endInput.kendoDateInput(extend(true, inputOptions, { value: range.end })).getKendoDateInput();

            that._startChangeHandler = that._startChange.bind(that);
            that._startDateInput.bind(CHANGE, that._startChangeHandler);

            that._endChangeHandler = that._endChange.bind(that);
            that._endDateInput.bind(CHANGE, that._endChangeHandler);

            that._inputs.on("focus" + ns, that._inputFocus.bind(that));
        },

        _buildHTML: function() {
            var that = this;
            var element = that.element;
            var id;

            if (!that.wrapper) {
                that.wrapper = element.addClass("k-daterangepicker");
            }

            if (that.options.labels) {
                id = kendo.guid();
                $('<span class="k-floating-label-container"><input data-input="' + START + '" id="' + id + '"/><label for="' + id + '" class="k-floating-label">' + kendo.htmlEncode(that.options.messages.startLabel) + '</label></span>').appendTo(that.wrapper);
                id = kendo.guid();
                $('<span>&nbsp;</span><span class="k-floating-label-container"><input data-input="' + END + '" id="' + id + '"/><label for="' + id + '" class="k-floating-label">' + kendo.htmlEncode(that.options.messages.endLabel) + '</label></span>').appendTo(that.wrapper);
            } else {
                $('<input data-input="' + START + '" /><span>&nbsp;</span><input data-input="' + END + '" />').appendTo(that.wrapper);
            }

            that._startInput = that.wrapper.find("input").eq(0);
            that._endInput = that.wrapper.find("input").eq(1);

            if (that.options.startField !== "") {
                that._startInput.attr(kendo.attr("bind"), "value: " + that.options.startField);
				that._startInput.attr("name", that.options.startField);
            }

            if (that.options.endField !== "") {
                that._endInput.attr(kendo.attr("bind"), "value: " + that.options.endField);
				that._endInput.attr("name", that.options.endField);
            }

            that._inputs = that._startInput.add(that._endInput);
        },

        _option: function(option, value) {
            var that = this,
                options = that.options;

            if (value === undefined$1) {
                return options[option];
            }

            value = parse(value, options.parseFormats, options.culture);

            if (!value) {
                return;
            }

            options[option] = new Date(+value);
            that.dateView[option](value);
        },

        _reset: function() {
            var that = this,
                element = that.element,
                formId = element.attr("form"),
                form = formId ? $("#" + formId) : element.closest("form");

            if (form[0]) {
                that._resetHandler = function() {
                    that.max(that._initialOptions.max);
                    that.min(that._initialOptions.min);
                };

                that._form = form.on("reset", that._resetHandler);
            }
        },

        _editable: function(options) {
            var that = this,
                inputs = that._inputs,
                readonly = options.readonly,
                disable = options.disable;

            if (!readonly && !disable) {
                that.wrapper
                    .removeClass(STATEDISABLED);

                $.each(inputs, function(key, item) {
                    item.removeAttribute(DISABLED);
                    item.removeAttribute(READONLY);
                });

                inputs.attr(ARIA_DISABLED, false);
                that._preventInputAction = false;
            } else {
                that.wrapper
                    .addClass(disable ? STATEDISABLED : "")
                    .removeClass(disable ? "" : STATEDISABLED);

                    inputs.attr(DISABLED, disable)
                       .attr(READONLY, readonly)
                       .attr(ARIA_DISABLED, disable);

                that._preventInputAction = true;
            }
        },

        destroy: function() {
            var that = this;

            if (that._startDateInput) {
                that._startDateInput.unbind(CHANGE, that._startChangeHandler);
                that._startDateInput.destroy();
                that._startChangeHandler = null;
            }

            if (that._endDateInput) {
                that._endDateInput.unbind(CHANGE, that._endChangeHandler);
                that._endDateInput.destroy();
                that._endChangeHandler = null;
            }

            if (that._startDateButton) {
                that._startDateButton.off(CLICK, that._expandButtonClick);
            }

            if (that._endDateButton) {
                that._endDateButton.off(CLICK, that._expandButtonClick);
            }

            if (that._startDateClear) {
                that._startDateClear.off(CLICK, that._clearValue);
            }

            if (that._endDateClear) {
                that._endDateClear.off(CLICK, that._clearValue);
            }

            if (that._form) {
                that._form.off("reset", that._resetHandler);
            }

            that._inputs.off(ns);
            that._inputs = null;

            if (that.bigScreenMQL) {
                that.bigScreenMQL.destroy();
            }

            that._createDateViewProxy = null;

            that.dateView.destroy();

            that.element.off(ns);

            Widget.fn.destroy.call(that);
        },

        range: function(range) {
            let that = this, target = that._currentTarget || START;

            if (range === undefined$1) {
                return that._range;
            }

            that._range = range;
            that._range["target"] = target;
            that.dateView.range({ start: null, end: null, target: target });
            if (!range) {
                that._startDateInput.value(null);
                that._endDateInput.value(null);
            }

            that._startDateInput.value(range.start ? range.start : null);
            that._endDateInput.value(range.end ? range.end : null);

            if (target === START) {
                that.dateView.range({ start: range.start, end: range.end || null, target: target });
            }

            if (target === END) {
                that.dateView.range({ start: range.start || null, end: range.end, target: target });
            }
        },

        open: function() {
            this.dateView.open();
        },

        close: function() {
            this.dateView.close();
        },

        min: function(value) {
            return this._option(MIN, value);
        },

        max: function(value) {
            return this._option(MAX, value);
        },

        readonly: function(readonly) {
            this._startDateInput.readonly(readonly);
            this._endDateInput.readonly(readonly);

            this._editable({
                readonly: readonly === undefined$1 ? true : readonly,
                disable: false
            });
        },

        enable: function(enable) {
            this._startDateInput.enable(enable);
            this._endDateInput.enable(enable);

            if (!enable) {
                this.close();
            }

            this._editable({
                readonly: false,
                disable: !(enable = enable === undefined$1 ? true : enable)
            });
        }
    });

    kendo.ui.plugin(DateRangePicker);

})(window.kendo.jQuery);
var kendo$1 = kendo;

module.exports = kendo$1;
