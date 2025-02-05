require('./kendo.core.js');

var __meta__ = {
    id: "switch",
    name: "Switch",
    category: "web",
    description: "The Switch widget is used to display two exclusive choices.",
    depends: [ "core" ]
};

(function($, undefined$1) {
    var kendo = window.kendo,
        ui = kendo.ui,
        NS = ".kendoSwitch",
        Widget = ui.Widget,
        support = kendo.support,
        CHANGE = "change",
        switchStyles = {
            widget: "k-switch",
            track: "k-switch-track",
            thumbWrapper: "k-switch-thumb-wrap",
            thumb: "k-switch-thumb",
            checked: "k-switch-on",
            checkedLabel: "k-switch-label-on",
            unchecked: "k-switch-off",
            uncheckedLabel: "k-switch-label-off",
            disabled: "k-disabled",
            readonly: "k-readonly",
            active: "k-active"
        },
        DISABLED = "disabled",
        ARIA_DISABLED = "aria-disabled",
        READONLY = "readonly",
        ARIA_READONLY = "aria-readonly",
        ARIA_CHECKED = "aria-checked",
        ARIA_HIDDEN = "aria-hidden",
        CHECKED = "checked",
        CLICK = support.click + NS,
        TOUCHEND = support.pointers ? "pointerup" : "touchend",
        KEYDOWN = "keydown" + NS,
        LABELIDPART = "_label",
        DOT = ".";

    var SWITCH_TEMPLATE = kendo.template(({ styles }) => `<span class="${styles.widget}" role="switch"></span>`);

    var SWITCH_TRACK_TEMPLATE = kendo.template(({ styles, checked, unchecked }) => `<span class='${styles.track}'>` +
        `<span class='${styles.checkedLabel}'>${checked}</span>` +
        `<span class='${styles.uncheckedLabel}'>${unchecked}</span>` +
        `</span>`);

    var SWITCH_THUMB_TEMPLATE = kendo.template(({ styles }) => `<span class='${styles.thumbWrapper}'>` +
        `<span class='${styles.thumb}'></span>` +
        `</span>`);

    var Switch = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            that._wrapper();

            that._initSettings();

            that._aria();

            that._attachEvents();

            kendo.notify(that, kendo.ui);
        },

        _wrapper: function() {
            var that = this,
                options = that.options,
                element = that.element[0],
                wrapper = $(SWITCH_TEMPLATE({
                    styles: switchStyles
                }));

            element.type = "checkbox";

            that.wrapper = that.element.wrap(wrapper).parent();

            that.wrapper[0].style.cssText = that.element[0].style.cssText;
            that.element.hide();

            that.wrapper
                .append($(SWITCH_TRACK_TEMPLATE({
                    styles: switchStyles,
                    checked: options.messages.checked,
                    unchecked: options.messages.unchecked
                })))
                .append($(SWITCH_THUMB_TEMPLATE({
                    styles: switchStyles
                })))
                .addClass(element.className)
                .removeClass('input-validation-error');

            that.options.rounded = that.options.trackRounded;
            that._applyCssClasses();
            that._applyRoundedClasses();
        },

        _applyRoundedClasses: function(action) {
            var that = this,
                options = that.options,
                trackRounded = kendo.cssProperties.getValidClass({
                    widget: options.name,
                    propName: "rounded",
                    value: options.trackRounded
                }),
                thumbRounded = kendo.cssProperties.getValidClass({
                    widget: options.name,
                    propName: "rounded",
                    value: options.thumbRounded
                });

            action = action || "addClass";

            that.wrapper.find(DOT + switchStyles.track)[action](trackRounded);
            that.wrapper.find(DOT + switchStyles.thumb)[action](thumbRounded);
        },

        _attachEvents: function() {
            var that = this;

            that.wrapper
                .on(CLICK, that._click.bind(that))
                .on(TOUCHEND, that._touchEnd.bind(that))
                .on(KEYDOWN, that._keydown.bind(that));
        },

        setOptions: function(options) {
            var that = this,
                messages = options.messages,
                checkedLabel,
                uncheckedLabel;

            that._clearCssClasses(options);
            that._applyRoundedClasses("removeClass");

            that.options = $.extend(that.options, options);

            if (messages && messages.checked !== undefined$1) {
                checkedLabel = that.wrapper.find(DOT + switchStyles.checkedLabel);
                checkedLabel.text(messages.checked);
            }

            if (messages && messages.unchecked !== undefined$1) {
                uncheckedLabel = that.wrapper.find(DOT + switchStyles.uncheckedLabel);
                uncheckedLabel.text(messages.unchecked);
            }

            if (options.width) {
                that.wrapper.css({
                    width: options.width
                });
            }

            if (options.enabled !== undefined$1) {
                that.enable(options.enabled);
            }

            if (options.readonly !== undefined$1) {
                that.readonly(options.readonly);
            }

            that.check(options.checked);

            that.options.rounded = that.options.trackRounded;
            that._applyCssClasses();
            that._applyRoundedClasses();
        },

        _initSettings: function() {
            var that = this,
                element = that.element[0],
                options = that.options;

            if (options.enabled) {
                that._tabindex();
            }

            if (options.width) {
                that.wrapper.css({
                    width: options.width
                });
            }

            if (options.checked === null) {
                options.checked = element.checked;
            }

            that.check(options.checked);

            options.enabled = options.enabled && !that.element.attr(DISABLED);
            that.enable(options.enabled);

            options.readonly = options.readonly || !!that.element.attr(READONLY);
            that.readonly(options.readonly);
        },

        _aria: function() {
            var that = this,
                element = that.element,
                wrapper = that.wrapper,
                id = element.attr("id"),
                labelFor = $("label[for=\"" + id + "\"]"),
                ariaLabel = element.attr("aria-label"),
                ariaLabelledBy = element.attr("aria-labelledby");

            if (ariaLabel) {
                wrapper.attr("aria-label", ariaLabel);
            } else if (ariaLabelledBy) {
                wrapper.attr("aria-labelledby", ariaLabelledBy);
            } else if (labelFor.length) {
                var labelId = labelFor.attr("id");

                if (!labelId) {
                    labelId = (id || kendo.guid()) + LABELIDPART;
                    labelFor.attr("id", labelId);
                }

                wrapper.attr("aria-labelledby", labelId);
            }
        },

        events: [
            CHANGE
        ],

        options: {
            name: "Switch",
            messages: {
                checked: "On",
                unchecked: "Off"
            },
            width: null,
            checked: null,
            enabled: true,
            readonly: false,
            size: "medium",
            rounded: "full",
            trackRounded: "full",
            thumbRounded: "full"
        },

        check: function(checked) {
            var that = this,
                element = that.element[0];

            if (checked === undefined$1) {
                return element.checked;
            }

            if (element.checked !== checked) {
                that.options.checked = element.checked = checked;
            }

            that.wrapper
                .attr(ARIA_CHECKED, checked)
                .toggleClass(switchStyles.checked, checked)
                .toggleClass(switchStyles.unchecked, !checked)
                .find("[aria-hidden='true']")
                .removeAttr(ARIA_HIDDEN);

            if (checked) {
                that.element
                    .attr(CHECKED, CHECKED);

                that.wrapper.find(DOT + switchStyles.uncheckedLabel)
                    .attr(ARIA_HIDDEN, true);
            } else {
                that.element
                    .prop(CHECKED, false);

                that.wrapper.find(DOT + switchStyles.checkedLabel)
                    .attr(ARIA_HIDDEN, true);
            }
        },

        // alias for check, NG support
        value: function(value) {
            if (typeof value === "string") {
                value = (value === "true");
            } else if (value === null) {
                value = false;
            }
            return this.check.apply(this, [value]);
        },

        destroy: function() {
            Widget.fn.destroy.call(this);
            this.wrapper.off(NS);
        },

        toggle: function() {
            var that = this;

            that.check(!that.element[0].checked);
        },

        enable: function(enable) {
            var element = this.element,
                wrapper = this.wrapper;

            if (typeof enable == "undefined") {
                enable = true;
            }

            this.options.enabled = enable;

            if (enable) {
                element.prop(DISABLED, false);
                wrapper.removeAttr(ARIA_DISABLED);
            } else {
                element.attr(DISABLED, DISABLED);
                wrapper.attr(ARIA_DISABLED, true);
            }

            wrapper.toggleClass(switchStyles.disabled, !enable);
        },

        readonly: function(readonly) {
            var that = this,
                element = that.element,
                wrapper = that.wrapper;

            if (typeof readonly == "undefined") {
                readonly = true;
            }

            that.options.readonly = readonly;

            if (readonly) {
                element.attr(READONLY, true);
                wrapper.attr(ARIA_READONLY, true);
            } else {
                element.prop(READONLY, false);
                wrapper.removeAttr(ARIA_READONLY);
            }

            wrapper.toggleClass(switchStyles.readonly, readonly);
        },

        _check: function() {
            var that = this,
                checked = that.element[0].checked = !that.element[0].checked;

            that.wrapper.trigger("focus");

            if (!that.options.enabled || that.options.readonly ||
                that.trigger(CHANGE, { checked: checked })) {
                that.element[0].checked = !checked;
                return;
            }

            that.check(checked);
        },

        _keydown: function(e) {
            if (e.keyCode === kendo.keys.SPACEBAR) {
                this._check();
                e.preventDefault();
            }
        },

        _isTouch: function(event) {
            return /touch/.test(event.type) || (event.originalEvent && /touch/.test(event.originalEvent.pointerType));
        },

        _click: function(e) {
            if (!this._isTouch(e) && e.which === 1) {
                if (e.target === this.element[0]) {
                    // In this case the input has been clicked directly
                    // even if hidden that is possible via <label for= >
                    // thus we should revert its checked state to trigger the change
                    this.element[0].checked = !this.element[0].checked;
                }

                this._check();
            }
        },

        _touchEnd: function(e) {
            if (this._isTouch(e)) {
                this._check();
                e.preventDefault();
            }
        }

    });

    kendo.cssProperties.registerPrefix("Switch", "k-switch-");

    kendo.cssProperties.registerValues("Switch", [{
        prop: "rounded",
        values: kendo.cssProperties.roundedValues.concat([['full', 'full']])
    }]);

    ui.plugin(Switch);
})(window.kendo.jQuery);
var kendo$1 = kendo;

module.exports = kendo$1;
